import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from '../../src/controllers/tasks.controller';
import { TasksService } from '../../src/services/tasks.service';
import { AuthUser } from '../../src/entity/auth-user.entity';
import { GetTaskFilterDto } from '../../src/dto/get-task-filter-dto';
import { CreateTaskDto } from '../../src/dto/create-task-dto';
import { UpdateTaskStatusDto } from '../../src/dto/update-task-status-dto';
import { Task } from '../../src/entity/task.entity';
import { ConfigService } from '@nestjs/config';
import { CustomLoggerService } from '../../src/services/logger-service';
import { TaskStatus } from '../../src/tasks/task-status-enum';

describe('TasksController', () => {
  let tasksController: TasksController;
  let tasksService: TasksService;

  const mockTasksService = {
    getTasks: jest.fn(),
    getTaskById: jest.fn(),
    createTask: jest.fn(),
    deleteTask: jest.fn(),
    updateTaskStatus: jest.fn(),
  };

  const mockLoggerService = {
    verbose: jest.fn(),
  };

  const mockConfigService = {};

  const mockUser: AuthUser = {
    id: '1',
    username: 'testuser',
    password: 'testpassword',
    tasks: [],
  };

  const mockTask: Task = {
    id: '1',
    taskTitle: 'Test task',
    taskDescription: 'Test description',
    taskStatus: TaskStatus.OPEN,
    user: mockUser,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        { provide: TasksService, useValue: mockTasksService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: CustomLoggerService, useValue: mockLoggerService },
      ],
    }).compile();

    tasksController = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);
  });

  describe('getTasks', () => {
    it('should get tasks', async () => {
      const filterDto: GetTaskFilterDto = {
        status: TaskStatus.OPEN,
        search: 'Test',
      };
      mockTasksService.getTasks.mockResolvedValue([mockTask]);

      const result = await tasksController.getTasks(filterDto, mockUser);
      expect(result).toEqual([mockTask]);
      expect(tasksService.getTasks).toHaveBeenCalledWith(filterDto, mockUser);
    });
  });

  describe('getTaskById', () => {
    it('should get a task by id', async () => {
      mockTasksService.getTaskById.mockResolvedValue(mockTask);

      const result = await tasksController.getTaskById('1', mockUser);
      expect(result).toEqual(mockTask);
      expect(tasksService.getTaskById).toHaveBeenCalledWith('1', mockUser);
    });
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        taskTitle: 'Test task',
        taskDescription: 'Test description',
      };
      mockTasksService.createTask.mockResolvedValue(mockTask);

      const result = await tasksController.createTask(createTaskDto, mockUser);
      expect(result).toEqual(mockTask);
      expect(tasksService.createTask).toHaveBeenCalledWith(
        createTaskDto,
        mockUser,
      );
      expect(mockLoggerService.verbose).toHaveBeenCalled();
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      mockTasksService.deleteTask.mockResolvedValue(undefined);

      await tasksController.deleteTask('1', mockUser);
      expect(tasksService.deleteTask).toHaveBeenCalledWith('1', mockUser);
    });
  });

  describe('updateTaskStatus', () => {
    it('should update task status', async () => {
      const updateTaskStatusDto: UpdateTaskStatusDto = {
        status: TaskStatus.OPEN,
      };
      mockTasksService.updateTaskStatus.mockResolvedValue({
        ...mockTask,
        status: TaskStatus.DONE,
      });

      const result = await tasksController.updateTaskStatus(
        '1',
        updateTaskStatusDto,
        mockUser,
      );
      expect(result.taskStatus).toEqual(TaskStatus.OPEN);
      expect(tasksService.updateTaskStatus).toHaveBeenCalledWith(
        '1',
        'OPEN',
        mockUser,
      );
    });
  });
});
