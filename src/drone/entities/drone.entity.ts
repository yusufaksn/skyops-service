import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { DroneModel } from '../enums/drone-model.enum';
import { DroneStatus } from '../enums/drone-status.enum';

@Entity('drones')
export class Drone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'serial_number',
    type: 'varchar',
    length: 13,
    unique: true,
  })
  serial_number: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  model: DroneModel;

  @Column({
    type: 'varchar',
    length: 20,
    default: DroneStatus.AVAILABLE,
  })
  status: DroneStatus;

  @Column({
    name: 'total_flight_hours',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  total_flight_hours: number;

  @Column({
    name: 'last_maintenance_date',
    type: 'timestamp',
    nullable: true,
  })
  last_maintenance_date: Date | null;

  @Column({
    name: 'next_maintenance_due',
    type: 'timestamp',
  })
  next_maintenance_due: Date;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  created_at: Date;
}