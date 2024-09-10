import { DataSource, Repository } from 'typeorm';
import { CreateTaskDto } from '../dto/create-task-dto';
import { TaskStatus } from '../task-status-enum';
import { Injectable } from '@nestjs/common';
import { Task } from '../entity/task.entity';

@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(private readonly dataSource: DataSource) {
    super(Task, dataSource.manager);
  }
  public async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { taskTitle, taskDescription } = createTaskDto;

    const task = this.create({
      taskTitle: taskTitle,
      taskDescription: taskDescription,
      taskStatus: TaskStatus.OPEN,
    });

    await this.save(task);
    return task;
  }
}
