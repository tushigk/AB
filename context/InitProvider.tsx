"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";
import { logout } from "@/store/auth-slice";
import { userApi } from "@/apis";
import { RootState } from "@/store";

interface Props {
  children: React.ReactNode;
}

// define Context
export const InitContext = createContext({});

export default function InitProvider({ children }: Props) {
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);
  const { push } = useRouter();
  const pathname = usePathname();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const { data, error } = useSWR(
    token ? `swr.user.${token}` : null,
    async () => {
      const resMe = await userApi.me();
      return {
        resMe,
      };
    },
    {
      revalidateOnFocus: false,
      onError: (err: any) => {
        if (err.statusCode === 401) {
          dispatch(logout());
          push("/login");
        }
        return err;
      },
    },
  );

  // define State
  const state = {};

  // define Function
  const func = {};

  // define Context
  const context = { state, func, user };

  useEffect(() => {
    setIsClient(true);
  }, []);

useEffect(() => {
  if (!token && pathname !== "/login" && pathname !== "/register") {
  }
}, [token, pathname, push]);


  if (error) {
    return <div>Something went wrong</div>;
  }



  return <InitContext.Provider value={context}>{children}</InitContext.Provider>;

}
