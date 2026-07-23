import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateMissionDto } from './dto/create-mission.dto';
import { Mission } from './entities/mission.entity';

@Injectable()
export class MissionsService {
  constructor(private readonly dataSource: DataSource) {}

  async create(dto: CreateMissionDto): Promise<Mission> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

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
}