import {
    Controller, FileTypeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors,
} from "@nestjs/common";
import {
    FileService,
} from "@main/file/file.service";
import CustomResponse from "@main/response/custom-response";
import {
    FileInterceptor,
} from "@nestjs/platform-express";

@Controller("file")
export class FileController {
    constructor(private readonly fileService: FileService) {
    }

    @UseInterceptors(FileInterceptor("file"))
    @Post()
    async fileUpload(@UploadedFile(
        new ParseFilePipe({
            validators: [
                new FileTypeValidator({
                    fileType: /image\/(png|jpeg|gif)$/,
                }),
            ],
        })
    ) file: Express.Multer.File): Promise<CustomResponse<string>> {
        console.log(file);
        const result = await this.fileService.upload(file);

        return new CustomResponse(result, "파일 업로드 성공");
    }
}