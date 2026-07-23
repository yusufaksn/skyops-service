import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { MissionsService } from './mission.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { Mission } from './entities/mission.entity';

@Controller('mission')
export class MissionController {
  constructor(private readonly missionsService: MissionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMissionDto: CreateMissionDto): Promise<Mission> {
    return await this.missionsService.create(createMissionDto);
  }
}