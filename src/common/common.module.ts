import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { CitiesModule } from './cities/cities.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [DatabaseModule, CitiesModule, CloudinaryModule],
})
export class CommonModule {}
