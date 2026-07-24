import { Controller, Post, Body } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceLogDto } from './dto/create-maintenance-log.dto';

@Controller('maintenance-logs')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post()
  async create(@Body() dto: CreateMaintenanceLogDto) {
    return await this.maintenanceService.create(dto);
  }
}