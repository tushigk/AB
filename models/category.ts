import { IImage } from "./image";

export type ICategory = Category;

export class Category implements ICategory {
  _id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  articleCount: number;
  dramaCount: number;
  type: "Drama" | "Article";
  image: IImage | null;

  constructor({ name, description, createdAt, updatedAt, articleCount, dramaCount, type, image, _id }: ICategory) {
    this._id = _id;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.articleCount = articleCount;
    this.dramaCount = dramaCount;
    this.type = type;
    this.image = image;
  }
}
