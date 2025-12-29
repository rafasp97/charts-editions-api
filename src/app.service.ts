import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { LastFmPeriod } from './enums/LastFmPeriod.enum';
import axios from 'axios';
import { Artist } from './interfaces/Artist';
import { FireBaseService } from './firebase.service';
import { StandardUsers } from './utils/standardUsers';
import { ChartsDto } from './dto/charts.dto';
import * as dotenv from 'dotenv';

dotenv.config();


@Injectable()
export class AppService {
  constructor(
    private readonly fireBaseService: FireBaseService
  ) {}

  getCharts(group: string, chartsDto: ChartsDto) {
    if(!group && !chartsDto) {
      throw new BadRequestException(
        'Deve ser selecionado um grupo ou enviar os usuários',
      );
    }
    const users = group ?  StandardUsers.getUsersByGroup(group) : chartsDto.users;
    const period = group ? LastFmPeriod.SevenDays : chartsDto.period;
    return this.getRank(users, period, group);
  }

  async getRank(users: string[], selectedPeriod: LastFmPeriod, group: string) {
    const artists: Artist[] = await this.getArtists(users, selectedPeriod)
    const noRepeat = this.noRepeat(artists);
    const rank = this.generateRank(noRepeat, group);
    return rank;
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

  noRepeat(artists: Artist[]) {
    const data: { [name: string]: number } = {};

    for (const artist of artists) {
      const name = artist.name;
      const playcount = parseInt(String(artist.playcount));

      if (!data[name]) data[name] = playcount;
      else data[name] += playcount;

    }
    return Object.entries(data).map(([name, playcount]) => ({
      name,
      playcount
    }));
  }

  async generateRank(artists: Artist[], group: string) {
    const rank = artists.sort((a: Artist, b: Artist) => b.playcount - a.playcount).slice(0, 10);
    if(!group) return rank;
    return this.generateRankByGroup(rank, group);
  }

  async generateRankByGroup(rank: Artist[], group: string) {
    const lastRank = await this.fireBaseService.getLastRankByGroup(group);

    const now = new Date();
    const diffMs = now.getTime() - lastRank.lastDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if(diffDays > 7) {
      await this.fireBaseService.registerNewRank(rank, group);
    }
    return this.addIndexByLastRank(rank, lastRank.data);
  }

  async addIndexByLastRank(rank: Artist[], lastRank: Artist[]) {
    return rank.map((artist: Artist, currentIndex) => {
      const lastIndex = lastRank.findIndex(artistInLastRank => artistInLastRank.name == artist.name);
      const isNew = lastIndex === -1;
      const index = !isNew ? currentIndex + 1 : null;
      return {
        ...artist,
        index,
        new: isNew
      }
    })
  }
}
