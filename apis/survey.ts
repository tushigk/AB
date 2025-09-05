import { siteUrl } from "@/config/site";
import { HttpRequest } from "@/utils/request";

const appHttpRequest = new HttpRequest(null, `${siteUrl}/survey`);

export const getSurveys = async ({page,search,}: {page: number, search?: string, }) => {
  const res = await appHttpRequest.get("", {page,search});
  return res;
}

export const getSurvey = async (id: string) => {
  const res= await appHttpRequest.get(`/${id}`);
  return res;
}

export const purchaseSurvey = async (surveyId: string) => {
  const res = await appHttpRequest.post("/purchase", { surveyId });
  return res; 
};

export const getUserSubmissions = async ({ page }: { page: number }) => {
  const res = await appHttpRequest.get("/submissions", { page });
  return res;
}