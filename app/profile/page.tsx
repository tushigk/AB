"use client";

import { motion } from "framer-motion";
import useSWR from "swr";
import { authApi } from "@/apis"; 

const fetcher = async () => {
  const res = await authApi.me();
  return res;
};

export default function ProfilePage() {
  const { data, error, isLoading } = useSWR("me", fetcher);

  if (isLoading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">Failed to load user</p>;

  return (
    <div className="h-screen bg-white flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full bg-gradient-to-r from-primary to-secondary overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center h-full p-6 md:p-12">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex-1 mt-8 md:mt-0 md:ml-12 text-white text-center md:text-left"
          >
            <h2 className="text-2xl md:text-3xl font-bold">
              Хэрэглэгч! <br /> {data?.username || "name"}
            </h2>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex justify-center md:justify-start gap-8 mt-6"
            >
              <div>
                <p className="text-xl font-bold">{data?.tokens || 0}</p>
                <p className="text-sm text-gray-200">Токен</p>
              </div>
              <div>
                <p className="text-xl font-bold">{data?.userRequestCount || 0}</p>
                <p className="text-sm text-gray-200">Авсан тест</p>
              </div>
              <div>
                <p className="text-xl font-bold">{data?.doctorAnsweredUserCount || 0}</p>
                <p className="text-sm text-gray-200">Авсан мэдээ</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
