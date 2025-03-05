import { Controller, Post, Body } from '@nestjs/common';
import { RevokedTokenService } from './revoked-token.service';
import { RevokeTokenDto } from '../dto/revoke-token.dto';

@Controller('auth')
export class RevokedTokenController {
  constructor(private readonly revokedTokenService: RevokedTokenService) {}

  @Post('revoke')
  async revokeToken(@Body() revokeTokenDto: RevokeTokenDto) {
    await this.revokedTokenService.revokeToken(revokeTokenDto.token);
    return { message: 'Token revoked successfully' };
  }
}
