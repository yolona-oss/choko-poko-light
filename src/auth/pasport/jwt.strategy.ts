import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AccessTokenPayload } from 'types/AccessTokenPayload';
import { UsersService } from 'users/users.service';
import { AppErrorTypeEnum } from 'internal/error/AppErrorTypeEnum';
import { AppError } from 'internal/error/AppError';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'strategy-jwt') {
    constructor(
        //private readonly configService: ConfigService,
        private readonly usersService: UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: "asdfasdf"
        });
    }

    async validate(payload: AccessTokenPayload) {
        const user = await this.usersService.getDocumentById(payload.id);
        if (!user) {
            throw new AppError(AppErrorTypeEnum.INVALID_CREDENTIALS_EXCEPTION)
        }
        return payload;
    }
}
