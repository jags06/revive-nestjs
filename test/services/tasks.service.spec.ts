import { Test } from '@nestjs/testing';
import { TasksService } from '../../src/tasks/tasks.service';
import { Task } from '../../src/entity/task.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthUser } from '../../src/entity/auth-user.entity';
import { TaskStatus } from '../../src/tasks/task-status-enum';
import { CreateTaskDto } from '../../src/dto/create-task-dto';

describe('TasksService', () => {
  let service: TasksService;
  let taskRepository: Repository<Task>;
  const TASK_REPOSITORY_TOKEN = getRepositoryToken(Task);

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TASK_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskRepository = module.get<Repository<Task>>(TASK_REPOSITORY_TOKEN);
  });
  it('TaskService should be defined', () => {
    expect(service).toBeDefined();
  });

  it('TaskRepository should be defined', () => {
    expect(taskRepository).toBeDefined();
  });
  describe('createTask', () => {
    it('should create a task', async () => {
      const task = new CreateTaskDto();
      const user = new AuthUser();
      user.username = 'user';
      user.id = '1';
      user.tasks = [];
      user.password = 'password';
      task.taskTitle = 'Test task';
      task.taskDescription = 'Test desc';
      taskRepository.create = jest.fn().mockReturnValue(task);
      taskRepository.save = jest.fn().mockResolvedValue(task);
      const result = await service.createTask(task, user);
      expect(result).toEqual(task);
    });
  });
  describe('getTasks', () => {
    it('should return all tasks', async () => {
      const task = new Task();
      const user = new AuthUser();
      user.username = 'user';
      user.id = '1';
      user.tasks = [];
      user.password = 'password';
      task.taskTitle = 'Test task';
      task.taskDescription = 'Test desc';
      taskRepository.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([task]),
      });
      const result = await service.getTasks(
        { status: TaskStatus.OPEN, search: 'Test' },
        user,
      );
      expect(result).toEqual([task]);
    });
  });

  describe('getTaskById', () => {
    it('should return a task by id', async () => {
      const task = new Task();
      const user = new AuthUser();
      user.username = 'user';
      user.id = '1';
      user.tasks = [];
      user.password = 'password';
      task.taskTitle = 'Test task';
      task.taskDescription = 'Test desc';
      taskRepository.findOne = jest.fn().mockResolvedValue(task);
      const result = await service.getTaskById('1', user);
      expect(result).toEqual(task);
    });
  });
  describe('deleteTask', () => {
    it('should delete a task by id', async () => {
      const task = new Task();
      const user = new AuthUser();
      user.username = 'user';
      user.id = '1';
      user.tasks = [];
      user.password = 'password';
      task.taskTitle = 'Test task';
      task.taskDescription = 'Test desc';
      taskRepository.delete = jest.fn().mockResolvedValue({ affected: 1 });
      const result = await service.deleteTask('1', user);
      expect(result).toEqual(undefined);
    });
  });
  describe('updateTaskStatus', () => {
    it('should update a task status', async () => {
      const task = new Task();
      const user = new AuthUser();
      user.username = 'user';
      user.id = '1';
      user.tasks = [];
      user.password = 'password';
      task.taskTitle = 'Test task';
      task.taskDescription = 'Test desc';
      taskRepository.findOne = jest.fn().mockResolvedValue(task);
      taskRepository.update = jest.fn().mockResolvedValue({ affected: 1 });
      const result = await service.updateTaskStatus('1', TaskStatus.DONE, user);
      expect(result).toEqual({
        taskTitle: 'Test task',
        taskDescription: 'Test desc',
        taskStatus: TaskStatus.DONE,
      });
    });
  });
});
