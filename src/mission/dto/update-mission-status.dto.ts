import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { MissionStatus } from '../enums/mission-status.enum';

export class UpdateMissionStatusDto {
  @IsEnum(MissionStatus, { message: 'Invalid target status!' })
  status: MissionStatus;

  @IsOptional()
  @IsNumber({}, { message: 'Flight hours must be a numeric value.' })
  @Min(0)
  flightHoursLogged?: number;

  @IsOptional()
  @IsString({ message: 'Please provide a reason for the abort.' })
  abortReason?: string;
}