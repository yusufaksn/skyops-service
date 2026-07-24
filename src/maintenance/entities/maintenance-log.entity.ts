import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum MaintenanceType {
  ROUTINE = 'ROUTINE',
  REPAIR = 'REPAIR',
  INSPECTION = 'INSPECTION',
}

@Entity('maintenance_logs')
export class MaintenanceLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'drone_id', type: 'uuid' })
  droneId: string;

  @Column({ type: 'varchar', length: 50 })
  type: string; 

  @Column({ name: 'technician_name', type: 'varchar', length: 255 })
  technicianName: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'date_performed', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  datePerformed: Date;

  @Column({
    name: 'flight_hours_at_maintenance',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  flightHoursAtMaintenance: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}