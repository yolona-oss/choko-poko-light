import { forwardRef, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { UsersModule } from './../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './pasport/jwt.strategy';
import { JwtGuard } from './jwt.guard';

@Module({
    controllers: [AuthController],
    providers: [
        AuthService,
        //JwtGuard,
        {
            provide: APP_GUARD,
            useClass: JwtGuard,
        },
    ],
    imports: [
        PassportModule.register({
            property: 'user',
            defaultStrategy: 'strategy-jwt'
        }),
        JwtModule.registerAsync({
            useFactory: async (configService: ConfigService) => {
                const secret = configService.get<string>('jwt.token')
                const expiresIn = configService.get<string>('jwt.sign_options.expires_in')
                return {
                    secret: secret,
                    signOptions: {
                        expiresIn: expiresIn
                    }
                }
            },
            inject: [ConfigService]
        }),
        forwardRef(() => UsersModule),
    ],
    exports: [AuthService, PassportModule]
})
export class AuthModule {}
