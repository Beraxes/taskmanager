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

  @Prop({ default: false }) // Campo booleano con valor por defecto
  completed: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
