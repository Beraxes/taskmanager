import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class RevokedToken extends Document {
  @Prop({ required: true, unique: true })
  token: string;
}

export type RevokedTokenDocument = RevokedToken & Document;
export const RevokedTokenSchema = SchemaFactory.createForClass(RevokedToken);
