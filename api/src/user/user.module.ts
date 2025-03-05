import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from '../schemas/user.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule), // Usa forwardRef aquí también
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Exporta UserService si es necesario en otros módulos
})
export class UserModule {}
