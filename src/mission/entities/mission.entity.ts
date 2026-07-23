import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Drone } from '../../drone/entities/drone.entity';
import { MissionStatus } from '../enums/mission-status.enum';
import { MissionType } from '../enums/mission-type.enum';

@Entity('missions')
export class Mission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @ManyToOne(() => Drone)
  @JoinColumn({ name: 'drone_id' })
  drone: Drone;

  @Column()
  drone_id: string;

  @Column({ length: 100 })
  pilot_name: string;

  @Column({ length: 255 })
  site_location: string;

  @Column({ length: 50 })
  mission_type: MissionType;

  @Column({
    length: 30,
    default: MissionStatus.PLANNED,
  })
  status: MissionStatus;

  @Column({
    type: 'timestamp',
  })
  planned_start: Date;

  @Column({
    type: 'timestamp',
  })
  planned_end: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  actual_start?: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  actual_end?: Date;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  flight_hours_logged?: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  abort_reason?: string;

  @Column({
    type: 'timestamp',
    default: () => 'now()',
  })
  created_at: Date;
}