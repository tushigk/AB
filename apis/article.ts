import { siteUrl } from "@/config/site";
import { HttpRequest } from "@/utils/request";

const appHttpRequest = new HttpRequest(null, `${siteUrl}/article`);

export const getArticles = async ({page,search,}: {page: number, search?: string, }) => {
  const res = await appHttpRequest.get("", {page,search});
  return res;
}

export const getCategories = async () => {
  const res = await appHttpRequest.get("-categories");
  return res;
}
export const getArticleById = async (id: string) => {
  const res= await appHttpRequest.get(`/${id}`);
  return res;
}
export const purchaseArticle = async (articleId: string) => {
  const res = await appHttpRequest.post("/purchase", { articleId });
  return res; 
};


