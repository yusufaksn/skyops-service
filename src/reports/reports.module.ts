import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

import { Drone } from '../drone/entities/drone.entity';
import { Mission } from '../mission/entities/mission.entity';
import { MaintenanceLog } from '../maintenance/entities/maintenance-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Drone, Mission, MaintenanceLog])],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}