import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ default: false })
  completed: boolean;

  @Prop({ default: 'none' })
  category: string;

  @Prop({ required: true, default: false })
  isPublic: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
