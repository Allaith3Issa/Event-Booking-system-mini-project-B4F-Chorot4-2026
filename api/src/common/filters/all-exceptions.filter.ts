import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      let message: string;

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else {
        const responseBody = exceptionResponse as Record<string, unknown>;
        const responseMessage = responseBody['message'];

        if (Array.isArray(responseMessage)) {
          message = [
            ...new Set(
              responseMessage.filter(
                (item): item is string => typeof item === 'string',
              ),
            ),
          ].join('. ');
        } else if (typeof responseMessage === 'string') {
          message = responseMessage;
        } else {
          message = 'Request failed';
        }
      }

      response.status(statusCode).json({
        statusCode,
        message,
      });
      return;
    }

    this.logger.error(
      `Unexpected error on ${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
}
