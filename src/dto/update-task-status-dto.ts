import { IsEnum } from 'class-validator';
import { TaskStatus } from '../tasks/task-status-enum';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
