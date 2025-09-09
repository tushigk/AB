"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import VideoEpisodes from "@/components/home/VideoEpisodes";
import { dramaApi } from "@/apis";
import { Video } from "@/components/home/types";

interface DramaEpisode {
  _id: string;
  episodeNumber: number;
  thumbnailUrl: string;
  m3u8Key: string;
  videoKey: string;
  episodeToken: number;
}

interface DramaResponse {
  _id: string;
  title: string;
  description: string;
  dramaEpisodes: DramaEpisode[];
  totalEpisodes: number;
  freeEpisodes: number[];
  episodeToken: number;
  dramaToken: number;
  image?: { url: string };
}

export default function VideoDetailPage() {
  const { id } = useParams();

  const { data, isLoading, error } = useSWR<DramaResponse>(
    id ? `swr.drama.detail.${id}` : null,
    async () => await dramaApi.getDrama({ id: String(id) }),
    { revalidateOnFocus: false }
  );

  if (isLoading) return <p className="p-6">⏳ Уншиж байна...</p>;
  if (error || !data) return <p className="p-6">❌ Алдаа гарлаа</p>;

  const video: Video = {
  _id: data._id,
  title: data.title,
  description: data.description,
  thumbnail: data.image?.url || "/placeholder.jpg",
  dramaEpisodes: data.dramaEpisodes.map((ep) => ({
    _id: ep._id,
    episodeNumber: ep.episodeNumber,
    thumbnailUrl: ep.thumbnailUrl || data.image?.url || "/placeholder.jpg",
    m3u8Key: ep.m3u8Key,
    videoKey: ep.videoKey,
    episodeToken: data.episodeToken,
  })),
  totalEpisodes: data.totalEpisodes,
  episodeToken: data.episodeToken,
  freeEpisodes: Array.isArray(data.freeEpisodes)
    ? data.freeEpisodes
    : Array.from({ length: data.freeEpisodes }, (_, i) => i + 1),
  episodePrices: Array.from({ length: data.totalEpisodes }, () => data.episodeToken).reduce(
    (acc, price, index) => {
      acc[index + 1] = price;
      return acc;
    },
    {} as { [episode: number]: number }
  ),
  dramaToken: data.dramaToken,
};

// const video: Video = {
//   _id: data._id,
//   title: data.title,
//   description: data.description,
//   thumbnail: data.image?.url || "/placeholder.jpg",
//   dramaEpisodes: Array.from({ length: data.totalEpisodes }, (_, i) => {
//     const ep = data.dramaEpisodes[i];
//     return ep
//       ? {
//           _id: ep._id,
//           episodeNumber: ep.episodeNumber,
//           thumbnailUrl: ep.thumbnailUrl || data.image?.url || "/placeholder.jpg",
//           m3u8Key: ep.m3u8Key,
//           videoKey: ep.videoKey,
//           episodeToken: data.episodeToken,

//         }
//       : {
//           _id: `placeholder-${i + 1}`,
//           episodeNumber: i + 1,
//           thumbnailUrl: data.image?.url || "/placeholder.jpg",
//           m3u8Key: "",
//           videoKey: "",
//           episodeToken: data.episodeToken,
//         };
//   }),
//   totalEpisodes: data.totalEpisodes,
//   episodeToken: data.episodeToken,
//   freeEpisodes: Array.isArray(data.freeEpisodes)
//     ? data.freeEpisodes
//     : Array.from({ length: data.freeEpisodes }, (_, i) => i + 1),
//   episodePrices: Array.from({ length: data.totalEpisodes }, () => data.episodeToken).reduce(
//     (acc, price, index) => {
//       acc[index + 1] = price;
//       return acc;
//     },
//     {} as { [episode: number]: number }
//   ),
//   dramaToken: data.dramaToken,
// };



  return (
    <div className="md:max-w-4/5  mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-6">{video.title}</h1>
      <p className="text-gray-600 mb-6">{video.description}</p>

      <VideoEpisodes video={video} />
    </div>
  );
}
