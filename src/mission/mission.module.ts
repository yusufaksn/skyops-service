import { Module } from '@nestjs/common';
import { MissionController } from './mission.controller';
import { MissionsService } from './mission.service';

// Strateji sınıflarını import et (dosya yollarını kendi klasör yapına göre kontrol et)
import { AbortedMissionStrategy } from './strategies/aborted.query';
import { CompletedMissionStrategy } from './strategies/completed.query';
import { InProgressMissionStrategy } from './strategies/in-progress.query';
import { PreFlightCheckMissionStrategy } from './strategies/pre-flight-check-mission.strategy';

@Module({
  controllers: [MissionController],
  providers: [
    MissionsService,

    AbortedMissionStrategy,
    CompletedMissionStrategy,
    InProgressMissionStrategy,
    PreFlightCheckMissionStrategy,
    {
      provide: 'MISSION_STRATEGIES',
      useFactory: (
        aborted: AbortedMissionStrategy,
        completed: CompletedMissionStrategy,
        inProgress: InProgressMissionStrategy,
        preFlight: PreFlightCheckMissionStrategy,
      ) => [aborted, completed, inProgress, preFlight],
      inject: [
        AbortedMissionStrategy,
        CompletedMissionStrategy,
        InProgressMissionStrategy,
        PreFlightCheckMissionStrategy,
      ],
    },
  ],
  exports: [MissionsService],
})
export class MissionModule {}