import {
    ApiOperation, ApiTags,
} from "@nestjs/swagger";
import {
    Body, Controller, Get, Param, Post, Req, UseFilters, UseGuards,
} from "@nestjs/common";
import {
    CustomUnauthorizedExceptionFilter,
} from "@main/filter/custom-unauthorized-exception.filter";
import {
    CustomForbiddenExceptionFilter,
} from "@main/filter/custom-forbidden-exception.filters";
import {
    ChatroomService,
} from "@main/chatroom/chatroom.service";
import {
    JwtAuthGuard,
} from "@main/auth/jwt/jwt-auth.guard";
import {
    ApiCustomResponseDecorator,
} from "@main/util/decorators/api-custom-response.decorator";
import {
    CreateChatRoomResponseDto,
} from "@main/chatroom/dto/res/create-chat-room.response.dto";
import {
    AuthenticatedRequest,
} from "@main/auth/jwt/jwt.types";
import {
    CreateChatRoomRequestDto,
} from "@main/chatroom/dto/req/create-chat-room.request.dto";
import CustomResponse from "@main/response/custom-response";
import {
    GetAllMemberChatroomsResponseDto,
} from "@main/chatroom/dto/res/get-all-member-chatrooms.response.dto";
import {
    GetAllListenerChatroomsResponseDto,
} from "@main/chatroom/dto/res/get-all-listener-chatrooms.response.dto";
import {
    RolesGuard,
} from "@main/auth/jwt/roles.guard";
import {
    Roles,
} from "@main/util/decorators/roles.decorator";
import {
    GetChatroomDetailResponseDto,
} from "@main/chatroom/dto/res/get-chat-room-detail.response.dto";
import {
    ParseBigIntPipe,
} from "@main/auth/pipe/parse-bigint.pipe";

@ApiTags("채팅방")
@Controller("/chatrooms")
@UseFilters(CustomUnauthorizedExceptionFilter, CustomForbiddenExceptionFilter)

export class ChatroomController {
    constructor(private readonly chatroomService: ChatroomService) {
    }

    // 채팅방 생성 API
    @ApiOperation({
        summary: "채팅방 생성 API",
    })
    @UseGuards(JwtAuthGuard)
    @ApiCustomResponseDecorator(CreateChatRoomResponseDto)
    @Post()
    async createChatroom(
        @Req() req: AuthenticatedRequest,
        @Body() body: CreateChatRoomRequestDto,
    ) {
        const member = req.member;
        const data = await this.chatroomService.createChatroom(body, member);

        return new CustomResponse<CreateChatRoomResponseDto>(data, "채팅방 생성 성공");
    }

    // (회원) 모든 채팅방 목록 조회 API
    @ApiOperation({
        summary: "(회원) 모든 채팅방 목록 조회 API",
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiCustomResponseDecorator(GetAllMemberChatroomsResponseDto)
    @Roles("MEMBER")
    @Get("/all/member")
    async getAllMemberChatRooms(@Req() req: AuthenticatedRequest,
    ): Promise<CustomResponse<GetAllMemberChatroomsResponseDto[]>> {
        const memberId = BigInt(req.member.id);
        const data = await this.chatroomService.getAllMemberChatRooms(memberId);

        return new CustomResponse<GetAllMemberChatroomsResponseDto[]>(data, "회원 채팅방 목록 조회 성공");
    }

    // (상담사) 모든 채팅방 목록 조회 API
    @ApiOperation({
        summary: "(상담사) 모든 채팅방 목록 조회 API",
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiCustomResponseDecorator(GetAllListenerChatroomsResponseDto)
    @Roles("LISTENER")
    @Get("/all/listener")
    async getAllListenerChatRooms(@Req() req: AuthenticatedRequest,
    ): Promise<CustomResponse<GetAllListenerChatroomsResponseDto[]>> {
        const memberId = BigInt(req.member.id);
        const data = await this.chatroomService.getAllListenerChatRooms(memberId);

        return new CustomResponse<GetAllListenerChatroomsResponseDto[]>(data, "상담사 채팅방 목록 조회 성공");
    }

    // 단일 채팅방 조회 API
    @ApiOperation({
        summary: "단일 채팅방 조회 API",
    })
    @UseGuards(JwtAuthGuard)
    @ApiCustomResponseDecorator(GetChatroomDetailResponseDto)
    @Get("/:roomId")
    async getChatroomById(
        @Req() req: AuthenticatedRequest,
        @Param("roomId", ParseBigIntPipe) roomId: bigint,
    ): Promise<CustomResponse<GetChatroomDetailResponseDto>> {
        const chatroom = await this.chatroomService.getChatroomById(roomId);

        return new CustomResponse<GetChatroomDetailResponseDto>(chatroom, "채팅방 조회 성공");
    }

}