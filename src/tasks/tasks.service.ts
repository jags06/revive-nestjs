import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task-dto';
import { TaskRepository } from './repository/task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entity/task.entity';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private taskRepository: TaskRepository) {}

  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  /*   async getTaskById(id: string): Promise<Task> {
    const found = this.tasks.find((task) => task.id === id);
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }
  getAllTasks(): Task[] {
    console.log('Hitting get all task ', this.tasks);
    return this.tasks;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { taskTitle, taskDescription } = createTaskDto;

    const task: Task = {
      id: uuid(),
      taskTitle,
      taskDescription,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    console.log('task created', task);
    return task;
  }
  async deleteTask(id: string): Promise<void> {
    console.log('check the Delete', id);
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
    }
  }
  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    console.log('Patch Task', task);
    return task;
  }

  async getTasksWithFilters(filterDto: GetTaskFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();
    if (status) {
      console.log('Status asked ', status);
      tasks = tasks.filter(
        (task: { status: TaskStatus }) => task.status === status,
      );
    }
    if (search) {
      tasks = tasks.filter((task) => {
        if (
          task.taskTitle.toLowerCase().includes(search) ||
          task.taskDescription.toLowerCase().includes(search)
        ) {
          return true;
        }
        return false;
      });
    }
    console.log(tasks);
    return tasks;
  }
 */
}
