import {
  IsEnum,
  IsOptional,
} from 'class-validator';

import { DroneModel } from '../enums/drone-model.enum';
import { DroneStatus } from '../enums/drone-status.enum';

export class UpdateDroneDto {

  @IsOptional()
  @IsEnum(DroneModel)
  model?: DroneModel;


  @IsOptional()
  @IsEnum(DroneStatus)
  status?: DroneStatus;

}