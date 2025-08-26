// import { ILoginForm } from "@/app/(public)/login/login-form";
import { siteUrl } from "@/config/site";
import { store } from "@/store";
import { authMe, setToken } from "@/store/auth-slice";
import { HttpRequest } from "@/utils/request";

const appHttpRequest = new HttpRequest(null, siteUrl);

export const login = async (data: any) => {
  const res = await appHttpRequest.post("/auth/login", data);
  store.dispatch(setToken(res));
  return res;
};

export const register = async (data: any) => {
  const res = await appHttpRequest.post("/auth/register", data);
  store.dispatch(setToken(res));
  return res;
};

export const me = async () => {
  try {
    const res = await appHttpRequest.get("/auth/me");
    store.dispatch(authMe(res)); 
    return res?.user || res; 
  } catch (err) {
    throw err;
  }
};