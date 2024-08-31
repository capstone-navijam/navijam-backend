import {
    Injectable,
} from "@nestjs/common";
import {
    ObjectCannedACL,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import {
    ConfigService,
} from "@nestjs/config";

import * as uuid from "uuid";

@Injectable()
export class S3Service {
    private readonly s3Client: S3Client;

    constructor(private readonly configService: ConfigService) {
        this.s3Client = new S3Client({
            region: this.configService.get("AWS_REGION") ?? "ap-northeast-2",
            credentials: {
                accessKeyId: this.configService.get<string>("AWS_ACCESS_KEY") ?? "",
                secretAccessKey: this.configService.get("AWS_SECRET_KEY") ?? "",
            },
        });
    }

    public async uploadProfile(file: Express.Multer.File) {
        const fileId = uuid.v4();
        const fileKey = `${this.configService.get("AWS_BUCKET_KEY_ENV")}/profiles/${fileId}`;
        const filePath = `https://s3.${this.configService.get("AWS_REGION")}.amazonaws.com/${this.configService.get("AWS_BUCKET_NAME")}/${fileKey}`;

        const command = new PutObjectCommand({
            Bucket: this.configService.get("AWS_BUCKET_NAME"),
            Key: fileKey,
            Body: file.buffer,
            ACL: ObjectCannedACL.bucket_owner_full_control,
            ContentType: file.mimetype,
        });

        await this.s3Client.send(command);

        return filePath;
    }
}