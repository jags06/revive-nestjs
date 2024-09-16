import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';

import { Task } from '../entity/task.entity';
import { GetTaskFilterDto } from '../dto/get-task-filter-dto';
import { CreateTaskDto } from '../dto/create-task-dto';
import { UpdateTaskStatusDto } from '../dto/update-task-status-dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { AuthUser } from '../entity/auth-user.entity';
import { ConfigService } from '@nestjs/config';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(
    private tasksService: TasksService,
    private configService: ConfigService,
  ) {
    this.tasksService = tasksService;
  }
  @Get()
  async getTasks(
    @Query() filterDto: GetTaskFilterDto,
    @GetUser() user: AuthUser,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`,
    );
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
