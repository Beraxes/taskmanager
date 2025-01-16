import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

dotenv.config({ path: '.env' });

async function bootstrap() {
  console.log('Loading environment variables...');
  console.log('MONGO_URI:', process.env.MONGO_URI);
  console.log('PORT:', process.env.PORT);

  if (!process.env.MONGO_URI || !process.env.PORT) {
    throw new Error('Environment variables MONGO_URI and PORT are not set');
  }

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT);
}

bootstrap();
