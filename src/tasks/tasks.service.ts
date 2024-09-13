import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from '../repository/task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskStatus } from './task-status-enum';
import { Task } from 'src/entity/task.entity';
import { CreateTaskDto } from 'src/dto/create-task-dto';
import { GetTaskFilterDto } from 'src/dto/get-task-filter-dto';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private taskRepository: TaskRepository) {}

  async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.taskRepository.createQueryBuilder('task');
    if (status) {
      query.andWhere('task.taskStatus = :status', { status });
    }
    if (search) {
      query.andWhere(
        'LOWER(task.taskTitle) LIKE LOWER(:search) OR LOWER(task.taskDescription) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }
    const tasks = await query.getMany();
    return tasks;
  }
  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { taskTitle, taskDescription } = createTaskDto;

    const task = this.taskRepository.create({
      taskTitle: taskTitle,
      taskDescription: taskDescription,
      taskStatus: TaskStatus.OPEN,
    });

    await this.taskRepository.save(task);
    return task;
  }
  async deleteTask(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.taskStatus = status;
    await this.taskRepository.save(task);
    return task;
  }
}
