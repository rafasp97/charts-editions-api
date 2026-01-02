import { Artist } from "src/interfaces/Artist.interface";
import { FireBaseData } from "src/interfaces/FireBaseData.inferface";

export class Helper {
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
      const index = !isNew ? currentIndex + 1 : null;
      return {
        ...artist,
        index,
        new: isNew
      }
    })
  }
}
