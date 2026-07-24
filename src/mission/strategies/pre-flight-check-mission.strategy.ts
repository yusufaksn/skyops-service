import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { MissionStatus } from '../enums/mission-status.enum';
import { UpdateMissionStatusDto } from '../dto/update-mission-status.dto';
import { MissionStrategy } from './mission-status.strategy';

@Injectable()
export class PreFlightCheckMissionStrategy implements MissionStrategy {
  constructor(private readonly dataSource: DataSource) {}

  private readonly query = `
    UPDATE missions m
    SET
      pre_flight_checked = TRUE,
      status = 'PRE_FLIGHT_CHECK'
    FROM drones d
    WHERE m.id = $1
      AND m.drone_id = d.id
      AND m.status = 'PLANNED'
      AND d.status = 'AVAILABLE'
    RETURNING m.*;
  `;

  supports(status: MissionStatus): boolean {
    return status === MissionStatus.PRE_FLIGHT_CHECK;
  }

  
  async execute(missionId: string, dto: UpdateMissionStatusDto) {
  return this.dataSource.query(this.query, [missionId]);
    }
}