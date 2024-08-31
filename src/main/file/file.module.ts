import {
    Module,
} from "@nestjs/common";
import {
    S3Module,
} from "@main/s3/s3.module";
import {
    FileController,
} from "@main/file/file.controller";
import {
    FileService,
} from "@main/file/file.service";

@Module({
    imports: [S3Module,],
    controllers: [FileController,],
    providers: [FileService,],
})
export class FileModule {}