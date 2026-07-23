import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

import { MissionType } from '../enums/mission-type.enum';

export class CreateMissionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  drone_id: string;

  @IsString()
  @IsNotEmpty()
  pilot_name: string;

  @IsString()
  @IsNotEmpty()
  site_location: string;

  @IsEnum(MissionType)
  mission_type: MissionType;

  @IsDateString()
  planned_start: Date;

  @IsDateString()
  planned_end: Date;
}