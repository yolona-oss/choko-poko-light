import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { UsersService } from './../../users/users.service';

import { JwtPayload } from './../interfaces/jwt-payload.interface';
import { AppError, AppErrorTypeEnum } from './../../common/app-error';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'strategy-jwt') {
    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>("jwt.access_token.secret")
        });
    }

    async validate(payload: JwtPayload) {
        console.log("Jwt payload: " + JSON.stringify(payload,null,'\n'))
        const user = await this.usersService.findById(payload.id);
        if (!user) {
            throw new AppError(AppErrorTypeEnum.INVALID_CREDENTIALS_EXCEPTION)
        }
        return payload;
    }
}
