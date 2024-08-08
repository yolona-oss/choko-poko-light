import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AccessTokenPayload } from 'types/AccessTokenPayload';

export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return <AccessTokenPayload>request.user;
  },
);
