import {
    Body,
    Controller, Post, Req, UseFilters, UseGuards,
} from "@nestjs/common";
import {
    ApiOperation,
    ApiTags,
} from "@nestjs/swagger";
import {
    CustomUnauthorizedExceptionFilter,
} from "@main/filter/custom-unauthorized-exception.filter";
import {
    CustomForbiddenExceptionFilter,
} from "@main/filter/custom-forbidden-exception.filters";
import {
    ReservationService,
} from "@main/reservation/reservation.service";
import {
    JwtAuthGuard,
} from "@main/auth/jwt/jwt-auth.guard";
import {
    RolesGuard,
} from "@main/auth/jwt/roles.guard";
import {
    ApiCustomResponseDecorator,
} from "@main/util/decorators/api-custom-response.decorator";
import {
    CreateReservationResponseDto,
} from "@main/reservation/dto/res/create-reservation.response.dto";
import {
    Roles,
} from "@main/util/decorators/roles.decorator";
import {
    AuthenticatedRequest,
} from "@main/auth/jwt/jwt.types";
import {
    CreateReservationRequestDto,
} from "@main/reservation/dto/req/create-reservation.request.dto";
import CustomResponse from "@main/response/custom-response";

@ApiTags("상담 예약")
@Controller("/reservations")
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(CustomUnauthorizedExceptionFilter, CustomForbiddenExceptionFilter)

export class ReservationController {
    constructor(private readonly reservationService: ReservationService) {}

    @ApiOperation({
        summary: "(회원) 상담사에게 상담 예약 생성 API",
    })
    @ApiCustomResponseDecorator(CreateReservationResponseDto)
    @Roles("MEMBER")
    @Post()
    async createReservation(@Req() req: AuthenticatedRequest, @Body() body: CreateReservationRequestDto) {
        const member = req.member;
        const data = await this.reservationService.createReservation(body, member);

        return new CustomResponse<CreateReservationResponseDto>(data, "상담 예약 신청 성공");
    }

}