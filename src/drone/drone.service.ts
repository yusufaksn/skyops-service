import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm'; // <-- InjectEntityManager buraya eklendi
import { Repository, EntityManager } from 'typeorm';

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
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
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
    const sql = `
      SELECT 
        d.id,
        d.serial_number AS "serialNumber",
        d.model,
        d.status,
        d.total_flight_hours AS "totalFlightHours",
        d.last_maintenance_date AS "lastMaintenanceDate",
        d.next_maintenance_due AS "nextMaintenanceDue",
        d.created_at AS "createdAt"
      FROM drones d
      ORDER BY d.created_at DESC
    `;

    return this.entityManager.query(sql);
  }

async findOne(id: string) {
    const sql = `
      SELECT 
        d.id,
        d.serial_number AS "serialNumber",
        d.model,
        d.status,
        d.total_flight_hours AS "totalFlightHours",
        d.last_maintenance_date AS "lastMaintenanceDate",
        d.next_maintenance_due AS "nextMaintenanceDue",
        d.created_at AS "createdAt",
        
        -- Missions LEFT JOIN Aggregation
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', m.id,
                'name', m.name,
                'pilotName', m.pilot_name,
                'siteLocation', m.site_location,
                'missionType', m.mission_type,
                'status', m.status,
                'plannedStart', m.planned_start,
                'plannedEnd', m.planned_end,
                'actualStart', m.actual_start,
                'actualEnd', m.actual_end,
                'flightHoursLogged', m.flight_hours_logged,
                'abortReason', m.abort_reason,
                'preFlightChecked', m.pre_flight_checked,
                'createdAt', m.created_at
              ) ORDER BY m.created_at DESC
            )
            FROM missions m
            WHERE m.drone_id = d.id
          ), '[]'::json
        ) AS "missions",

        -- Maintenance Logs LEFT JOIN Aggregation (Kolon isimleri drone_id vb. olarak düzeltildi)
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', ml.id,
                'droneId', ml.drone_id,
                'type', ml.type,
                'technicianName', ml.technician_name,
                'notes', ml.notes,
                'datePerformed', ml.date_performed,
                'flightHoursAtMaintenance', ml.flight_hours_at_maintenance,
                'createdAt', ml.created_at,
                'updatedAt', ml.updated_at
              ) ORDER BY ml.date_performed DESC
            )
            FROM maintenance_logs ml
            WHERE ml.drone_id = d.id
          ), '[]'::json
        ) AS "maintenanceLogs"

      FROM drones d
      WHERE d.id = $1;
    `;

    const result = await this.entityManager.query(sql, [id]);

    if (!result || result.length === 0) {
      throw new NotFoundException(`Drone with ID "${id}" was not found`);
    }

    return result[0];
  }

  async update(id: string, updateDroneDto: UpdateDroneDto) {
    const drone = await this.droneRepository.findOne({ where: { id } });

    if (!drone) {
      throw new NotFoundException(`Drone with ID "${id}" was not found`);
    }

    Object.assign(drone, updateDroneDto);
    await this.droneRepository.save(drone);

    return this.findOne(id);
  }

  async remove(id: string) {
    const result = await this.droneRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Drone with ID "${id}" was not found`);
    }

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