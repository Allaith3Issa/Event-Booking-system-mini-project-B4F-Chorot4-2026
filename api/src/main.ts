import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.useStaticAssets(join(process.cwd(), 'public', 'images'), {
    prefix: '/images/',
  });

  app.useStaticAssets(join(process.cwd(), 'public', 'images'), {
    prefix: '/images/',
  });

  app.enableCors();

  await app.listen(3000);
}

bootstrap();
