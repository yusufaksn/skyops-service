export class CreateDrone {}
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

import { DroneModel } from '../enums/drone-model.enum';
import { DroneStatus } from '../enums/drone-status.enum';

export class CreateDroneDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^SKY-[A-Z0-9]{4}-[A-Z0-9]{4}$/, {
    message: 'Serial number must be in format SKY-XXXX-XXXX',
  })
  serial_number: string;


  @IsEnum(DroneModel)
  model: DroneModel;


  @IsOptional()
  @IsEnum(DroneStatus)
  status?: DroneStatus;


  @IsOptional()
  @IsNumber()
  @Min(0)
  total_flight_hours?: number;


  @IsOptional()
  @IsDateString()
  last_maintenance_date?: Date;


  @IsOptional()
  @IsDateString()
  next_maintenance_due?: Date;
}