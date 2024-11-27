import {
    Injectable,
} from "@nestjs/common";
import {
    Member,
    PrismaClient,
} from "@prisma/client";
import {
    CreateReservationRequestDto,
} from "@main/reservation/dto/req/create-reservation.request.dto";
import {
    CreateReservationResponseDto,
} from "@main/reservation/dto/res/create-reservation.response.dto";
import NotFoundListenerException from "@main/exception/not-found.listener.exception";
import {
    AlreadyReservationException,
} from "@main/exception/already-reservation.exception";
import {
    IsNotListenerException,
} from "@main/exception/is-not-listener.exception";

@Injectable()
export class ReservationService {
    constructor(private readonly prisma: PrismaClient) {
    }

    async createReservation(body: CreateReservationRequestDto, member: Member): Promise<CreateReservationResponseDto> {
        return await this.prisma.$transaction(async tx => {
            const existsListener = await tx.member.findUnique({
                where: {
                    id: body.listenerId,
                },
                include: {
                    listenerInfo: true,
                },
            });

            // 상담사 정보 유무
            if (!existsListener) {
                throw new NotFoundListenerException();
            }

            // 상담사인지 유무 확인
            if (!existsListener.listenerInfo) {
                throw new IsNotListenerException();
            }

            // 상담 예약 생성
            const reservation = await tx.reservation.create({
                data: {
                    memberId: member.id,
                    listenerId: existsListener.id,
                },
            });

            // 상담사와의 채팅 이력 확인
            const existsChatroom = await tx.chatRoom.findUnique({
                where: {
                    chatUniqueKey: {
                        memberId: member.id,
                        listenerId: existsListener.listenerInfo.id,
                    },
                },
            });

            // 채팅방 유무 확인
            if (existsChatroom) {
                if (existsChatroom.isEnabled) { // 상담이 이미 진행중이라면
                    throw new AlreadyReservationException();
                }
                await tx.chatRoom.update({ // 기존 채팅방 다시 활성화
                    where: {
                        id: existsChatroom.id,
                    },
                    data: {
                        isEnabled: true,
                    },
                });
            } else {
                await tx.chatRoom.create({ // 채팅방 새로 생성
                    data: {
                        memberId: member.id,
                        listenerId: existsListener.listenerInfo.id,
                    },
                });
            }

            return new CreateReservationResponseDto(reservation.id.toString());
        });
    }
}