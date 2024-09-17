import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from '../repository/task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entity/task.entity';
import { CreateTaskDto } from '../dto/create-task-dto';
import { GetTaskFilterDto } from '../dto/get-task-filter-dto';
import { AuthUser } from '../entity/auth-user.entity';
import { TaskStatus } from '../tasks/task-status-enum';
import { CustomLoggerService } from './logger-service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: TaskRepository,
    private readonly logger: CustomLoggerService,
  ) {}

  async getTasks(filterDto: GetTaskFilterDto, user: AuthUser): Promise<Task[]> {
    this.logger.log(
      `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`,
    );
    const { status, search } = filterDto;
    const query = this.taskRepository.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.taskStatus = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(LOWER(task.taskTitle) LIKE LOWER(:search) OR LOWER(task.taskDescription) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${user.username}". Filters: ${JSON.stringify(
          filterDto,
        )}`,
        error.stack,
      );
      throw new NotFoundException(
        `Failed to get tasks for user "${user.username}".`,
      );
    }
  }
  async getTaskById(id: string, user: AuthUser): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id, user } });
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: AuthUser,
  ): Promise<Task> {
    const { taskTitle, taskDescription } = createTaskDto;
    const task = this.taskRepository.create({
      taskTitle: taskTitle,
      taskDescription: taskDescription,
      taskStatus: TaskStatus.OPEN,
      user,
    });

    await this.taskRepository.save(task);
    return task;
  }
  async deleteTask(id: string, user: AuthUser): Promise<void> {
    const result = await this.taskRepository.delete({ id, user });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: AuthUser,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.taskStatus = status;
    await this.taskRepository.save(task);
    return task;
  }
}
