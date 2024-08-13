import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageUploadModule } from './../image-upload/image-upload.module';
import { HomeBannerController } from './home-banner.controller';
import { HomeBannerSchema } from './home-banner.schema';
import { HomeBannerService } from './home-banner.service';

@Module({
    controllers: [HomeBannerController],
    imports: [
        MongooseModule.forFeature([
            { name: 'HomeBanner', schema: HomeBannerSchema },
        ]),
        ImageUploadModule
    ],
    providers: [HomeBannerService]
})
export class HomeBannerModule {}
