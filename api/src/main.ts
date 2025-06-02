import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as process from 'node:process';

async function bootstrap() {
  const port = process.env.PORT ?? 3000;
  const app = await NestFactory.create(AppModule, { cors: true });

  app.enableCors();
  app.setGlobalPrefix('api');
  app.use(cookieParser());

  await app.listen(port);
}
bootstrap();
