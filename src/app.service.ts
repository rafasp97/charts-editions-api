import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { LastFmPeriod } from './enums/LastFmPeriod.enum';
import axios, { AxiosError } from 'axios';
import { Artist } from './interfaces/Artist.interface';
import { FireBaseService } from './firebase.service';
import { StandardUsers } from './utils/standardUsers.utils';
import { ChartsDto } from './dto/charts.dto';
import { Helper } from './utils/helper.utils';
import * as dotenv from 'dotenv';
import { ArtistsByUsers } from './interfaces/ArtistsByUsers.interface';
import { Metrics } from './interfaces/Metrics.interface';
import { ImageDto } from './dto/image.dto';
import puppeteer from 'puppeteer';
import { Template } from './utils/template.utils';
import { Charts } from './interfaces/Charts.interface';

dotenv.config();


@Injectable()
export class AppService {
  constructor(
    private readonly fireBaseService: FireBaseService
  ) { }

  getCharts(group: string, chartsDto: ChartsDto): Promise<Charts> {
    if (!group && !chartsDto) {
      throw new BadRequestException(
        'Deve ser selecionado um grupo ou enviar os usuários',
      );
    }
    const users = group ? StandardUsers.getUsersByGroup(group) : chartsDto.users;
    const period = group ? LastFmPeriod.SevenDays : chartsDto.period;
    return this.generateCharts(users, period, group);
  }

  async generateCharts(users: string[], selectedPeriod: LastFmPeriod, group: string) {
    const artistsByUsers: ArtistsByUsers = await this.getArtistsByUsers(users, selectedPeriod);
    const artists: Artist[] = Object.values(artistsByUsers).flat();
    const rank = Helper.generateRank(artists);
    if (!group) return { rank };
    const rankByGroup = await this.generateRankByGroup(rank, group);
    return {
      rank: rankByGroup,
      metrics: Helper.getMetrics(rankByGroup, artistsByUsers),
      period: Helper.getPeriod(selectedPeriod)
    };
  }

  async generateRankByGroup(rank: Artist[], group: string) {
    const lastRank = await this.fireBaseService.getLastRankByGroup(group);
    const diffDays = Helper.calculateDiffDays(lastRank);
    if (diffDays > 7) await this.fireBaseService.registerNewRank(rank, group);
    return Helper.addIndexByLastRank(rank, lastRank.data);
  }

  async getArtistsByUsers(users: string[], selectedPeriod: LastFmPeriod) {
    const artistsByUsers: ArtistsByUsers = {};
    // await Promise.all(
    //   users.map(async (user) => {
    //     const charts = await this.getChartsByLastFmUser(user, selectedPeriod);
    //     artistsByUsers[user] = charts.topartists.artist
    //       .map(
    //         (artist: Artist) => ({
    //           name: artist.name,
    //           playcount: artist.playcount,
    //         })
    //       );
    //   })
    // );
    for (const user of users) {
      const charts = await this.getChartsByLastFmUser(user, selectedPeriod);

      artistsByUsers[user] = charts.topartists.artist.map(
        (artist: Artist) => ({
          name: artist.name,
          playcount: artist.playcount,
        })
      );
    }

    return artistsByUsers;
  }

  async getChartsByLastFmUser(user: string, period: LastFmPeriod) {
    try {
      const response = await axios.get(`${process.env.LASTFM_API}/?method=user.gettopartists&user=${user}&api_key=${process.env.LASTFM_KEY}&period=${period}&format=json`);
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      console.error('=== LASTFM ERROR ===');
      console.error('message:', error.message);
      console.error('code:', error.code);
      console.error('status:', error.response?.status);
      console.error('data:', error.response?.data);
      console.error('headers:', error.response?.headers);
      console.error('config:', {
        url: error.config?.url,
        params: error.config?.params,
      });
      console.error('===================');
      throw new InternalServerErrorException(`Ocorreu um erro ao acessar os dados do LastFM. Confira os dados do seu grupo ou tente novamente mais tarde!`);
    }
  }


  async generateImage(image: Express.Multer.File, dto: ImageDto) {

    const html = Template.generateHtml(image, dto);

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const buffer = await page.screenshot({ type: 'jpeg', quality: 90, fullPage: true });

    await browser.close();
    return buffer;
  }

}
