import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';

import { Crypto } from './../common/misc/utils';
import { AppError, AppErrorTypeEnum } from './../common/app-error';

import { AuthJwtTokens } from './interfaces/auth-jwt-tokens.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';

import { AuthResponseDto, AuthResponseUserTransform } from './dto/auth-response.dto';
import { SignUpDto } from './dto/sign-up.dto';


import { Role } from './../common/enums/role.enum';

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
        private readonly configService: ConfigService
    ) {}

    async signin(email: string, password: string): Promise<AuthResponseDto> {
        const user = await this.validateUser(email, password)

        const tokens = this.generateTokens(user.id, user.email, <Role[]>user.roles)

        return {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            user: AuthResponseUserTransform(user)
        }
    }

    async signup(userInfo: SignUpDto): Promise<AuthResponseDto> {
        // verification of fields is done in users service
        const newUser = await this.usersService.createDocument(userInfo)

        const tokens = this.generateTokens(newUser.id, newUser.email, [Role.User])

        return {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            user: AuthResponseUserTransform(newUser)
        }
    }

    private generateTokens(userId: string, email: string, roles: Role[]): AuthJwtTokens {
        const refresh_token_secret = this.configService.getOrThrow<string>('jwt.refresh_token.secret')

        const access_token_payload: JwtPayload = {
            email: email,
            id: userId,
            roles: roles
        }

        const access_token = this.jwtService.sign(
            access_token_payload
        )
        const refresh_token = this.jwtService.sign(
            { id: userId },
            {
                expiresIn: '7d',
                secret: refresh_token_secret
            }
        )
        return {
            access_token,
            refresh_token
        }
    }

    async validateUser(email: string, pass: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user || !Crypto.comparePasswords(pass, user.password)) {
            throw new AppError(AppErrorTypeEnum.INVALID_CREDENTIALS_EXCEPTION)
        }
        return user;
    }
}
