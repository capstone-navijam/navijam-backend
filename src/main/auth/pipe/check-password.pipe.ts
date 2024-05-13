import {
    BadRequestException, PipeTransform,
} from "@nestjs/common";
import {
    SignupRequestDto,
} from "../dto/req/signup.request.dto";

export default class CheckPasswordPipe implements PipeTransform {
    transform(signupRequestDto: SignupRequestDto): SignupRequestDto {
        const isEqualsWithCheckPassword =
            signupRequestDto.password === signupRequestDto.checkPassword;

        if (!isEqualsWithCheckPassword) {
            throw new BadRequestException("비밀번호가 일치하지 않습니다.");
        }

        return signupRequestDto;
    }
}