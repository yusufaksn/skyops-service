import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Drone } from './entities/drone.entity';
import { CreateDroneDto } from './dto/create-drone.dto';
import { UpdateDroneDto } from './dto/update-drone.dto';
import { DroneStatus } from './enums/drone-status.enum';

@Injectable()
export class DroneService {
  private static readonly MAINTENANCE_INTERVAL_DAYS = 90;
  constructor(
    @InjectRepository(Drone)
    private readonly droneRepository: Repository<Drone>,
  ) {}

  async create(createDroneDto: CreateDroneDto) {
    const drone = this.droneRepository.create({
      serial_number: createDroneDto.serial_number,
      model: createDroneDto.model,
      status: DroneStatus.AVAILABLE,
      total_flight_hours: 0,
      next_maintenance_due: this.calculateNextMaintenanceDate(),
    });

    return await this.droneRepository.save(drone);
  }

  async findAll() {
    return await this.droneRepository.find();
  }

  async findOne(id: string) {
    const drone = await this.droneRepository.findOne({
      where: { id },
    });

    if (!drone) {
      throw new NotFoundException('Drone not found');
    }

    return drone;
  }

  async update(id: string, updateDroneDto: UpdateDroneDto) {
    const drone = await this.findOne(id);

    Object.assign(drone, updateDroneDto);

    return await this.droneRepository.save(drone);
  }

  async remove(id: string) {
    const drone = await this.findOne(id);

    await this.droneRepository.remove(drone);

    return {
      message: 'Drone deleted successfully',
    };
  }

  private calculateNextMaintenanceDate(): Date {
      const date = new Date();
      date.setDate(
        date.getDate() + DroneService.MAINTENANCE_INTERVAL_DAYS,
      );
    return date;
  }
}