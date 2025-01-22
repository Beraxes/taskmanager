import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTask(
    @Body('title') title: string,
    @Body('description') description: string,
    @Request() req: any,
  ) {
    return this.taskService.create(title, description, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserTasks(@Request() req: any) {
    return this.taskService.getAllByUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateTask(
    @Param('id') id: string,
    @Body('title') title: string,
    @Body('description') description: string,
    @Request() req: any,
  ) {
    return this.taskService.update(id, title, description, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteTask(@Param('id') id: string, @Request() req: any) {
    return this.taskService.delete(id, req.user.userId);
  }
}
