import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Task } from 'src/entity/task.entity';

@Injectable()
export class TaskRepository extends Repository<Task> {}
