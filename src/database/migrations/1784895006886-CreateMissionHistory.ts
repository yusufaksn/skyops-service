import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMissionHistory1784895006886
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE mission_history (
          id BIGSERIAL PRIMARY KEY,
          mission_id UUID NOT NULL,

          name VARCHAR(100),
          drone_id UUID,
          pilot_name VARCHAR(100),
          site_location VARCHAR(255),
          mission_type VARCHAR(50),
          status VARCHAR(30),

          planned_start TIMESTAMP,
          planned_end TIMESTAMP,
          actual_start TIMESTAMP,
          actual_end TIMESTAMP,

          flight_hours_logged NUMERIC(10,2),
          abort_reason TEXT,

          created_at TIMESTAMP,

          operation_type VARCHAR(10) NOT NULL,
          changed_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION mission_history_trigger_fn()
      RETURNS TRIGGER AS
      $$
      BEGIN

          IF TG_OP = 'INSERT' THEN

              INSERT INTO mission_history (
                  mission_id,
                  name,
                  drone_id,
                  pilot_name,
                  site_location,
                  mission_type,
                  status,
                  planned_start,
                  planned_end,
                  actual_start,
                  actual_end,
                  flight_hours_logged,
                  abort_reason,
                  created_at,
                  operation_type,
                  changed_at
              )
              VALUES (
                  NEW.id,
                  NEW.name,
                  NEW.drone_id,
                  NEW.pilot_name,
                  NEW.site_location,
                  NEW.mission_type,
                  NEW.status,
                  NEW.planned_start,
                  NEW.planned_end,
                  NEW.actual_start,
                  NEW.actual_end,
                  NEW.flight_hours_logged,
                  NEW.abort_reason,
                  NEW.created_at,
                  TG_OP,
                  NOW()
              );

              RETURN NEW;

          ELSIF TG_OP = 'UPDATE' THEN

              INSERT INTO mission_history (
                  mission_id,
                  name,
                  drone_id,
                  pilot_name,
                  site_location,
                  mission_type,
                  status,
                  planned_start,
                  planned_end,
                  actual_start,
                  actual_end,
                  flight_hours_logged,
                  abort_reason,
                  created_at,
                  operation_type,
                  changed_at
              )
              VALUES (
                  NEW.id,
                  NEW.name,
                  NEW.drone_id,
                  NEW.pilot_name,
                  NEW.site_location,
                  NEW.mission_type,
                  NEW.status,
                  NEW.planned_start,
                  NEW.planned_end,
                  NEW.actual_start,
                  NEW.actual_end,
                  NEW.flight_hours_logged,
                  NEW.abort_reason,
                  NEW.created_at,
                  TG_OP,
                  NOW()
              );

              RETURN NEW;

          ELSIF TG_OP = 'DELETE' THEN

              INSERT INTO mission_history (
                  mission_id,
                  name,
                  drone_id,
                  pilot_name,
                  site_location,
                  mission_type,
                  status,
                  planned_start,
                  planned_end,
                  actual_start,
                  actual_end,
                  flight_hours_logged,
                  abort_reason,
                  created_at,
                  operation_type,
                  changed_at
              )
              VALUES (
                  OLD.id,
                  OLD.name,
                  OLD.drone_id,
                  OLD.pilot_name,
                  OLD.site_location,
                  OLD.mission_type,
                  OLD.status,
                  OLD.planned_start,
                  OLD.planned_end,
                  OLD.actual_start,
                  OLD.actual_end,
                  OLD.flight_hours_logged,
                  OLD.abort_reason,
                  OLD.created_at,
                  TG_OP,
                  NOW()
              );

              RETURN OLD;

          END IF;

          RETURN NULL;

      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER mission_history_trigger
      AFTER INSERT OR UPDATE OR DELETE
      ON missions
      FOR EACH ROW
      EXECUTE FUNCTION mission_history_trigger_fn();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS mission_history_trigger ON missions;
    `);

    await queryRunner.query(`
      DROP FUNCTION IF EXISTS mission_history_trigger_fn();
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS mission_history;
    `);
  }
}