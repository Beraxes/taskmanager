import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity('tasks')
export class Task {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  description: string;

  @Column({ default: false })
  completed: boolean;

  @Column()
  userId: string; // ID del usuario al que pertenece la tarea
}
