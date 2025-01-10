import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(
    @Body('description') description: string,
    @Body('userId') userId: string,
  ) {
    return this.taskService.createTask(description, userId);
  }

  @Get(':userId')
  async findTasks(@Param('userId') userId: string) {
    return this.taskService.findTasksByUserId(userId);
  }
}
