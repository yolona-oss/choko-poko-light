import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from './../../auth/interfaces/jwt-payload.interface'

export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return <JwtPayload>request.user;
  },
);
