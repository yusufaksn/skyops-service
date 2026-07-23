import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { DroneService } from './drone.service';
import { CreateDroneDto } from './dto/create-drone.dto';
import { UpdateDroneDto } from './dto/update-drone.dto';

@Controller('drones')
export class DroneController {
  constructor(
    private readonly droneService: DroneService,
  ) {}

  @Get()
  findAll() {
    return this.droneService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.droneService.findOne(id);
  }

  @Post()
  create(@Body() createDroneDto: CreateDroneDto) {
    return this.droneService.create(createDroneDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDroneDto: UpdateDroneDto,
  ) {
    return this.droneService.update(id, updateDroneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.droneService.remove(id);
  }
}