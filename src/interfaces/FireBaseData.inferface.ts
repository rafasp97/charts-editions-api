import type { Artist } from "./Artist.interface";

export interface FireBaseData {
  lastDate: Date;
  createdAt: Date;
  data: Artist[];
}
