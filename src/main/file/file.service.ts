import {
    Injectable,
} from "@nestjs/common";
import {
    S3Service,
} from "@main/s3/s3.service";

@Injectable()
export class FileService {
    constructor(private readonly s3Service: S3Service) {}

    async upload(file: Express.Multer.File): Promise<string> {
        return await this.s3Service.uploadProfile(file);
    }

    async delete(filePath: string) {
        await this.s3Service.deleteFile(filePath);
    }
}