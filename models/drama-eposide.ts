import { IDrama } from "./drama";

export type IDramaEpisode = DramaEpisode;

export class DramaEpisode implements IDramaEpisode {
  _id: string;
  drama: IDrama;
  episodeNumber: number;
  title: string;
  body: string;
  thumbnailUrl: string;
  videoKey: string;
  m3u8Key: string;

  constructor({ title, drama, episodeNumber, body, thumbnailUrl, videoKey, m3u8Key, _id }: IDramaEpisode) {
    this.title = title;
    this.drama = drama;
    this.episodeNumber = episodeNumber;
    this.body = body;
    this.thumbnailUrl = thumbnailUrl;
    this.videoKey = videoKey;
    this.m3u8Key = m3u8Key;
    this._id = _id;
  }
}
