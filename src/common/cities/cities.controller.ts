import { Get, Controller } from '@nestjs/common';
import { CitiesService } from "./cities.service";

@Controller('cities')
export class CitiesController {

    constructor(private citiesService: CitiesService) {}

    @Get()
    async getAllCities() {
        return this.citiesService.getAll()
    }

}
