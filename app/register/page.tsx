"use client";
import { authApi } from "@/apis";
import { IRegisterForm, RegisterForm } from "@/components/form/register";
import { message } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { mutate } from "swr";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<IRegisterForm>({
    defaultValues: {
      username: "",
      password: "",
      email: "",
    },
  });

  const onSubmit = async (data: IRegisterForm) => {
    setLoading(true);
    try {
      await authApi.register(data);

      await mutate("userMe", async () => {
        return await authApi.me();
      }, false);

      message.success("Амжилттай бүртгэгдлээ.");
      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        message.error(err.message);
      } else if (typeof err === "object" && err && "error" in err) {
        message.error((err as { error?: { message?: string } }).error?.message || "Алдаа гарлаа");
      } else {
        message.error("Алдаа гарлаа");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex bg-[#1a1a25] text-white">
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-primary to-secondary items-center justify-center">
        <h2 className="text-4xl font-bold">Бидэнтэй нэгдээрэй!</h2>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md p-8">
          <h1 className="text-3xl font-semibold mb-2">Бүртгүүлэх</h1>
          <p className="text-sm text-gray-400 mb-6">
            Бүртгэлтэй юу?{" "}
            <a href="/login" className="text-primary hover:underline">
              Нэвтрэх
            </a>
          </p>

          <RegisterForm
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
