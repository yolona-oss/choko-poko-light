import { Res, Body, Controller, Post, NotImplementedException, Req } from '@nestjs/common';
import { Request, Response } from 'express'

import { AuthService } from "./auth.service";

import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

import { REFRESH_TOKEN, REQUSET_USER_KEY } from './../common/constants';
import { AuthUser } from 'common/decorators/user.decorator';
import { IJwtPayload } from './interfaces/jwt-payload.interface';

@Controller()
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('/signin')
    async signin(
        @Body() {email, password}: SignInDto,
        @Res() response: Response
    ) {
        const authResponse = await this.authService.signin(email, password)

        response.cookie(
            REFRESH_TOKEN.cookie.name,
            authResponse.refresh_token,
            REFRESH_TOKEN.cookie.options)

        response.json(authResponse)
    }

    @Post('/signup')
    async signup(
        @Body() userDto: SignUpDto,
        @Res() response: Response
    ) {
        const authResponse = await this.authService.signup(userDto)

        response.cookie(
            REFRESH_TOKEN.cookie.name,
            authResponse.refresh_token,
            REFRESH_TOKEN.cookie.options)

        response.status(201).json(authResponse)
    }

    @Post('/reauth')
    async refreshAccessToken(
        @Req() request: Request,
        @Res() response: Response,
    ) {
        const authResponse = await this.authService.refreshAccessToken(request.cookies)
        return response
            .status(201)
            .set({ "Cache-Control": "no-store", Pragma: "no-cache" })
            .json(authResponse)
    }

    @Post('/logout')
    async logout(
        @AuthUser() user: IJwtPayload,
        @Req() request: Request,
        @Res() response: Response
    ) {
        await this.authService.logout(user.id, request.cookies)

        const expireCookieOptions = Object.assign(
            {},
            REFRESH_TOKEN.cookie.options,
            {
                expires: new Date(1),
            }
        );

        return response
            .cookie(REFRESH_TOKEN.cookie.name, "", expireCookieOptions)
            .status(205)
            .json({})
    }

    @Post('/logout-all')
    async logoutAll() {
        throw new NotImplementedException()
    }

    @Post('/forgot-password')
    async forgotPassword() {
        throw new NotImplementedException()
    }

    @Post('/reset-password')
    async resetPassword() {
        throw new NotImplementedException()
    }
}
