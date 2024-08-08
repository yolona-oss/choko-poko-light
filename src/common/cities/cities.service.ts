import { Injectable } from '@nestjs/common';
import { dtoCity } from './dto/cities.dto';
import * as fs from 'fs'
import { ConfigService } from '@nestjs/config';

// TODO:
// 1. create schedule to update data
// 2. add superstruct validator
//

@Injectable()
export class CitiesService {
    constructor(private configService: ConfigService) {}

    async getAll(): Promise<Array<dtoCity>> {
        const data_path = this.configService.get('static_data_storage.cities_file')
        if (!fs.existsSync(data_path)) {
            // TODO: create propper nestjs error
            throw new Error("Cities file dont exists")
        }
        const parsed = JSON.parse(fs.readFileSync(data_path).toString());
        return parsed;
    }
}
