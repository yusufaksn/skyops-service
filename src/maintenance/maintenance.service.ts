import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceLog } from './entities/maintenance-log.entity';
import { CreateMaintenanceLogDto } from './dto/create-maintenance-log.dto';
import { Drone } from '../drone/entities/drone.entity';
import { DroneStatus } from '../drone/enums/drone-status.enum';
@Injectable()
export class MaintenanceService {
  constructor(
    @InjectRepository(MaintenanceLog)
    private readonly logRepository: Repository<MaintenanceLog>,
    @InjectRepository(Drone)
    private readonly droneRepository: Repository<Drone>,
  ) {}

  async create(dto: CreateMaintenanceLogDto): Promise<MaintenanceLog> {

    const drone = await this.droneRepository.findOne({
      where: { id: dto.droneId },
    });

    if (!drone) {
      throw new NotFoundException(`ID ${dto.droneId} not found.`);
    }

  
    const newLog = this.logRepository.create({
      droneId: dto.droneId,
      type: dto.type,
      technicianName: dto.technicianName,
      notes: dto.notes,
      flightHoursAtMaintenance: drone.total_flight_hours || 0,
      datePerformed: new Date(),
    });

    drone.last_maintenance_date = new Date();
    drone.status = DroneStatus.MAINTENANCE; 

    await this.droneRepository.save(drone);
    return await this.logRepository.save(newLog);
  }
}