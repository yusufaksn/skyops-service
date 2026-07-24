import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMissionsTable1784825906379
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "missions" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" varchar(100) NOT NULL,
        "drone_id" uuid NOT NULL REFERENCES "drones"("id"),
        "pilot_name" varchar(100) NOT NULL,
        "site_location" varchar(255) NOT NULL,
        "mission_type" varchar(50) NOT NULL,
        "status" varchar(30) NOT NULL DEFAULT 'PLANNED',
        "planned_start" TIMESTAMP NOT NULL,
        "planned_end" TIMESTAMP NOT NULL,
        "actual_start" TIMESTAMP,
        "actual_end" TIMESTAMP,
        "flight_hours_logged" numeric(10,2),
        "abort_reason" TEXT,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
          "pre_flight_checked" BOOLEAN NOT NULL DEFAULT FALSE,

        CONSTRAINT "PK_missions_id" PRIMARY KEY ("id")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "missions";
    `);
  }
}