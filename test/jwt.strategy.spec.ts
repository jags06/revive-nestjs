import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../src/auth-user/jwt.strategy';
import { AuthUserRepository } from '../src/repository/auth-user.repository';
import { AuthUser } from '../src/entity/auth-user.entity';
import { JWTPayload } from '../src/auth-user/jwt-payload.interface';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository: AuthUserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: getRepositoryToken(AuthUser),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get<AuthUserRepository>(
      getRepositoryToken(AuthUser),
    );
  });

  describe('validate', () => {
    it('should return the user if validation is successful', async () => {
      const user = { username: 'testuser' };
      jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(user as AuthUser);

      const payload: JWTPayload = { username: 'testuser' };
      const result = await jwtStrategy.validate(payload);

      expect(result).toEqual(user);
    });

    it('should throw an UnauthorizedException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      const payload: JWTPayload = { username: 'testuser' };

      await expect(jwtStrategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
