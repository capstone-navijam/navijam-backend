import {
    BadRequestException, Injectable, PipeTransform,
} from "@nestjs/common";

@Injectable()
export class ParseBigIntPipe implements PipeTransform<string, bigint> {
    transform(value: string): bigint {
        try {
            return BigInt(value);
        } catch (e) {
            throw new BadRequestException(`Invalid parameter: ${value} is not a valid BigInt`);
        }
    }
}