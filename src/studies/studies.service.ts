/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DicomParserService } from './dicom-parser.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StudiesService {
  private readonly logger = new Logger(StudiesService.name);
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor(
    private readonly prisma: PrismaService,
    private readonly dicomParser: DicomParserService,
  ) {
    // Ensure upload directory exists locally
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async handleUpload(file: Express.Multer.File) {
    try {
      //Extract metadata using our pure parser service
      const metadata = this.dicomParser.extractMetadata(file.buffer);

      //Save file safely to the local disk(S3 in prod)
      const fileName = `${metadata.studyInstanceUid}.dcm`;
      const filePath = path.join(this.uploadDir, fileName);
      fs.writeFileSync(filePath, file.buffer);

      //Save metadata record to PostgreSQL
      const study = await this.prisma.study.upsert({
        where: { studyInstanceUid: metadata.studyInstanceUid },
        update: {
          patientId: metadata.patientId,
          patientName: metadata.patientName,
          modality: metadata.modality,
          studyDate: metadata.studyDate,
          fileUrl: filePath,
          fileSize: file.size,
        },
        create: {
          patientId: metadata.patientId,
          patientName: metadata.patientName,
          studyInstanceUid: metadata.studyInstanceUid,
          modality: metadata.modality,
          studyDate: metadata.studyDate,
          fileUrl: filePath,
          fileSize: file.size,
        },
      });

      this.logger.log(
        `Successfully processed and stored Study: ${study.studyInstanceUid}`,
      );
      return study;
    } catch (error) {
      this.logger.error(`Error saving uploaded DICOM: ${error.message}`);
      throw new InternalServerErrorException(
        error.message || 'An error occurred while storing the medical record.',
      );
    }
  }

  async findAll() {
    return this.prisma.study.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.study.findUnique({
      where: { id },
    });
  }
}
