import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  if (!process.env.MONGO_URI || !process.env.PORT) {
    throw new Error('Environment variables MONGO_URI and PORT are not set');
  }

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true, // o un dominio específico como 'https://tudominio.com'
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remueve propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Bloquea datos no definidos en el DTO
      transform: true, // Convierte automáticamente los datos al DTO
      exceptionFactory: (errors) => {
        return new BadRequestException({
          message: errors.map((err) => Object.values(err.constraints)).flat(),
        });
      },
    }),
  );
  await app.listen(process.env.PORT);
}

bootstrap();
