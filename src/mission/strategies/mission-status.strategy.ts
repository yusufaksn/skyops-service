import { MissionStatus } from '../enums/mission-status.enum';
import { UpdateMissionStatusDto } from '../dto/update-mission-status.dto';

export interface MissionStrategy {
  supports(status: MissionStatus): boolean;
  execute(
    missionId: string,
    dto: UpdateMissionStatusDto,
  ): Promise<any>;
}