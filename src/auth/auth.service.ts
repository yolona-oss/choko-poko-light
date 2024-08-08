import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from "../users/dto/CreateUserDTO";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "../users/user.schema";
import { AccessTokenPayload } from 'types/AccessTokenPayload';
import { Crypto } from "internal/utils"
import { AppErrorTypeEnum } from 'internal/error/AppErrorTypeEnum';
import { AppError } from 'internal/error/AppError';

// TODO: move to another place
export class AccessOutput {
    constructor(
        public access_token: string,
        public user: Omit<UserEntity, 'password'>
    ) {}
}

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService
    ) {}

    async signin(email: string, password: string) {
        const user = await this.validateUser(email, password)
        const token = this.generateToken(user)
        return new AccessOutput(token, user)
    }

    async signup(userInfo: CreateUserDTO) {
        const { password } = userInfo;

        const passwordHash = Crypto.createPasswordHash(password)
        const newUser = await this.usersService.createDocument({...userInfo, password: passwordHash})

        const token = this.generateToken(newUser)

        return new AccessOutput(token, newUser)
    }

    private generateToken(user: Omit<UserEntity, 'password'>): string {
        const payload: AccessTokenPayload = {
            email: user.email,
            id: user.id,
            isAdmin: user.isAdmin || false
        }
        return this.jwtService.sign(payload)
    }

    async validateUser(email: string, pass: string) {
        const user = await this.usersService.getEntityByEmail(email);
        if (!user || !Crypto.comparePasswords(pass, user.password)) {
            throw new AppError(AppErrorTypeEnum.INVALID_CREDENTIALS_EXCEPTION)
        }
        //const { password, ...result } = user
        return user;
    }
}
