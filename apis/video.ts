import { siteUrl } from "@/config/site";
import { HttpRequest } from "@/utils/request";

const appHttpRequest = new HttpRequest(null, `${siteUrl}/drama`);

export const getDramas = async ({page, search}: {page: number, search?: string}) => {
  const res = await appHttpRequest.get("", {page, search});
  return res;
}
export const getCategoryDramas = async () => {
  const res = await appHttpRequest.get("-category");
  return res;
}

export const getDrama = async ({id}: {id: string}) => {
  const res = await appHttpRequest.get(`/${id}`);
  return res;
}
export const getDramaEpisodeUrl = async ({m3u8Key}: {m3u8Key: string}) => {
  const res = await appHttpRequest.get("-signed-url", {m3u8Key});
  return res;
}
