import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthUserCredentialsDto } from '../dto/auth-credentials.dto';
import { AuthUser } from '../entity/auth-user.entity';
import { AuthUserRepository } from '../repository/auth-user.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from '../auth-user/jwt-payload.interface';
import { CustomLoggerService } from './logger-service';
@Injectable()
export class AuthUserService {
  constructor(
    @InjectRepository(AuthUser)
    private readonly userRepository: AuthUserRepository,
    private jwtService: JwtService,
    private logger: CustomLoggerService,
  ) {}
  async createUser(authCredentialDto: AuthUserCredentialsDto): Promise<void> {
    const { username, password } = authCredentialDto;
    // hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });
    try {
      await this.userRepository.save(user);
    } catch (error) {
      throw new ConflictException(`Username exist "${error}"`);
      // throw new HttpException(`Username exist "${error}"`, HttpStatus.CONFLICT);
    }
  }
  async signUp(authCredentialDto: AuthUserCredentialsDto): Promise<void> {
    return this.createUser(authCredentialDto);
  }

  async signIn(
    authCredentialDto: AuthUserCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialDto;
    const user = await this.userRepository.findOneBy({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JWTPayload = { username };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    }
    throw new UnauthorizedException('Please check your login credentials');
  }
}
