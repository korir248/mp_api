import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@app/database';

export const CurrentUserOptional = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
