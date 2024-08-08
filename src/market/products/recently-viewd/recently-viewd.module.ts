import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecentlyViewdSchema } from './recently-viewd.schema';
import { RecentlyViewdService } from './recently-viewd.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'RecentlyViewd',  schema: RecentlyViewdSchema }
        ])
    ],
    providers: [RecentlyViewdService],
    exports: [RecentlyViewdService]
})
export class RecentlyViewdModule {}
