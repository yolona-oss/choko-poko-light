import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IJwtPayload } from './../../auth/interfaces/jwt-payload.interface'
import { REQUSET_USER_KEY } from './../constants';

export const AuthUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return <IJwtPayload>request[REQUSET_USER_KEY];
  },
);
