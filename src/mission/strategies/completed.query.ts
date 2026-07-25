import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { MissionStatus } from '../enums/mission-status.enum';
import { UpdateMissionStatusDto } from '../dto/update-mission-status.dto';
import { MissionStrategy } from './mission-status.strategy';

@Injectable()
export class CompletedMissionStrategy implements MissionStrategy {
  constructor(private readonly dataSource: DataSource) {}

    private readonly query = `
    WITH updated_drone AS (
      UPDATE drones d
      SET
        total_flight_hours = COALESCE(total_flight_hours, 0) + COALESCE($2::numeric, 0),
        status = CASE 
          -- Yeni toplam uçuş saati 50 veya üzerindeyse bakıma al
          WHEN (COALESCE(total_flight_hours, 0) + COALESCE($2::numeric, 0)) >= 50 THEN 'MAINTENANCE'
          -- Aksi halde kullanılabilir yap
          ELSE 'AVAILABLE'
        END
      FROM missions m
      WHERE m.id = $1
        AND m.drone_id = d.id
        AND m.status = 'IN_PROGRESS'
      RETURNING d.id
    )
    UPDATE missions m
    SET
      status = 'COMPLETED',
      actual_end = NOW(),
      flight_hours_logged = COALESCE($2::numeric, 0)
    WHERE m.id = $1
      AND m.drone_id IN (SELECT id FROM updated_drone)
    RETURNING m.*;
  `;

  supports(status: MissionStatus): boolean {
    return status === MissionStatus.COMPLETED;
  }



  async execute(missionId: string, dto: UpdateMissionStatusDto) {
      if (
        dto.flightHoursLogged === undefined ||
        dto.flightHoursLogged <= 0
      ) {
        throw new BadRequestException(
          'Flight hours must be greater than zero when completing a mission.',
        );
      }
    return this.dataSource.query(this.query, [
      missionId,
      dto.flightHoursLogged ?? 0, 
    ]);
  }
}