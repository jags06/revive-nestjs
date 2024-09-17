import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { Task } from '../entity/task.entity';
import { GetTaskFilterDto } from '../dto/get-task-filter-dto';
import { CreateTaskDto } from '../dto/create-task-dto';
import { UpdateTaskStatusDto } from '../dto/update-task-status-dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth-user/get-user.decorator';
import { AuthUser } from '../entity/auth-user.entity';
import { ConfigService } from '@nestjs/config';
import { TasksService } from '../services/tasks.service';
import { CustomLoggerService } from '../services/logger-service';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(
    private tasksService: TasksService,
    private configService: ConfigService,
    private readonly logger: CustomLoggerService,
  ) {
    this.tasksService = tasksService;
  }
  @Get()
  async getTasks(
    @Query() filterDto: GetTaskFilterDto,
    @GetUser() user: AuthUser,
  ): Promise<Task[]> {
    return this.tasksService.getTasks(filterDto, user);
  }
  @Get('/:id')
  async getTaskById(
    @Param('id') id: string,
    @GetUser() user: AuthUser,
  ): Promise<Task> {
    return await this.tasksService.getTaskById(id, user);
  }
  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: AuthUser,
  ): Promise<Task> {
    this.logger.verbose(
      `User "${user.username}" creating a new task. Data: ${JSON.stringify(createTaskDto)}`,
    );
    return await this.tasksService.createTask(createTaskDto, user);
  }
  @Delete('/:id')
  async deleteTask(
    @Param('id') id: string,
    @GetUser() user: AuthUser,
  ): Promise<void> {
    return await this.tasksService.deleteTask(id, user);
  }
  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: AuthUser,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return await this.tasksService.updateTaskStatus(id, status, user);
  }
}
