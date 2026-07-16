import { Module } from '@nestjs/common';
import { StudiesController } from './studies.controller';
import { StudiesService } from './studies.service';
import { DicomParserService } from './dicom-parser.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StudiesController],
  providers: [StudiesService, DicomParserService],
})
export class StudiesModule {}
