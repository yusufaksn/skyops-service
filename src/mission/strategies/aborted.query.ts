import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { MissionStatus } from '../enums/mission-status.enum';
import { UpdateMissionStatusDto } from '../dto/update-mission-status.dto';
import { MissionStrategy } from './mission-status.strategy';

@Injectable()
export class AbortedMissionStrategy implements MissionStrategy {
  constructor(private readonly dataSource: DataSource) {}

  private readonly query = `
    WITH updated_drone AS (
      UPDATE drones d
      SET status = 'AVAILABLE'
      FROM missions m
      WHERE m.id = $1
        AND m.drone_id = d.id
        AND m.status IN ('PLANNED', 'PRE_FLIGHT_CHECK', 'IN_PROGRESS')
      RETURNING d.id
    )
    UPDATE missions m
    SET
      status = 'ABORTED',
      actual_end = COALESCE(actual_end, NOW()),
      abort_reason = $2
    WHERE m.id = $1
      AND m.status IN ('PLANNED', 'PRE_FLIGHT_CHECK', 'IN_PROGRESS')
      AND m.drone_id IN (SELECT id FROM updated_drone)
    RETURNING m.*;
  `;

  supports(status: MissionStatus): boolean {
    return status === MissionStatus.ABORTED;
  }

 

  async execute(missionId: string, dto: UpdateMissionStatusDto) {
    return this.dataSource.query(this.query, [
      missionId,
      dto.abortReason ?? null,
    ]);
  }
}