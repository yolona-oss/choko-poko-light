import { Res, Body, Controller, Post } from '@nestjs/common';
import { Response } from 'express'
import { CreateUserDTO } from "../users/dto/CreateUserDTO";
import { AuthService } from "./auth.service";
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Public } from './../common/decorators/public.decorotor';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('/signin')
    async signin(@Body() {email, password}: SignInDto, @Res() response: Response) {
        const authResponse = await this.authService.signin(email, password)
        response.json(authResponse)
    }

    @Post('/signup')
    async signup(@Body() userDto: SignUpDto, @Res() response: Response) {
        const authResponse = await this.authService.signup(userDto)
        response.json(authResponse)
    }
}
