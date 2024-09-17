import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '../entity/auth-user.entity';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
