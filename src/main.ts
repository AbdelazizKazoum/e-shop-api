/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // ✅ Enable CORS with default or custom options
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*', // Allow all or comma-separated origins from env
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useLogger(app.get(Logger));

  await app.listen(process.env.PORT ?? 5000, '0.0.0.0');
  // await app.listen(5000, '0.0.0.0');
}
bootstrap();
