import { TaskStatus } from 'src/tasks/task-status-enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  taskTitle: string;
  @Column()
  taskDescription: string;
  @Column()
  taskStatus: TaskStatus;
}
