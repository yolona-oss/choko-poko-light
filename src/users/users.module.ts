import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UserSchema } from './user.schema';
import { UsersService } from './users.service';

import { Role } from './../common/enums/role.enum';

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [
        MongooseModule.forFeature([
            { name: 'User', schema: UserSchema },
        ])
    ],
    exports: [UsersService]
})
export class UsersModule implements OnApplicationBootstrap {
    constructor(
        private usersService: UsersService,
        private configService: ConfigService
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        await this.usersService.__createDefaultAdmin({
            name: this.configService.getOrThrow<string>("default_user.name"),
            email: this.configService.getOrThrow<string>("default_user.email"),
            phone: this.configService.getOrThrow<string>("default_user.phone"),
            password: this.configService.getOrThrow<string>("default_user.password"),
        })
    }
}
