import { Test, TestingModule } from '@nestjs/testing';
import { StudiesService } from './studies.service';
import { PrismaService } from '../prisma/prisma.service';
import { DicomParserService } from './dicom-parser.service';

jest.mock('../prisma/prisma.service', () => ({
  PrismaService: class { },
}));

jest.mock('./dicom-parser.service', () => ({
  DicomParserService: class { },
}));

describe('StudiesService', () => {
  let service: StudiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudiesService, PrismaService, DicomParserService],
    }).compile();

    service = module.get<StudiesService>(StudiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
