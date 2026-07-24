import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { MissionStatus } from '../enums/mission-status.enum';
import { UpdateMissionStatusDto } from '../dto/update-mission-status.dto';
import { MissionStrategy } from './mission-status.strategy';

@Injectable()
export class InProgressMissionStrategy implements MissionStrategy {
  constructor(private readonly dataSource: DataSource) {}

  private readonly query = `
    WITH updated_drone AS (
      UPDATE drones d
      SET status = 'IN_MISSION'
      FROM missions m
      WHERE m.id = $1
        AND m.drone_id = d.id
        AND m.status = 'PRE_FLIGHT_CHECK'
        AND m.pre_flight_checked = TRUE
        AND d.status = 'AVAILABLE'
      RETURNING d.id
    )
    UPDATE missions m
    SET
      status = 'IN_PROGRESS',
      actual_start = NOW()
    WHERE m.id = $1
      AND m.drone_id IN (SELECT id FROM updated_drone)
    RETURNING m.*;
  `;

  supports(status: MissionStatus): boolean {
    return status === MissionStatus.IN_PROGRESS;
  }


  async execute(missionId: string, dto: UpdateMissionStatusDto) {
    return this.dataSource.query(this.query, [missionId]);
  }
}