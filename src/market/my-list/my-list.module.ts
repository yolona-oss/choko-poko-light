import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MyListController } from './my-list.controller';
import { MyListService } from './my-list.service';
import { MyListSchema } from './schemas/my-list.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'MyList', schema: MyListSchema }
        ])
    ],
    controllers: [MyListController],
    providers: [MyListService]
})
export class MyListModule {}
