import {
    BadRequestException,
    Body,
    Controller, ForbiddenException, Post,
} from "@nestjs/common";
import {
    MembersService,
} from "@main/members/members.service";
import {
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiOperation, ApiTags,
} from "@nestjs/swagger";
import {
    CreateMemberDto,
} from "@main/members/dto/create-member.dto";
import {
    SignUpResponseDto,
} from "@main/members/dto/signup.respnose.dto";

@ApiTags("일반 사용자 관련")
@Controller("/members")
export class MembersController {
    constructor(
        private readonly membersService: MembersService,
    ) {
    }

    @ApiOperation({
        summary: "회원가입 ",
    })
    @ApiForbiddenResponse({
        description: "이미 존재하는 회원입니다.",
    })
    @ApiCreatedResponse({
        description: "회원가입 성공",
        type: SignUpResponseDto,
    })
    @Post("/signup")
    async signup(@Body() createMemberDto: CreateMemberDto) {
        try {

            await this.membersService.create(createMemberDto);

            return {
                statusCode: 201,
                message: "회원가입 성공",
            };
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw new ForbiddenException({
                    statusCode: 400,
                    message: error.message,
                }
                );
            }
            throw error;
        }
    }
}