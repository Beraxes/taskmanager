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
  NotFoundException,
  Req,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTaskDto, UpdateTaskDto } from '../dto/task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto, @Request() req: any) {
    return this.taskService.create(createTaskDto, req.user.userId);
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
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req: any,
  ) {
    return this.taskService.update(id, updateTaskDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteTask(@Param('id') id: string, @Request() req: any) {
    return this.taskService.delete(id, req.user.userId);
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string, @Req() req) {
    const task = await this.taskService.findById(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.isPublic || req.user) {
      return task;
    }

    throw new NotFoundException('Task not found or not accessible');
  }
}
