import {
    Injectable,
} from "@nestjs/common";
import {
    Member, PrismaClient,
} from "@prisma/client";
import {
    CreateChatRoomRequestDto,
} from "@main/chatroom/dto/req/create-chatroom.request.dto";
import {
    CreateChatroomResponseDto,
} from "@main/chatroom/dto/res/create-chatroom.response.dto";
import NotFoundListenerException from "@main/exception/not-found.listener.exception";
import {
    IsNotListenerException,
} from "@main/exception/is-not-listener.exception";

@Injectable()
export class ChatroomService {
    constructor(private readonly prisma: PrismaClient) {
    }

    // 채팅방 생성
    async createChatroom(body: CreateChatRoomRequestDto, member: Member): Promise<CreateChatroomResponseDto> {
        const listener = await this.prisma.member.findUnique({
            where: {
                id: body.listenerId,
            },
            include: {
                listenerInfo: true,
            },
        });

        if (!listener) {
            throw new NotFoundListenerException();
        }

        if (!listener.listenerInfo) {
            throw new IsNotListenerException();
        }

        const chatRoom = await this.prisma.chatRoom.create({
            data: {
                memberId: member.id,
                listenerId: listener.listenerInfo!.id,
            },
        });

        return new CreateChatroomResponseDto(chatRoom.id.toString());
    }
}