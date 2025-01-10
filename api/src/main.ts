import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('Mongo URI:', process.env.MONGO_URI); // Verificar que la URI se carga
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
