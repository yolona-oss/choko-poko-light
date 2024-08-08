import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export const cloudinaryProvider = [
    {
        provide: 'CLOUDINARY',
        useFactory: (config: ConfigService) => {
            return cloudinary.config({
                cloud_name: config.get<string>("cloudinary.resolve_name"),
                api_key: config.get<string>("cloudinary.api_key"),
                api_secret: config.get<string>("cloudinary.api_secret")
            });
        },
        inject: [ConfigService]
    }
];
