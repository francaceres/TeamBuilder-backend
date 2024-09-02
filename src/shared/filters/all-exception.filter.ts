import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaClientExceptionFilter } from '.';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly prismaClientExceptionFilter =
    new PrismaClientExceptionFilter();

  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof PrismaClientKnownRequestError) {
      return this.prismaClientExceptionFilter.catch(exception, host);
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(statusCode).json({
      statusCode,
      message:
        exception instanceof HttpException
          ? exception.message
          : 'Internal server error',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
