import { siteUrl } from "@/config/site";
import { HttpRequest } from "@/utils/request";

const appHttpRequest = new HttpRequest(null, `${siteUrl}/privacy`);

export const  getPrivacy = async () => {
  const res = await appHttpRequest.get("/", );
  return res;
};


