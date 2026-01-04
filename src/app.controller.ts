import { Body, Controller, Get, Header, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { ChartsDto } from './dto/charts.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageDto } from './dto/image.dto';
import type { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post()
  getCharts(
    @Query('group') group: string,
    @Body() chartsDto: ChartsDto) {
    return this.appService.getCharts(group, chartsDto);
  }

  @Post('/image')
  @UseInterceptors(FileInterceptor('image'))
  async generateImg(
    @UploadedFile() image: Express.Multer.File,
    @Body() dto: ImageDto,
    @Res() res: Response,
  ) {

    const imgBuffer = await this.appService.generateImage(image, dto);

    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': 'inline; filename="charts.jpg"',
      'Content-Length': imgBuffer.length,
    });

    return res.send(imgBuffer);
  }


}

