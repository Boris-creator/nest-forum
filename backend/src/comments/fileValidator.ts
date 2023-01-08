import {
  FileTypeValidator as DefaultFileTypeValidator,
  BadRequestException,
} from "@nestjs/common";
import { codes } from "../errorCodes"

export class FileTypeValidator extends DefaultFileTypeValidator {
  isValid(files: Express.Multer.File[]): boolean {
    const invalidFiles = [];
    for (let file of files) {
      if (!super.isValid(file)) {
        invalidFiles.push(file);
      }
    }
    const valid = invalidFiles.length == 0;
    if (!valid) {
      throw new BadRequestException(
        { code: codes.FILE_FORMAT_ERR, files: invalidFiles.map((file) => file.originalname) },
        "Wrong format",
      );
    }
    return valid;
  }
}
