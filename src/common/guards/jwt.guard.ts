import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { REQUSET_USER_KEY } from './../constants';
import { JwtPayload } from './../../auth/interfaces/jwt-payload.interface';
import { IS_PUBLIC_KEY } from './../../common/decorators/public.decorotor';
import { ROLES_KEY } from './../../common/decorators/role.decorator';
import { Role } from './../enums/role.enum';

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
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }

        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException("Authentication token not found.");
        }
        try {
            const payload: JwtPayload = this.jwtService.verify(token, {
                secret: this.configService.getOrThrow<string>("jwt.access_token.secret"),
            });
            request[REQUSET_USER_KEY] = payload;
            return requiredRoles.some((role) => payload.roles.includes(role))
        } catch {
            throw new UnauthorizedException("Invalid authentication token.");
        }
        return true
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
