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

}
