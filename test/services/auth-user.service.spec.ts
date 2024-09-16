import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthUserService } from '../../src/auth/auth-user.service';
import { AuthUser } from '../../src/entity/auth-user.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthUserCredentialsDto } from '../../src/dto/auth-credentials.dto';

describe('AuthUserService', () => {
  let authUserService: AuthUserService;
  let authUserRepository: Repository<AuthUser>;
  const TASK_REPOSITORY_TOKEN = getRepositoryToken(AuthUser);

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthUserService,
        {
          provide: TASK_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    authUserService = module.get<AuthUserService>(AuthUserService);
    authUserRepository = module.get<Repository<AuthUser>>(
      TASK_REPOSITORY_TOKEN,
    );
  });
  it('authUserService should be defined', () => {
    expect(authUserService).toBeDefined();
  });

  it('authUserRepository should be defined', () => {
    expect(authUserRepository).toBeDefined();
  });
  describe('createUser', () => {
    it('should create a user', async () => {
      const user = new AuthUserCredentialsDto();
      user.username = 'user';
      user.password = 'password';
      authUserRepository.create = jest.fn().mockReturnValue(user);
      authUserRepository.save = jest.fn().mockResolvedValue(user);
      const result = await authUserService.signUp(user);
      expect(result).toBeUndefined();
    });
  });
});
