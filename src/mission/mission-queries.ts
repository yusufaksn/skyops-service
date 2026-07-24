import { MissionStatus } from './enums/mission-status.enum';

export const MISSION_STATUS_QUERIES: Partial<Record<MissionStatus, string>> = {
  
  // 1. PRE_FLIGHT_CHECK
  [MissionStatus.PRE_FLIGHT_CHECK]: `
    UPDATE missions m
    SET 
      pre_flight_checked = TRUE,
      status = 'PRE_FLIGHT_CHECK'
    FROM drones d
    WHERE m.id = $1
      AND m.drone_id = d.id
      AND m.status = 'PLANNED'
      AND d.status = 'AVAILABLE'
    RETURNING m.*;
  `,

  // 2. IN_PROGRESS
  [MissionStatus.IN_PROGRESS]: `
    WITH updated_drone AS (
      UPDATE drones d
      SET status = 'IN_MISSION'
      FROM missions m
      WHERE m.id = $1
        AND m.drone_id = d.id
        AND m.status = 'PRE_FLIGHT_CHECK'
        AND m.pre_flight_checked = TRUE
        AND d.status = 'AVAILABLE'
      RETURNING d.id
    )
    UPDATE missions m
    SET 
      status = 'IN_PROGRESS',
      actual_start = NOW()
    WHERE m.id = $1
      AND m.drone_id IN (SELECT id FROM updated_drone)
    RETURNING m.*;
  `,

  // 3. COMPLETED
  [MissionStatus.COMPLETED]: `
    WITH updated_drone AS (
      UPDATE drones d
      SET 
        status = 'AVAILABLE',
        total_flight_hours = COALESCE(total_flight_hours, 0) + COALESCE($2::numeric, 0)
      FROM missions m
      WHERE m.id = $1
        AND m.drone_id = d.id
        AND m.status = 'IN_PROGRESS'
      RETURNING d.id
    )
    UPDATE missions m
    SET 
      status = 'COMPLETED',
      actual_end = NOW(),
      flight_hours_logged = COALESCE($2::numeric, 0)
    WHERE m.id = $1
      AND m.drone_id IN (SELECT id FROM updated_drone)
    RETURNING m.*;
  `,

  // 4. ABORTED
  [MissionStatus.ABORTED]: `
    WITH updated_drone AS (
      UPDATE drones d
      SET status = 'AVAILABLE'
      FROM missions m
      WHERE m.id = $1
        AND m.drone_id = d.id
      RETURNING d.id
    )
    UPDATE missions m
    SET 
      status = 'ABORTED',
      actual_end = COALESCE(actual_end, NOW()),
      abort_reason = $2
    WHERE m.id = $1
      AND m.status IN ('PLANNED', 'PRE_FLIGHT_CHECK', 'IN_PROGRESS')
      AND m.drone_id IN (SELECT id FROM updated_drone)
    RETURNING m.*;
  `,
};