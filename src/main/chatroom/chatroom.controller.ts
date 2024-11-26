import {
    ApiOperation, ApiTags,
} from "@nestjs/swagger";
import {
    Body, Controller, Post, Req, UseFilters, UseGuards,
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
    CreateChatroomResponseDto,
} from "@main/chatroom/dto/res/create-chatroom.response.dto";
import {
    AuthenticatedRequest,
} from "@main/auth/jwt/jwt.types";
import {
    CreateChatRoomRequestDto,
} from "@main/chatroom/dto/req/create-chatroom.request.dto";
import CustomResponse from "@main/response/custom-response";

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
    @ApiCustomResponseDecorator(CreateChatroomResponseDto)
    @Post()
    async createChatroom(
        @Req() req: AuthenticatedRequest,
        @Body() body: CreateChatRoomRequestDto,
    ) {
        const member = req.member;
        const data = await this.chatroomService.createChatroom(body, member);

        return new CustomResponse<CreateChatroomResponseDto>(data, "채팅방 생성 성공");
    }
}