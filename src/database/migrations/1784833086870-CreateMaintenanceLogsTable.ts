import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateMaintenanceLogsTable1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. maintenance_logs Tablosu
    await queryRunner.createTable(
      new Table({
        name: 'maintenance_logs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'drone_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'technician_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'date_performed',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'flight_hours_at_maintenance',
            type: 'numeric',
            precision: 10,
            scale: 2,
            isNullable: false,
            default: 0,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // 2. Performans İçin Drone ID Index'i
    await queryRunner.createIndex(
      'maintenance_logs',
      new TableIndex({
        name: 'IDX_MAINTENANCE_LOGS_DRONE_ID',
        columnNames: ['drone_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('maintenance_logs', 'IDX_MAINTENANCE_LOGS_DRONE_ID');
    await queryRunner.dropTable('maintenance_logs');
  }
}