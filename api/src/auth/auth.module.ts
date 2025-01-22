import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'secretKey', // Cambia esta clave en producción
      signOptions: { expiresIn: '1h' },
    }),
    forwardRef(() => UserModule), // Usa forwardRef para evitar dependencia circular
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService], // Exporta AuthService para que esté disponible en otros módulos
})
export class AuthModule {}
