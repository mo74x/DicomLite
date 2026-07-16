import { Test, TestingModule } from '@nestjs/testing';
import { DicomParserService } from './dicom-parser.service';

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
});
