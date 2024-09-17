import { Test, TestingModule } from '@nestjs/testing';
import { AuthUserController } from '../../src/controllers/auth-user.controller';
import { AuthUserService } from '../../src/services/auth-user.service';
import { AuthUserCredentialsDto } from '../../src/dto/auth-credentials.dto';

describe('AuthUserController', () => {
  let authUserController: AuthUserController;
  let authUserService: AuthUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthUserController],
      providers: [
        {
          provide: AuthUserService,
          useValue: {
            signUp: jest.fn(),
            signIn: jest.fn(),
          },
        },
      ],
    }).compile();

    authUserController = module.get<AuthUserController>(AuthUserController);
    authUserService = module.get<AuthUserService>(AuthUserService);
  });

  describe('signUp', () => {
    it('should call AuthUserService.signUp with correct parameters', async () => {
      const authCredentialsDto: AuthUserCredentialsDto = {
        username: 'test',
        password: 'test',
      };
      await authUserController.signUp(authCredentialsDto);
      expect(authUserService.signUp).toHaveBeenCalledWith(authCredentialsDto);
    });
  });

  describe('signIn', () => {
    it('should call AuthUserService.signIn with correct parameters and return accessToken', async () => {
      const authCredentialsDto: AuthUserCredentialsDto = {
        username: 'test',
        password: 'test',
      };
      const result = { accessToken: 'testToken' };
      jest.spyOn(authUserService, 'signIn').mockResolvedValue(result);

      expect(await authUserController.signIn(authCredentialsDto)).toBe(result);
      expect(authUserService.signIn).toHaveBeenCalledWith(authCredentialsDto);
    });
  });
});
