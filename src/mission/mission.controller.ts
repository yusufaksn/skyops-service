import {
  Controller,
  Post,
  Put,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MissionsService } from './mission.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionStatusDto } from './dto/update-mission-status.dto';
import { Mission } from './entities/mission.entity';

@Controller('missions') 
export class MissionController {
  constructor(private readonly missionsService: MissionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMissionDto: CreateMissionDto): Promise<Mission> {
    return await this.missionsService.create(createMissionDto);
  }

  @Put(':id/status')
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() dto: UpdateMissionStatusDto,
  ) {
    return await this.missionsService.updateMissionStatus(id, dto); 
  }
}