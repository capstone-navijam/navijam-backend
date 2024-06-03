import {
    BadRequestException, PipeTransform,
} from "@nestjs/common";
import {
    SignupMemberRequestDto,
} from "../dto/req/signup-member.request.dto";
import {
    SignupListenerRequestDto,
} from "@main/auth/dto/req/signup-listener.request.dto";

export default class CheckPasswordPipe implements PipeTransform {
    transform(signupRequestDto: SignupMemberRequestDto | SignupListenerRequestDto)
        : SignupMemberRequestDto | SignupListenerRequestDto {
        const isEqualsWithCheckPassword =
            signupRequestDto.password === signupRequestDto.checkPassword;

        if (!isEqualsWithCheckPassword) {
            throw new BadRequestException("비밀번호가 일치하지 않습니다.");
        }

        return signupRequestDto;
    }
}