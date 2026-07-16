import { Module } from '@nestjs/common';
import { StudiesController } from './studies.controller';
import { StudiesService } from './studies.service';
import { DicomParserService } from './dicom-parser.service';

@Module({
  controllers: [StudiesController],
  providers: [StudiesService, DicomParserService]
})
export class StudiesModule {}
