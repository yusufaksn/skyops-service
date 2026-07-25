import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, Between, In } from 'typeorm';

import { Drone } from '../drone/entities/drone.entity';
import { Mission } from '../mission/entities/mission.entity';
import { MaintenanceLog } from '../maintenance/entities/maintenance-log.entity';

import { DroneStatus } from '../drone/enums/drone-status.enum';
import { MissionStatus } from '../mission/enums/mission-status.enum';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Drone)
    private readonly droneRepository: Repository<Drone>,
    @InjectRepository(Mission)
    private readonly missionRepository: Repository<Mission>,
    @InjectRepository(MaintenanceLog)
    private readonly maintenanceLogRepository: Repository<MaintenanceLog>,
  ) {}

  async getFleetHealthReport() {
    // 1. Toplam Drone Sayısı
    const totalDrones = await this.droneRepository.count();

    // 2. Durumlara Göre Dağılım
    const statusCountsRaw = await this.droneRepository
      .createQueryBuilder('drone')
      .select('drone.status', 'status')
      .addSelect('COUNT(drone.id)', 'count')
      .groupBy('drone.status')
      .getRawMany();

    const statusBreakdown = statusCountsRaw.reduce((acc, row) => {
      acc[row.status] = parseInt(row.count, 10);
      return acc;
    }, {});

    // 3. Bakımı Geciken veya Bakımda Olan Dronelar (Alias ile camelCase Mapleme)
    const overdueMaintenanceRaw = await this.droneRepository
      .createQueryBuilder('drone')
      .select([
        'drone.id AS id',
        'drone.serial_number AS "serialNumber"',
        'drone.model AS model',
        'drone.status AS status',
        'drone.total_flight_hours AS "totalFlightHours"',
        'drone.next_maintenance_due AS "nextMaintenanceDue"',
      ])
      .where('drone.next_maintenance_due <= :now', { now: new Date() })
      .orWhere('drone.status = :status', { status: DroneStatus.MAINTENANCE })
      .getRawMany();

    // 4. Önümüzdeki 24 Saatteki Görevler
    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const upcomingMissions24h = await this.missionRepository.count({
      where: {
        planned_start: Between(now, next24Hours),
        status: In([MissionStatus.PLANNED, 'SCHEDULED' as MissionStatus]),
      },
    });

    // 5. Ortalama Uçuş Saati
    const avgResult = await this.droneRepository
      .createQueryBuilder('drone')
      .select('AVG(drone.total_flight_hours)', 'avg')
      .getRawOne();

    const averageFlightHours = avgResult?.avg
      ? parseFloat(parseFloat(avgResult.avg).toFixed(2))
      : 0;

    return {
      totalDrones,
      statusBreakdown,
      overdueMaintenance: overdueMaintenanceRaw,
      upcomingMissions24h,
      averageFlightHours,
    };
  }

  async getDroneDetail(droneId: string) {
    const drone = await this.droneRepository.findOne({
      where: { id: droneId },
    });

    if (!drone) {
      throw new NotFoundException(`Drone with ID "${droneId}" was not found`);
    }

    const missions = await this.missionRepository.find({
      where: { drone_id: droneId },
      order: { created_at: 'DESC' },
    });

    const maintenanceLogs = await this.maintenanceLogRepository.find({
      where: { droneId: droneId },
      order: { datePerformed: 'DESC' },
    });

    // Entity alanlarını camelCase nesne yapısına çevirip dönüyoruz
    return {
      id: drone.id,
      serialNumber: drone.serial_number,
      model: drone.model,
      status: drone.status,
      totalFlightHours: drone.total_flight_hours,
      nextMaintenanceDue: drone.next_maintenance_due,
      createdAt: drone.created_at,
      missions: missions.map((m) => ({
        id: m.id,
        name: m.name,
        status: m.status,
        siteLocation: m.site_location,
        pilotName: m.pilot_name,
        plannedStart: m.planned_start,
        plannedEnd: m.planned_end,
        createdAt: m.created_at,
      })),
      maintenanceLogs,
    };
  }
}