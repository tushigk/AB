import { siteUrl } from "@/config/site";
import { HttpRequest } from "@/utils/request";

const appHttpRequest = new HttpRequest(null, `${siteUrl}/articles`);

export const getArticles = async ({page,search,}: {page: number, search?: string, }) => {
  const res = await appHttpRequest.get("", {page,search});
  return res;
}

export const getCategories = async () => {
  const res = await appHttpRequest.get("-categories");
  return res;
}
export const getArticle = async (id: string) => {
  const res= await appHttpRequest.get(`/${id}`);
  return res;
}



