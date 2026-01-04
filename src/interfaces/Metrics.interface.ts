import type { Artist } from "./Artist.interface";

export interface Metrics {
  top1Listener: string;
  top2Listener: string;
  top3Listener: string;
  overallTopListener: {
    user: string,
    plays: number,
    percentage: number
  };
  newArtistsTopListeners: {
    user: string,
    artist: string
  }[]
}
