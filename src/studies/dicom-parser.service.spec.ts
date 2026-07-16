import { Test, TestingModule } from '@nestjs/testing';
import { DicomParserService } from './dicom-parser.service';
import { BadRequestException } from '@nestjs/common';

describe('DicomParserService', () => {
  let service: DicomParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DicomParserService],
    }).compile();

    service = module.get<DicomParserService>(DicomParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fail with BadRequestException if buffer is empty/invalid', () => {
    const invalidBuffer = Buffer.from('not-a-dicom-file');

    expect(() => service.extractMetadata(invalidBuffer)).toThrow(
      BadRequestException,
    );
  });
});
