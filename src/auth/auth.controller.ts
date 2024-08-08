import { Res, Body, Controller, Post } from '@nestjs/common';
import { Response } from 'express'
import { CreateUserDTO } from "../users/dto/CreateUserDTO";
import { AuthService } from "./auth.service";
import { Login } from './interfaces/login.interface';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('/signin')
    async signin(@Body() {email, password}: Login, @Res() response: Response) {
        const token = await this.authService.signin(email, password)
        response.json(token)
    }

    @Post('/signup')
    async signup(@Body() userDto: CreateUserDTO, @Res() response: Response) {
        const token = await this.authService.signup(userDto)
        response.json(token)
    }
}
