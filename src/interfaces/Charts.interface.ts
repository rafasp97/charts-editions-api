import { Artist } from "./Artist.interface";
import { Metrics } from "./Metrics.interface";

export interface Charts {
  rank: Artist[];
  metrics?: Metrics;
  period?: {
    start: string,
    end: string
  }
}
