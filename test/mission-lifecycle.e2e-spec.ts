import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Mission Lifecycle (e2e)', () => {
  let app: INestApplication;
  let createdDroneId: string;
  let createdMissionId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
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

    createdDroneId = response.body.id;
    expect(createdDroneId).toBeDefined();
  });

  // STEP 2: Schedule a Mission
  it('2. POST /missions - Should schedule a mission successfully', async () => {
    const startTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes in the future
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration

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

    createdMissionId = response.body.id;
    expect(createdMissionId).toBeDefined();
  });

  // STEP 3: Complete Mission & Verify Drone Status
  it('3. PUT /missions/:id/status - Should complete the mission and update drone status to AVAILABLE', async () => {
    expect(createdMissionId).toBeDefined();

    // Update mission status to COMPLETED
    await request(app.getHttpServer())
      .put(`/missions/${createdMissionId}/status`)
      .send({
        status: 'COMPLETED',
      })
      .expect(200);

    // Verify that the assigned drone is back to AVAILABLE status
    const droneResponse = await request(app.getHttpServer())
      .get(`/drones/${createdDroneId}`)
      .expect(200);

    expect(droneResponse.body.status).toBe('AVAILABLE');
  });
});