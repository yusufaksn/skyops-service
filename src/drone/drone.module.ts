import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DroneController } from './drone.controller';
import { DroneService } from './drone.service';
import { Drone } from './entities/drone.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Drone]),
  ],
  controllers: [
    DroneController,
  ],
  providers: [
    DroneService,
  ],
})
export class DroneModule {}