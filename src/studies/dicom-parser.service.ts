/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as dicomParser from 'dicom-parser';

export interface ParsedDicomMetadata {
  patientId: string;
  patientName: string;
  studyInstanceUid: string;
  modality: string;
  studyDate: Date | null;
}

@Injectable()
export class DicomParserService {
  private readonly logger = new Logger(DicomParserService.name);

  // Parses a raw DICOM file buffer to extract core clinical metadata.
  extractMetadata(fileBuffer: Buffer): ParsedDicomMetadata {
    try {
      // Convert Node.js Buffer to a Uint8Array for dicom-parser
      const byteArray = new Uint8Array(fileBuffer);
      const dataSet = dicomParser.parseDicom(byteArray);

      // Extract specific DICOM tags
      const patientId = dataSet.string('x00100020');
      const patientName = dataSet.string('x00100010');
      const studyInstanceUid = dataSet.string('x0020000d');
      const modality = dataSet.string('x00080060');
      const studyDateRaw = dataSet.string('x00080020');

      if (!studyInstanceUid) {
        throw new BadRequestException(
          'Invalid DICOM file: Missing StudyInstanceUID',
        );
      }

      return {
        patientId: patientId || 'UNKNOWN_ID',
        patientName: patientName
          ? patientName.replace(/\^/g, ' ').trim()
          : 'Anonymous',
        studyInstanceUid,
        modality: modality || 'UNKNOWN',
        studyDate: this.parseDicomDate(studyDateRaw),
      };
    } catch (error) {
      this.logger.error(`Failed to parse DICOM file: ${error.message}`);
      throw new BadRequestException(
        'Failed to extract metadata from the uploaded file. Ensure it is a valid DICOM format.',
      );
    }
  }

  //convert DICOM standard date to a JavaScript Date object.
  private parseDicomDate(dicomDate?: string): Date | null {
    if (!dicomDate || dicomDate.length !== 8) return null;

    const year = parseInt(dicomDate.substring(0, 4), 10);
    const month = parseInt(dicomDate.substring(4, 6), 10) - 1;
    const day = parseInt(dicomDate.substring(6, 8), 10);

    return new Date(year, month, day);
  }
}
