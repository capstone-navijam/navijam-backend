import {
    Controller, Get,
} from "@nestjs/common";
import {
    ApiOperation,
    ApiTags,
} from "@nestjs/swagger";
import {
    ListenerService,
} from "@main/listener/listener.service";
import {
    ApiCustomResponseDecorator,
} from "@main/util/decorators/api-custom-response.decorator";
import {
    GetAllListenerResponseDto,
} from "@main/listener/dto/res/get-all-listener.response.dto";
import CustomResponse from "@main/response/custom-response";

@ApiTags("상담사 리스트")
@Controller("/listeners")

export class ListenerController {
    constructor(private readonly listenerService: ListenerService) {
    }

    // 상담사 리스트 전체 조회 API
    @ApiOperation({
        summary: "상담사 리스트 전체 조회 API",
    })
    @ApiCustomResponseDecorator(GetAllListenerResponseDto)
    @Get()
    async getAllListener(): Promise<CustomResponse<GetAllListenerResponseDto[]>> {
        const data = await this.listenerService.getAllListener();

        return new CustomResponse<GetAllListenerResponseDto[]>(data, "상담사 전체 조회 성공");
    }
}
