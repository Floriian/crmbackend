import { HttpException, HttpStatus } from '@nestjs/common';

export class NoContentException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.NO_CONTENT,
        message: 'No content found.',
      },
      HttpStatus.NO_CONTENT,
    );
  }
}
