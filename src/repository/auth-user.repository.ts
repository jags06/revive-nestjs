import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AuthUser } from '../entity/auth-user.entity';

@Injectable()
export class AuthUserRepository extends Repository<AuthUser> {}
