import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JwtPayload } from './../../auth/interfaces/jwt-payload.interface';
import { IS_PUBLIC_KEY } from './../../common/decorators/public.decorotor';
import { ROLES_KEY } from './../../common/decorators/role.decorator';

@Injectable()
export class JwtGuard extends AuthGuard('strategy-jwt') {
    constructor(
        private reflector: Reflector,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {
        super()
    }

    canActivate(
        context: ExecutionContext,
    ): Promise<boolean> | Observable<boolean> | boolean {
        // now with boottom defention this code is unused
        //const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        //    context.getHandler(),
        //    context.getClass(),
        //]);
        //if (isPublic) {
        //    return true;
        //}

        const isRoleBased = this.reflector.getAllAndOverride<string>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!isRoleBased) {
            return true
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload: JwtPayload = this.jwtService.verify(token, {
                secret: this.configService.get<string>("jwt.token"),
            });
            request['user'] = payload;
            return payload.isAdmin
        } catch {
            throw new UnauthorizedException();
        }
        return true
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
