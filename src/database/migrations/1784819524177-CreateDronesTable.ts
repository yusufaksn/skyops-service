import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDronesTable1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "drones" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "serial_number" varchar(13) NOT NULL,
        "model" varchar(50) NOT NULL,
        "status" varchar(20) NOT NULL DEFAULT 'AVAILABLE',
        "total_flight_hours" numeric(10,2) NOT NULL DEFAULT 0,
        "last_maintenance_date" TIMESTAMP,
        "next_maintenance_due" TIMESTAMP NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_drones_serial_number" UNIQUE ("serial_number"),
        CONSTRAINT "PK_drones_id" PRIMARY KEY ("id")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "drones";`);
  }
}