import { siteUrl } from "@/config/site";
import { HttpRequest } from "@/utils/request";

const appHttpRequest = new HttpRequest(null, `${siteUrl}/qpay`);

export const onPayment = async (tokens: number) => {
  const res = await appHttpRequest.post("/invoice", {tokens});
  return res;
}

export const getPaymentStatus = async (invoiceId: string) => {
  const res = await appHttpRequest.get(`/status/${invoiceId}`);
  return res;
};
