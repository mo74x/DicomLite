/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StudiesService } from './studies.service';
import type { Response } from 'express';
import * as fs from 'fs';

@Controller('studies')
export class StudiesController {
  constructor(private readonly studiesService: StudiesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadStudy(@UploadedFile() file: Express.Multer.File) {
    return this.studiesService.handleUpload(file);
  }

  @Get()
  async getStudies() {
    return this.studiesService.findAll();
  }

  // Raw file server endpoint so the frontend viewer can request the binary stream
  @Get(':id/raw')
  async getRawFile(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    const study = await this.studiesService.findOne(id);
    if (!study || !fs.existsSync(study.fileUrl)) {
      throw new NotFoundException('DICOM file not found');
    }

    res.setHeader('Content-Type', 'application/dicom');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${study.studyInstanceUid}.dcm"`,
    );

    const fileStream = fs.createReadStream(study.fileUrl);
    fileStream.pipe(res);
  }
}
