import { LastFmPeriod } from "src/enums/LastFmPeriod.enum";
import { Artist } from "src/interfaces/Artist.interface";
import { ArtistsByUsers } from "src/interfaces/ArtistsByUsers.interface";
import { FireBaseData } from "src/interfaces/FireBaseData.inferface";
import { Metrics } from "src/interfaces/Metrics.interface";

export class Helper {

  static generateRank(artists: Artist[]): Artist[] {
    return this.sortRank(
      this.noRepeat(artists)
    );
  }

  static noRepeat(artists: Artist[]) {
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

  static sortRank(artists: Artist[]) {
    return artists.sort((a: Artist, b: Artist) => b.playcount - a.playcount).slice(0, 10);
  }

  static calculateDiffDays(lastRank: FireBaseData) {
    const now = new Date();
    const diffMs = now.getTime() - lastRank.lastDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays;
  }

  static addIndexByLastRank(rank: Artist[], lastRank: Artist[]) {
    return rank.map((artist: Artist, currentIndex) => {
      const lastIndex = lastRank.findIndex(artistInLastRank => artistInLastRank.name == artist.name);
      const isNew = lastIndex === -1;
      const index = !isNew ? lastIndex - currentIndex : null;
      return {
        ...artist,
        index,
        new: isNew
      }
    })
  }

  static getMetrics(rank: Artist[], artistsByUsers: ArtistsByUsers): Metrics {
    return {
      top1Listener: this.getTopListener(rank[0].name, artistsByUsers),
      top2Listener: this.getTopListener(rank[1].name, artistsByUsers),
      top3Listener: this.getTopListener(rank[2].name, artistsByUsers),
      overallTopListener: this.getOverallTopListener(artistsByUsers),
      newArtistsTopListeners: this.getNewArtistsTopListeners(rank, artistsByUsers)
    }
  }

  static getPeriod(period: LastFmPeriod) {
    if (period == LastFmPeriod.OneMonth) return;
    const end = new Date();
    const start = new Date(end);

    start.setDate(end.getDate() - this.periodInDays[period]);

    return {
      start: this.formatDate(start),
      end: this.formatDate(end)
    };
  }

  static periodInDays = {
    '7day': 7,
    '1month': 30,
    '3month': 90,
    '6month': 180,
    '12month': 365
  }

  static formatDate (date: Date) {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long'
    });
  }


  static getNewArtistsTopListeners(rank: Artist[], artistsByUsers: ArtistsByUsers) {
    const newArtists = rank.filter(artist => artist.new);
    return newArtists.map(artist => {
      const topUser = this.getTopListener(artist.name, artistsByUsers);
      return {
        user: topUser,
        artist: artist.name
      };
    });
  }

  static getTopListener(topArtist: string, artistsByUsers: ArtistsByUsers): string {
    let topUser: string = '';
    let maxPlays = 0;

    for (const user in artistsByUsers) {
      const artist = artistsByUsers[user].find(artist => artist.name === topArtist);
      if (artist) {
        const plays = Number(artist.playcount);
        if (plays > maxPlays) {
          topUser = user;
          maxPlays = plays;
        }
      }
    }
    return topUser;
  }

  static getOverallTopListener(artistsByUsers: ArtistsByUsers) {
    let topUser: string = '';
    let plays = 0;
    let totalPlays = 0;

    for (const user in artistsByUsers) {
      const playsByUser = artistsByUsers[user].reduce((total, artist) => total + Number(artist.playcount), 0);

      totalPlays += playsByUser;

      if (playsByUser > plays) {
        topUser = user;
        plays = playsByUser;
      }

    }

    return {
      user: topUser,
      plays,
      percentage: Math.round((plays / totalPlays) * 100)
    };
  }




}
