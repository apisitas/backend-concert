import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
const dotenv = require('dotenv');
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove extra properties automatically
      forbidNonWhitelisted: true, // throw error if extra properties are present
      transform: true, // automatically transform payload to DTO instance
    }),
  );
  
  app.enableCors({
    origin: process.env.FRONTEND_URL, // your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // if you use cookies
  });
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3500);
}
bootstrap();
