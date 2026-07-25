import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /**
   * Fleet Health Summary
   * GET /reports/fleet-health
   * 
   * Returns overview of total drones, status breakdown, 
   * overdue maintenance list, upcoming 24h missions, and average flight hours.
   */
  @Get('fleet-health')
  async getFleetHealth() {
    return this.reportsService.getFleetHealthReport();
  }

  /**
   * Drone Detail Page Data
   * GET /reports/drones/:id
   * 
   * Returns full drone information along with mission history 
   * and maintenance logs for the specific drone.
   */
  @Get('drones/:id')
  async getDroneDetail(@Param('id') id: string) {
    const droneDetail = await this.reportsService.getDroneDetail(id);

    if (!droneDetail) {
      throw new NotFoundException(`Drone with ID "${id}" was not found`);
    }

    return droneDetail;
  }
}