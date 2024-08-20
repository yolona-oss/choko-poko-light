import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';

import Crypto from './crypto-service';
import crypto from 'crypto'
import { AppError, AppErrorTypeEnum } from './../common/app-error';

import { IAccessToken } from './interfaces/access-token.interface';
import { IRefreshToken } from './interfaces/refresh-token.interface';
import { AuthJwtTokens } from './interfaces/auth-jwt-tokens.interface';
import { IJwtPayload } from './interfaces/jwt-payload.interface';

import { AuthResponseDto, TransformUser } from './dto/auth-response.dto';
import { SignUpDto } from './dto/sign-up.dto';

import { DEFAULT_USER_ROLE, Role } from './../common/enums/role.enum';
import { REFRESH_TOKEN } from 'common/constants';

/*
* 
* TODO move tokens generation to tokens service
*
*/


@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
        private readonly configService: ConfigService
    ) {}

    async signin(email: string, password: string): Promise<AuthResponseDto> {
        const user = await this.validateUser(email, password)

        const {access_token, refresh_token} = await this.generateTokens(user.id, user.email, <Role[]>user.roles)

        return {
            access_token,
            refresh_token,
            user: TransformUser(user)
        }
    }

    async signup(userInfo: SignUpDto): Promise<AuthResponseDto> {
        // verification of fields is done in users service
        const newUser = await this.usersService.create(userInfo)

        const { access_token, refresh_token } = await this.generateTokens(newUser.id, newUser.email, [DEFAULT_USER_ROLE])

        return {
            access_token,
            refresh_token,
            user: TransformUser(newUser)
        }
    }

    async logout(userId: string, cookies: any) {
        const refresToken = cookies[REFRESH_TOKEN.cookie.name]

        const rTknHash = crypto
            .createHmac("sha256", <string>REFRESH_TOKEN.secret)
            .update(refresToken)
            .digest("hex");

        await this.usersService.removeToken(userId, rTknHash)

        return
    }

    private generateAcessToken(userId: string, email: string, roles: Role[]): IAccessToken {
        const access_token_payload: IJwtPayload = {
            email: email,
            id: userId,
            roles: roles
        }
        const access_token = this.jwtService.sign(
            access_token_payload
        )

        return {
            access_token
        }
    }

    private async generateRefreshToken(userId: string): Promise<IRefreshToken> {
        const refresh_token = this.jwtService.sign(
            { id: userId.toString(), _id: userId.toString() }, // TODO comatibility with legacy errors may happend, need deep refactoring to remove one of the fields
            {
                expiresIn: '7d',
                secret: this.configService.getOrThrow<string>('jwt.refresh_token.secret')
            }
        )
        const rTknHash = crypto
            .createHmac("sha256", <string>REFRESH_TOKEN.secret)
            .update(refresh_token)
            .digest("hex");

        await this.usersService.addToken(userId, rTknHash);
        return {
            refresh_token
        }
    }

    private async generateTokens(userId: string, email: string, roles: Role[]): Promise<AuthJwtTokens> {
        const { access_token } = this.generateAcessToken(userId, email, roles)
        const { refresh_token } = await this.generateRefreshToken(userId)
        return {
            access_token,
            refresh_token
        }
    }

    async generageResetToken(userId: string): Promise<string> {
        const resetTokenValue = crypto.randomBytes(20).toString("base64url");
        const resetTokenSecret = crypto.randomBytes(10).toString("hex");

        // Separator of `+` because generated base64url characters doesn't include this character
        const resetToken = `${resetTokenValue}+${resetTokenSecret}`;

        const resetTokenHash = crypto
            .createHmac("sha256", resetTokenSecret)
            .update(resetTokenValue)
            .digest("hex");

        try {
            await this.usersService.addResetToken(userId, resetTokenHash);
        } catch (error: any) {
            throw new UnauthorizedException('You are unauthenticated!')
        }

        return resetToken;
    }

    async refreshAccessToken(cookies: any): Promise<IAccessToken> {
        try {
            const refreshToken = cookies[REFRESH_TOKEN.cookie.name];

            if (!refreshToken) {
                throw new UnauthorizedException('Refresh token not found')
            }

            const decodedRefreshTkn = this.jwtService.verify(refreshToken, {secret: REFRESH_TOKEN.secret});
            const rTknHash = crypto
                .createHmac("sha256", <string>REFRESH_TOKEN.secret)
                .update(refreshToken)
                .digest("hex");

            // Check if refresh token is valid and contains valid user id
            try {
                await this.usersService.findByAssignedToken(decodedRefreshTkn.id, rTknHash);
            } catch (error: any) {
                if (error instanceof AppError) {
                    throw error
                }
                throw new UnauthorizedException('You are unauthenticated!')
            }

            const newAtkn = this.generateAcessToken(decodedRefreshTkn.id, decodedRefreshTkn.email, decodedRefreshTkn.roles);
            // const newRtkn = await userWithRefreshTkn.generateRefreshToken();
            return newAtkn;
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError()
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
