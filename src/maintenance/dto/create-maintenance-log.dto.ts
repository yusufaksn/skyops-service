import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { MaintenanceType } from '../enums/maintenance-type.enum';

export class CreateMaintenanceLogDto {
  @IsUUID()
  @IsNotEmpty()
  droneId: string;

  @IsEnum(MaintenanceType)
  @IsNotEmpty()
  type: MaintenanceType;

  @IsString()
  @IsNotEmpty()
  technicianName: string;

  @IsString()
  @IsOptional()
  notes?: string;
}