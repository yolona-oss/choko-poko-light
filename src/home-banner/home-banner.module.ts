import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'common/cloudinary/cloudinary.module';
import { HomeBannerController } from './home-banner.controller';
import { HomeBannerSchema } from './home-banner.schema';
import { HomeBannerService } from './home-banner.service';

@Module({
    controllers: [HomeBannerController],
    imports: [
        MongooseModule.forFeature([
            { name: 'HomeBanner', schema: HomeBannerSchema },
        ]),
        CloudinaryModule
    ],
    providers: [HomeBannerService]
})
export class HomeBannerModule {}
