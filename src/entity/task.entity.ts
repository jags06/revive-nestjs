import { TaskStatus } from '../tasks/task-status-enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AuthUser } from './auth-user.entity';
import { Exclude } from 'class-transformer';

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

  @ManyToOne((_type) => AuthUser, (user) => user.tasks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: AuthUser;
}
