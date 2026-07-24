import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';

describe('Mission Lifecycle (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let createdDroneId: string;
  let completedMissionId: string;

  // Helper: Safely extracts the status value from the API response
  const extractStatus = (body: any): string | undefined => {
    if (!body) return undefined;
    if (typeof body.status === 'string') return body.status;
    if (Array.isArray(body)) {
      const first = Array.isArray(body[0]) ? body[0][0] : body[0];
      return first?.status;
    }
    if (body.data?.status) return body.data.status;
    return undefined;
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    dataSource = app.get(DataSource);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  // STEP 1: Create a new Drone
  it('1. POST /drones - Should create a drone successfully', async () => {
    const randomSerial = `SKY-${Math.floor(1000 + Math.random() * 9000)}-E2E1`;

    const response = await request(app.getHttpServer())
      .post('/drones')
      .send({
        serial_number: randomSerial,
        model: 'MATRICE_300',
      })
      .expect(201);

    createdDroneId = response.body.id || response.body[0]?.id;
    expect(createdDroneId).toBeDefined();
  });

  // STEP 2: Schedule a Mission
  it('2. POST /missions - Should schedule a mission successfully (PLANNED)', async () => {
    const startTime = new Date(Date.now() + 10 * 60 * 1000);
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);

    const response = await request(app.getHttpServer())
      .post('/missions')
      .send({
        name: 'Wind Turbine E2E Field Inspection',
        drone_id: createdDroneId,
        pilot_name: 'John Doe',
        site_location: 'Izmir Wind Farm',
        mission_type: 'WIND_TURBINE_INSPECTION',
        planned_start: startTime.toISOString(),
        planned_end: endTime.toISOString(),
      })
      .expect(201);

    completedMissionId = response.body.id || response.body[0]?.id;
    expect(completedMissionId).toBeDefined();
  });

  // STEP 3: Start the Mission (PRE_FLIGHT_CHECK -> IN_PROGRESS)
  it('3. PUT /missions/:id/status - Should set mission to IN_PROGRESS', async () => {
    expect(completedMissionId).toBeDefined();

    // Satisfies SQL strategy requirements: m.status = 'PRE_FLIGHT_CHECK' and pre_flight_checked = TRUE
    await dataSource.query(
      `UPDATE missions 
       SET status = 'PRE_FLIGHT_CHECK', pre_flight_checked = TRUE 
       WHERE id = $1`,
      [completedMissionId],
    );

    const response = await request(app.getHttpServer())
      .put(`/missions/${completedMissionId}/status`)
      .send({
        status: 'IN_PROGRESS',
      })
      .expect(200);

    const status = extractStatus(response.body);
    expect(status).toBe('IN_PROGRESS');
  });

  // STEP 4: Complete Mission with Flight Hours (IN_PROGRESS -> COMPLETED)
  it('4. PUT /missions/:id/status - Should complete mission and trigger MAINTENANCE', async () => {
    expect(completedMissionId).toBeDefined();

    const completeResponse = await request(app.getHttpServer())
      .put(`/missions/${completedMissionId}/status`)
      .send({
        status: 'COMPLETED',
        flightHoursLogged: 55,
      })
      .expect(200);

    const status = extractStatus(completeResponse.body);
    expect(status).toBe('COMPLETED');

    // Verify drone transitioned to MAINTENANCE after exceeding the 50-hour threshold
    const droneResponse = await request(app.getHttpServer())
      .get(`/drones/${createdDroneId}`)
      .expect(200);

    expect(droneResponse.body.status).toBe('MAINTENANCE');
  });

  // STEP 5: Test Abort Strategy on a New Mission
  it('5. PUT /missions/:id/status - Should abort mission and set drone back to AVAILABLE', async () => {
    // 1. Create a new drone
    const randomSerial = `SKY-${Math.floor(1000 + Math.random() * 9000)}-E2E2`;
    const droneRes = await request(app.getHttpServer())
      .post('/drones')
      .send({
        serial_number: randomSerial,
        model: 'MATRICE_300',
      })
      .expect(201);

    const tempDroneId = droneRes.body.id || droneRes.body[0]?.id;

    // 2. Create a new mission
    const startTime = new Date(Date.now() + 20 * 60 * 1000);
    const endTime = new Date(startTime.getTime() + 1 * 60 * 60 * 1000);

    const missionRes = await request(app.getHttpServer())
      .post('/missions')
      .send({
        name: 'Solar Panel Inspection',
        drone_id: tempDroneId,
        pilot_name: 'Jane Doe',
        site_location: 'Manisa Solar Park',
        mission_type: 'WIND_TURBINE_INSPECTION',
        planned_start: startTime.toISOString(),
        planned_end: endTime.toISOString(),
      })
      .expect(201);

    const abortMissionId = missionRes.body.id || missionRes.body[0]?.id;

    // 3. Abort the mission
    const abortResponse = await request(app.getHttpServer())
      .put(`/missions/${abortMissionId}/status`)
      .send({
        status: 'ABORTED',
        abortReason: 'Adverse weather conditions',
      })
      .expect(200);

    const status = extractStatus(abortResponse.body);
    expect(status).toBe('ABORTED');

    // 4. Verify the drone status returned to AVAILABLE
    const updatedDroneRes = await request(app.getHttpServer())
      .get(`/drones/${tempDroneId}`)
      .expect(200);

    expect(updatedDroneRes.body.status).toBe('AVAILABLE');
  });
});