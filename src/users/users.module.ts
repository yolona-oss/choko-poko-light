import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UserSchema } from './user.schema';
import { UsersService } from './users.service';

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
export class UsersModule {}
