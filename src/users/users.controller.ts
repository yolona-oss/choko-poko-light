import {
    Res,
    Query,
    Body,
    Controller,
    Get,
    Delete,
    Put,
} from '@nestjs/common';
import { Response } from 'express'

import { ParseObjectIdPipe } from './../common/pipes/parse-object-id.pipe';

import { UsersService } from "./users.service";

import { Roles } from './../common/decorators/role.decorator';
import { Role } from './../common/enums/role.enum';
import { AuthUser } from './../common/decorators/user.decorator';

import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { IJwtPayload } from './../auth/interfaces/jwt-payload.interface';

@Controller()
export class UsersController {

    constructor(
        private usersService: UsersService
    ) {}

    @Roles(Role.Admin)
    @Get('/')
    async getAllUsers(@Res() response: Response) {
        const docs = await this.usersService.findAll()
        response.json(docs)
    }

    @Roles(Role.Admin)
    @Get('/count')
    async getUsersCount(@Res() response: Response) {
        const count = await this.usersService.count()
        response.status(200).json(count)
    }

    @Roles(Role.Admin)
    @Delete('/delete')
    async deleteUserById(
        @Query('userId', ParseObjectIdPipe) id: string,
        @Res() response: Response
    ) {
        const doc = await this.usersService.remove(id)
        response.status(200).json(doc)
    }

    @Roles(Role.User)
    @Put('/update')
    async updateUserById(
        @AuthUser() user: IJwtPayload,
        @Body() data: Partial<UpdateUserDto>,
        @Res() response: Response
    ) {
        const doc = await this.usersService.updateSafe(user.id, data, data.password)
        response.status(200).json(doc)
    }

    @Roles(Role.User)
    @Put('/update/password')
    async changePassword(
        @AuthUser() user: IJwtPayload,
        @Body() data: ChangePasswordDto,
        @Res() response: Response
    ) {
        const { newPassword, oldPassword } = data
        const updatedUser = await this.usersService.changePassword(user.id, oldPassword, newPassword)
        response.status(200).json(updatedUser)
    }

    @Roles(Role.User)
    @Get('/me')
    async getUserById(
        @AuthUser() user: IJwtPayload,
        @Res() response: Response
    ) {
        const doc = await this.usersService.findById(user.id)
        response.status(200).json(doc)
    }
}
