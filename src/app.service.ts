import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { LastFmPeriod } from './enums/LastFmPeriod.enum';
import axios from 'axios';
import { Artist } from './interfaces/Artist.interface';
import { FireBaseService } from './firebase.service';
import { StandardUsers } from './utils/standardUsers.utils';
import { ChartsDto } from './dto/charts.dto';
import { Helper } from './utils/helper.utils';
import * as dotenv from 'dotenv';

dotenv.config();


@Injectable()
export class AppService {
  constructor(
    private readonly fireBaseService: FireBaseService
  ) { }

  getCharts(group: string, chartsDto: ChartsDto) {
    if (!group && !chartsDto) {
      throw new BadRequestException(
        'Deve ser selecionado um grupo ou enviar os usuários',
      );
    }
    const users = group ? StandardUsers.getUsersByGroup(group) : chartsDto.users;
    const period = group ? LastFmPeriod.SevenDays : chartsDto.period;
    return this.generateRank(users, period, group);
  }

  async generateRank(users: string[], selectedPeriod: LastFmPeriod, group: string) {
    const artists: Artist[] = await this.getArtists(users, selectedPeriod)
    const noRepeat = Helper.noRepeat(artists);
    const rank = Helper.sortRank(noRepeat);
    if (!group) return rank;
    return this.generateRankByGroup(rank, group);
  }

  async getArtists(users: string[], selectedPeriod: LastFmPeriod) {
    const artists: Artist[] = [];
    await Promise.all(
      users.map(async (user) => {
        const charts = await this.getChartsByLastFmUser(user, selectedPeriod);
        charts.topartists.artist.forEach((artist: Artist) => {
          artists.push({
            name: artist.name,
            playcount: artist.playcount,
          });
        });
      })
    );
    return artists;
  }

  async getChartsByLastFmUser(user: string, period: LastFmPeriod) {
    try {
      const response = await axios.post(`https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${user}&api_key=${process.env.LASTFM_KEY}&period=${period}&format=json`);
      return response.data;
    } catch (error) {
      console.log(`Erro: ${error}`);
      throw new InternalServerErrorException(`Ocorreu um erro ao acessar os dados do LastFM. Confira os usuários cadastrados no seu grupo!`);
    }
  }

  async generateRankByGroup(rank: Artist[], group: string) {
    const lastRank = await this.fireBaseService.getLastRankByGroup(group);
    const diffDays = Helper.calculateDiffDays(lastRank);
    if (diffDays > 7) await this.fireBaseService.registerNewRank(rank, group);
    return Helper.addIndexByLastRank(rank, lastRank.data);
  }

}
