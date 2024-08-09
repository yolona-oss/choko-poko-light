//import { Injectable, UnauthorizedException } from '@nestjs/common';
//import { PassportStrategy } from '@nestjs/passport';
//import { Strategy } from 'passport-local';
//import { AuthService } from './auth.service';
//import { UserEntity } from 'users/user.schema';
//
//@Injectable()
//export class LocalStrategy extends PassportStrategy(Strategy) {
//    constructor(private authService: AuthService) {
//        super({
//            usernameField: 'email',
//        });
//    }
//
//    async validate(email: string, password: string): Promise<Omit<UserEntity, 'password'>> {
//        const user = await this.authService.validateUser(email, password);
//        if (!user) {
//            throw new UnauthorizedException();
//        }
//        return user;
//    }
//}

export function foo() {
    throw new Error()
}
