import { Artist } from "./Artist.interface";

export interface ArtistsByUsers {
  [user: string]: Artist[];
}
