import { siteUrl } from "@/config/site";
import { HttpRequest } from "@/utils/request";

const appHttpRequest = new HttpRequest(null, `${siteUrl}/chat`);

export const getMyChats = async () => {
  const res = await appHttpRequest.get("/my");
  return res;
}
