import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from 'src/entity/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {}
