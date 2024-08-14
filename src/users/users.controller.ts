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
import { UserEntity } from './user.schema';
import { Roles } from './../common/decorators/role.decorator';
//import { User } from './../common/decorators/user.decorator'
import { ParseObjectIdPipe } from './../common/pipes/ParseObjectIdPipe.pipe';
import { Role } from 'src/common/enums/role.enum';

@Controller('users')
export class UsersController {

    constructor(
        private usersService: UsersService
    ) {}

    @Roles(Role.Admin)
    @Get()
    async getAllUsers(@Res() response: Response) {
        this.usersService.getAllDocuments()
            .then((users) => response.json(users))
    }

    @Roles(Role.Admin)
    @Get('/count')
    async getUsersCount(@Res() response: Response) {
        this.usersService.getDocumentsCount()
            .then((count) => response.json({userCount: count}))
    }

    @Roles(Role.Admin)
    @Get(':id')
    async getUserById(@Param('id', ParseObjectIdPipe) id: string, @Res() response: Response) {
        this.usersService.getDocumentById(id)
            .then((user) => response.json(user))
    }

    @Roles(Role.User)
    @Delete(':id')
    async deleteUserById(@Param('id', ParseObjectIdPipe) id: string, @Res() response: Response) {
        this.usersService.removeUserById(id)
            .then(() => response.json({success: true}))
    }

    @Roles(Role.User)
    @Put(':id')
    async updateUserById(
        @Param('id', ParseObjectIdPipe) id: string,
        @Body() data: Partial<UserEntity>,
        @Res() response: Response
    ) {
        this.usersService.updateDocumentByIdSafe(id, data, data.password)
            .then(() => response.json({success: true}))
    }

    @Roles(Role.User)
    @Put('/changePassword/:id')
    async changePassword(
        @Param('id', ParseObjectIdPipe) id: string,
        @Body() data: {email: string, password: string} & {newPass: string},
        @Res() response: Response
    ) {
        const { password, newPass } = data
        const updatedUser = await this.usersService.changePassword(id, password, newPass)
        response.send(updatedUser)
    }
}
