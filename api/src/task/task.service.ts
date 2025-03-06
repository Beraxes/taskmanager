import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from '../schemas/task.schema';
import { CreateTaskDto, UpdateTaskDto } from '../dto/task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const newTask = new this.taskModel({ ...createTaskDto, userId });
    return newTask.save();
  }

  async getAllByUser(userId: string): Promise<Task[]> {
    return this.taskModel.find({ userId }).exec();
  }

  async update(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<Task> {
    const task = await this.taskModel.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');
    if (task.userId !== userId)
      throw new UnauthorizedException('You can only update your own tasks');

    Object.assign(task, updateTaskDto);
    return task.save();
  }

  async delete(taskId: string, userId: string): Promise<{ message: string }> {
    const task = await this.taskModel.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');
    if (task.userId !== userId)
      throw new UnauthorizedException('You can only delete your own tasks');

    await this.taskModel.deleteOne({ _id: taskId });
    return { message: 'Task deleted successfully' };
  }

  async findById(id: string): Promise<Task | null> {
    return this.taskModel.findById(id).exec();
  }
}
