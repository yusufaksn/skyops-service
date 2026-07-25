# SkyOps Drone Fleet Management

Backend application for managing drones, missions, maintenance records, and fleet reports.

## Tech Stack

- NestJS
- TypeORM
- PostgreSQL
- Docker & Docker Compose
- Jest

## Features

- Drone Management
- Mission Lifecycle Management
- Maintenance Tracking
- Fleet Health Reports
- Database Migrations
- Docker Support
- Mission History Tracking

## Architecture Notes

- Strategy Pattern is used for mission status transitions.
- Database transactions are used to ensure data consistency.
- Row-level locking is used to help prevent race conditions during mission updates.
- Mission history records are maintained to provide an audit trail of mission status changes.

## Getting Started

Start the application:

```bash
docker compose up -d --build
```

## Seed Data

```bash
docker exec -i skyops_postgres psql -U postgres -d skyops_db < database/seeds/seed.sql
```

## Running Tests

Unit Test

```bash
npx jest src/maintenance/maintenance.service.spec.ts
```

E2E Test

```bash
npx jest --config ./test/jest-e2e.json test/mission-lifecycle.e2e-spec.ts --no-cache
```

## Frontend

```
http://localhost
```

## API Endpoints

### Health Check

```
GET http://localhost:3000/api/health
```

### Fleet Health Report

```
GET http://localhost:3000/api/reports/fleet-health
```

### Create Mission

```
POST http://localhost:3000/api/missions
```

```json
{
  "name": "Wind Turbine E2E Field Inspection",
  "drone_id": "8f12a9c3-4d2b-4e89-a21b-5e638d9d83a1",
  "pilot_name": "John Doe",
  "site_location": "Izmir Wind Farm",
  "mission_type": "WIND_TURBINE_INSPECTION",
  "planned_start": "2026-07-25T10:00:00.000Z",
  "planned_end": "2026-07-25T12:00:00.000Z"
}
```

### Update Mission Status

```
PUT http://localhost:3000/api/missions/:id/status
```

#### PRE_FLIGHT_CHECK

```json
{
  "status": "PRE_FLIGHT_CHECK"
}
```

#### IN_PROGRESS

```json
{
  "status": "IN_PROGRESS"
}
```

#### COMPLETED

```json
{
  "status": "COMPLETED",
  "flightHoursLogged": 1.5
}
```

#### ABORTED

```json
{
  "status": "ABORTED",
  "abortReason": "Adverse weather conditions (severe wind)"
}
```