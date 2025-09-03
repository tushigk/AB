import { siteUrl } from "@/config/site";
import { HttpRequest } from "@/utils/request";

const appHttpRequest = new HttpRequest(null, `${siteUrl}/category`);

export const getCategorys = async ({type,}: {type: string, }) => {
  const res = await appHttpRequest.get("", {type});
  return res;
}