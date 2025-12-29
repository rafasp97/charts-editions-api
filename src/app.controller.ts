import { Body, Controller, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ChartsDto } from './dto/charts.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post()
  getCharts(
    @Query('group') group: string,
    @Body() chartsDto: ChartsDto) {
    return this.appService.getCharts(group, chartsDto);
  }
}
