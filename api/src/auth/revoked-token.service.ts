import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  RevokedToken,
  RevokedTokenDocument,
} from '../schemas/revoked-token.schema';

@Injectable()
export class RevokedTokenService {
  constructor(
    @InjectModel(RevokedToken.name)
    private revokedTokenModel: Model<RevokedTokenDocument>,
  ) {}

  async revokeToken(token: string): Promise<void> {
    await this.revokedTokenModel.create({ token });
  }

  async isTokenRevoked(token: string): Promise<boolean> {
    const revokedToken = await this.revokedTokenModel.findOne({ token }).exec();
    return !!revokedToken;
  }
}
