import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { RevokedTokenService } from './revoked-token.service';
import {
  RevokedToken,
  RevokedTokenSchema,
} from '../schemas/revoked-token.schema';
import { RevokedTokenController } from './revoked-token.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION },
    }),
    MongooseModule.forFeature([
      { name: RevokedToken.name, schema: RevokedTokenSchema },
    ]),
  ],
  controllers: [RevokedTokenController],
  providers: [AuthService, JwtAuthGuard, JwtStrategy, RevokedTokenService],
  exports: [AuthService, JwtAuthGuard, RevokedTokenService],
})
export class AuthModule {}
