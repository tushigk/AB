import { logout } from "@/store/auth-slice";
import { store } from "../store";
import HttpHandler from "./http/http-handler";
import { HttpRequest as BaseHttpRequest } from "./http/http-request";

export class HttpRequest extends BaseHttpRequest {
  store = store;
  errorHandler = (statusCode: number, error: HttpHandler): HttpHandler => {
    const ua =
      typeof window === "undefined"
        ? (globalThis as any)?.["user-agent"]
        : navigator.userAgent;
    const isCrawler = /facebookexternalhit|Facebot|Twitterbot/i.test(ua || "");
    if (statusCode === 401) {
      store.dispatch(logout());
    }
    throw error as any;
  };
}
