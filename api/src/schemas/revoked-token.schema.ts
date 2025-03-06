import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class RevokedToken extends Document {
  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ required: true, default: Date.now, expires: 3600 })
  expiresAt: Date;
}

export type RevokedTokenDocument = RevokedToken & Document;
export const RevokedTokenSchema = SchemaFactory.createForClass(RevokedToken);
