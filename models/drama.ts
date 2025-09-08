import { ICategory } from "./category";
import { IDramaEpisode } from "./drama-eposide";
import { IImage } from "./image";
import { IUser } from "./user";

export type IDrama = Drama;

export class Drama implements IDrama {
  _id: string;
  title: string;
  description: string;
  totalEpisodes: number;
  freeEpisodes: number; 
  createdBy:IUser;
  image: IImage;
  dramaEpisodes: IDramaEpisode[];
  category: ICategory;
  videoUrls?: { [episode: number]: string };

  episodePrices?: Record<number, number>; 

  constructor({ title, totalEpisodes, freeEpisodes, createdBy, description,image, dramaEpisodes, category,_id }: IDrama) {
    this._id = _id;
    this.title = title;
    this.totalEpisodes = totalEpisodes;
    this.freeEpisodes = freeEpisodes;
    this.createdBy = createdBy;
    this.description = description;
    this.image = image;
    this.dramaEpisodes = dramaEpisodes;
    this.category = category;
  }
}
