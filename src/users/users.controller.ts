import {
    Res,
    Param,
    Body,
    Controller,
    Get,
    Delete,
    Put,
    Query,
    UseGuards
} from '@nestjs/common';
import { UsersService } from "./users.service";
import { Response } from 'express'
import { UserEntity } from './user.schema';
import { Public } from 'common/decorators/public.decorotor'
import { Roles } from 'common/decorators/role.decorator';
import { User } from 'common/decorators/user.decorator'
import { ParseObjectIdPipe } from 'common/pipes/ParseObjectIdPipe.pipe';

@Controller('users')
export class UsersController {

    constructor(
        private usersService: UsersService
    ) {}

    @Get()
    async getAllUsers(@Res() response: Response) {
        this.usersService.getAllDocuments()
            .then((users) => response.json(users))
    }

    @Get('/count')
    async getUsersCount(@Res() response: Response) {
        this.usersService.getDocumentsCount()
            .then((count) => response.json({userCount: count}))
    }

    @Get(':id')
    async getUserById(@Param('id', ParseObjectIdPipe) id: string, @Res() response: Response) {
        this.usersService.getDocumentById(id)
            .then((user) => response.json(user))
    }

    //@Roles("ADMIN")
    //@UseGuards(RolesGuard)
    @Delete(':id')
    async deleteUserById(@Param('id', ParseObjectIdPipe) id: string, @Res() response: Response) {
        this.usersService.removeUserById(id)
            .then(() => response.json({success: true}))
    }

    @Put(':id')
    async updateUserById(
        @Param('id', ParseObjectIdPipe) id: string,
        @Body() data: Partial<UserEntity>,
        @Res() response: Response
    ) {
        this.usersService.updateDocumentByIdSafe(id, data, data.password)
            .then(() => response.json({success: true}))
    }

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
