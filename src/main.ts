import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  // Loads .env from root by default
  dotenv.config();

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3500;
  console.log('Loaded PORT:', process.env.PORT);

  await app.listen(port);
  console.log(`Backend running on port ${port}`);
}

bootstrap();
