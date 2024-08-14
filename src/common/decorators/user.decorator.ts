import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from './../../auth/interfaces/jwt-payload.interface'
import { REQUSET_USER_KEY } from './../constants';

export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return <JwtPayload>request[REQUSET_USER_KEY];
  },
);
