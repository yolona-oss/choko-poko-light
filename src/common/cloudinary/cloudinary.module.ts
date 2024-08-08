import { Module } from '@nestjs/common';
import { cloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';

@Module({
    providers: [...cloudinaryProvider, CloudinaryService],
    exports: [...cloudinaryProvider, CloudinaryService]
})
export class CloudinaryModule {}

//import { Module } from '@nestjs/common';
//import { CloudinaryModule } from 'nestjs-cloudinary';
//import { ConfigService } from '@nestjs/config'
//
//@Module({
//    imports: [
//        CloudinaryModule.forRootAsync({
//            useFactory: (config: ConfigService) => ({
//                isGlobal: true,
//                cloud_name: config.get<string>("cloudinary.name"),
//                api_key: config.get<string>("cloudinary.api_key"),
//                api_secret: config.get<string>("cloudinary.api_secret")
//            }),
//            inject: [ConfigService],
//        }),
//    ]
//})
//export class NestCloudinaryClientModule {}
