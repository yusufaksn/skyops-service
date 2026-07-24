import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceLog } from './entities/maintenance-log.entity';
import { Drone } from '../drone/entities/drone.entity';
import { MaintenanceType } from './enums/maintenance-type.enum';
import { DroneStatus } from '../drone/enums/drone-status.enum';

describe('MaintenanceService', () => {
  let service: MaintenanceService;
  let mockDroneRepository: any;
  let mockLogRepository: any;

  const mockDrone = {
    id: 'drone-uuid-123',
    total_flight_hours: 12.5,
    status: DroneStatus.AVAILABLE,
    last_maintenance_date: null,
  };

  beforeEach(async () => {
    mockDroneRepository = {
      findOne: jest.fn().mockResolvedValue({ ...mockDrone }),
      save: jest.fn().mockImplementation((drone) => Promise.resolve(drone)),
    };

    mockLogRepository = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockImplementation((log) => Promise.resolve({ id: 'log-uuid-1', ...log })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaintenanceService,
        {
          provide: getRepositoryToken(MaintenanceLog),
          useValue: mockLogRepository,
        },
        {
          provide: getRepositoryToken(Drone),
          useValue: mockDroneRepository,
        },
      ],
    }).compile();

    service = module.get<MaintenanceService>(MaintenanceService);
  });

  it('should create a maintenance log and update drone status', async () => {
    const dto = {
      droneId: 'drone-uuid-123',
      type: MaintenanceType.ROUTINE_CHECK,
      technicianName: 'Ahmet Yılmaz',
    };

    const result = await service.create(dto);

    expect(result.flightHoursAtMaintenance).toBe(12.5);
    expect(mockDroneRepository.save).toHaveBeenCalled();
    expect(mockLogRepository.save).toHaveBeenCalled();
  });

  it('should throw NotFoundException if drone is not found', async () => {
    mockDroneRepository.findOne.mockResolvedValue(null);

    await expect(
      service.create({
        droneId: 'olmayan-id',
        type: MaintenanceType.ROUTINE_CHECK,
        technicianName: 'Ahmet',
      }),
    ).rejects.toThrow(NotFoundException);
  });
});