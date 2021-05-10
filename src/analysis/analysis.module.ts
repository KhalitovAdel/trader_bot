import { Module } from '@nestjs/common';

import { AnalysisRegister } from './analysis.register';

@Module({
  providers: [AnalysisRegister],
  exports: [AnalysisRegister],
})
export class AnalysisModule {}
