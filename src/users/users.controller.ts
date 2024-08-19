import {
    Res,
    Param,
    Body,
    Controller,
    Get,
    Delete,
    Put,
} from '@nestjs/common';
import { UsersService } from "./users.service";
import { Response } from 'express'
import { UserEntity } from './schemas/user.schema';
import { Roles } from './../common/decorators/role.decorator';
//import { User } from './../common/decorators/user.decorator'
import { ParseObjectIdPipe } from './../common/pipes/parse-object-id.pipe';
import { Role } from './../common/enums/role.enum';
import { ChangePasswordDto } from './dto/change-password.dto';

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
        response.json({
            usersCount: count
        })
    }

    @Roles(Role.Admin)
    @Delete('/:id/delete')
    async deleteUserById(
        @Param('id', ParseObjectIdPipe) id: string,
        @Res() response: Response
    ) {
        const doc = await this.usersService.remove(id)
        response.json(doc)
    }

    @Roles(Role.User)
    @Put('/:id/update')
    async updateUserById(
        @Param('id', ParseObjectIdPipe) id: string,
        @Body() data: Partial<UserEntity>,
        @Res() response: Response
    ) {
        const doc = await this.usersService.updateSafe(id, data, data.password)
        response.json(doc)
    }

    @Roles(Role.User)
    @Put('/:id/change-password')
    async changePassword(
        @Param('id', ParseObjectIdPipe) id: string,
        @Body() data: ChangePasswordDto,
        @Res() response: Response
    ) {
        const { newPassword, oldPassword } = data
        const updatedUser = await this.usersService.changePassword(id, oldPassword, newPassword)
        response.json(updatedUser)
    }

    @Roles(Role.User)
    @Get('/user/:id')
    async getUserById(
        @Param('id', ParseObjectIdPipe) id: string,
        @Res() response: Response
    ) {
        const doc = await this.usersService.findById(id)
        response.json(doc)
    }
}
