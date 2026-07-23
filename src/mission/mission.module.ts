import { Module } from '@nestjs/common';
import { MissionController } from './mission.controller';
import { MissionsService } from './mission.service';

@Module({
  controllers: [MissionController],
  providers: [MissionsService], 
  exports: [MissionsService],  
})
export class MissionModule {}