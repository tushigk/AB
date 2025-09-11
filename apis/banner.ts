import { siteUrl } from "@/config/site";
import { HttpRequest } from "@/utils/request";

const appHttpRequest = new HttpRequest(null, `${siteUrl}/banner`);

export const getBanners = async () => {
  const res = await appHttpRequest.get("");
  return res;
}