import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGO_URI || 'mongodb://nest:nest123@localhost:27017',
      synchronize: true, // Sincroniza automáticamente las entidades con la base de datos (no recomendado en producción)
      useUnifiedTopology: true,
    }),
    UserModule,
    TaskModule,
  ],
})
export class AppModule {}
