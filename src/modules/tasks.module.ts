import { Module } from '@nestjs/common';
import { TasksController } from '../controllers/tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from '../repository/task.repository';
import { Task } from '../entity/task.entity';
import { AuthModule } from './auth-user.module';
import { ConfigModule } from '@nestjs/config';
import { TasksService } from '../services/tasks.service';

@Module({
  imports: [ConfigModule, AuthModule, TypeOrmModule.forFeature([Task])],
  controllers: [TasksController],
  providers: [TasksService, TaskRepository],
})
export class TasksModule {}
