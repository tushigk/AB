import { siteUrl } from "@/config/site";
import { store } from "@/store";
import { authMe } from "@/store/auth-slice";
import { HttpRequest } from "@/utils/request";

const appHttpRequest = new HttpRequest(null, `${siteUrl}/users`);

export const getUsers = async ({page,search,payment}: {page: number, search?: string, payment?: string}) => {
  const res = await appHttpRequest.get("", {page,search, payment});
  return res;
}

export const editUser = async (data:any, id: string) => {
  const res = await appHttpRequest.put("/" +id, data);
  return res
}

export const deleteUser = async (id: string) => {
  const res = await appHttpRequest.del("/" + id);
  return res;
}

export const me = async () => {
  try {
    const res = await appHttpRequest.get("/me");
    store.dispatch(authMe(res)); 
    return res?.user || res; 
  } catch (err) {
    throw err;
  }
};
export const me2 = async () => {
  try {
    const res = await appHttpRequest.get("/me");
    return res?.user || res; 
  } catch (err) {
    throw err;
  }
};

