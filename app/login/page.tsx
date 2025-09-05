"use client";
import { authApi } from "@/apis";
import { ILoginForm, LoginForm } from "@/components/form/login";
import { handleApiError } from "@/utils/handle-api-error";
import { message } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useSWR, { mutate } from "swr";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ILoginForm>({
    defaultValues: {
      username: "tushig",
      password: "Tushig123",
    },
  });

  const onSubmit = async (data: ILoginForm) => {
    setLoading(true);
    try {
      const res = await authApi.login(data);

      await mutate("userMe", async () => {
        return await authApi.me(); 
      }, false);

      message.success("Амжилттай нэвтэрлээ.");
      router.push("/"); 
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex bg-[#1a1a25] text-white">
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-primary to-secondary items-center justify-center">
        <h2 className="text-4xl font-bold">Тавтай морил!</h2>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md p-8">
          <h1 className="text-3xl font-semibold mb-2">Нэвтрэх</h1>
          <p className="text-sm text-gray-400 mb-6">
            Бүртгэл байхгүй бол?{" "}
            <a href="/register" className="text-primary hover:underline">
              Бүртгүүлэх
            </a>
          </p>

          <LoginForm
            onSubmit={handleSubmit(onSubmit)}
            control={control}
            errors={errors}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
