import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceLog } from './entities/maintenance-log.entity';
import { Drone } from '../drone/entities/drone.entity'; // Drone entity yolunu projene göre kontrol et

@Module({
  imports: [
    TypeOrmModule.forFeature([MaintenanceLog, Drone]), // Repository'leri NestJS'e tanıtan kısım
  ],
  controllers: [MaintenanceController],
  providers: [MaintenanceService],
  exports: [MaintenanceService],
})
export class MaintenanceModule {}