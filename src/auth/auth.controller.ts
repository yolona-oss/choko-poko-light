import { Res, Body, Controller, Post } from '@nestjs/common';
import { Response } from 'express'

import { AuthService } from "./auth.service";

import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller()
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('/signin')
    async signin(@Body() {email, password}: SignInDto, @Res() response: Response) {
        const authResponse = await this.authService.signin(email, password)
        response.status(200).json(authResponse)
    }

    @Post('/signup')
    async signup(@Body() userDto: SignUpDto, @Res() response: Response) {
        const authResponse = await this.authService.signup(userDto)
        response.status(200).json(authResponse)
    }
}
