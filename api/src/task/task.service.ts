import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async createTask(description: string, userId: string): Promise<Task> {
    const task = this.taskRepository.create({ description, userId });
    return this.taskRepository.save(task);
  }

  async findTasksByUserId(userId: string): Promise<Task[]> {
    return this.taskRepository.find({ where: { userId } });
  }
}
