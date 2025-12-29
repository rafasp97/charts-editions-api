import type { Artist } from "./Artist";

export interface FireBaseData {
  id: string;
  groupId: string;
  createdAt: Date;
  rank: Artist[];
}
