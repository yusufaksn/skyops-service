import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateMissionDto } from './dto/create-mission.dto';
import { Mission } from './entities/mission.entity';
import { UpdateMissionStatusDto } from './dto/update-mission-status.dto';
import { MissionStatus } from './enums/mission-status.enum';
import { MISSION_STATUS_QUERIES } from './mission-queries';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class MissionsService {
  constructor(private readonly dataSource: DataSource) {}

  async create(dto: CreateMissionDto): Promise<Mission> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    if (new Date(dto.planned_start) < new Date()) {
      throw new ConflictException(
        'Mission cannot be scheduled in the past.',
      );
    } 
    try {
      const drones = await queryRunner.query(
        `
        SELECT id 
        FROM drones 
        WHERE id = $1 
          AND status = 'AVAILABLE'
          AND NOT (
            next_maintenance_due BETWEEN $2::timestamptz AND $3::timestamptz
          )
        FOR UPDATE
        `,
        [
          dto.drone_id,
          dto.planned_start,
          dto.planned_end,
        ]
      );

      if (!drones || drones.length === 0) {
        throw new NotFoundException(
          'Drone not found, not available, or maintenance date conflicts with mission schedule.'
        );
      }

      const result = await queryRunner.query(
        `
        INSERT INTO missions (
            name,
            drone_id,
            pilot_name,
            site_location,
            mission_type,
            status,
            planned_start,
            planned_end
        )
        SELECT $1, $2, $3, $4, $5, $6, $7::timestamptz, $8::timestamptz
        WHERE NOT EXISTS (
            SELECT 1
            FROM missions
            WHERE drone_id = $2
              AND status NOT IN ('COMPLETED', 'ABORTED')
              AND (planned_start, planned_end) OVERLAPS ($7::timestamptz, $8::timestamptz)
        )
        RETURNING *;
        `,
        [
          dto.name,
          dto.drone_id,
          dto.pilot_name,
          dto.site_location,
          dto.mission_type,
          'PLANNED',
          dto.planned_start,
          dto.planned_end,
        ]
      );

      if (!result || result.length === 0) {
        throw new ConflictException(
          'Specified time interval has a conflicting mission for this drone.'
        );
      }

      await queryRunner.commitTransaction();
      return result[0];

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }


  async updateMissionStatus(missionId: string, dto: UpdateMissionStatusDto) {
    const query = MISSION_STATUS_QUERIES[dto.status];

    if (!query) {
      throw new BadRequestException(`Invalid target status: ${dto.status}`);
    }


    const queryParams: any[] = [missionId];

    if (dto.status === MissionStatus.COMPLETED) {
      queryParams.push(dto.flightHoursLogged ?? 0);
    } else if (dto.status === MissionStatus.ABORTED) {
      queryParams.push(dto.abortReason ?? 'No reason provided');
    }


    const result = await this.dataSource.query(query, queryParams);

  
    if (!result || result.length === 0) {
      throw new BadRequestException(
        `Status '${dto.status}' cannot be applied to mission with ID ${missionId}.`
      );
    }

    return result[0];
  }
}