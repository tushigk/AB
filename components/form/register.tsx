"use client";

import React, { useState } from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import useSWR from "swr";
import { getPrivacy } from "@/apis/privacy";
import { X } from "lucide-react";

export type IRegisterForm = {
  username: string;
  password: string;
  email: string;
  cPassword: string;
};

type Props = {
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  control: Control<IRegisterForm>;
  errors: FieldErrors<IRegisterForm>;
  loading: boolean;
};

const fetcher = () => getPrivacy();

export function RegisterForm({ onSubmit, control, errors, loading }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: privacy, error } = useSWR("/privacy", fetcher);

  return (
    <>
      <form className="flex flex-col gap-4">
        {/* Username */}
        <div>
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Нэвтрэх нэр"
                className="w-full bg-[#262636] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            )}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username.message as string}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="email"
                placeholder="И-мэйл"
                className="w-full bg-[#262636] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            )}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message as string}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type={showPassword ? "text" : "password"}
                placeholder="Нууц үг"
                className="w-full bg-[#262636] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            )}
          />
          <button
            type="button"
            className="absolute right-3 top-2.5 text-gray-400"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message as string}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <Controller
            name="cPassword"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type={showPassword ? "text" : "password"}
                placeholder="Нууц үг давтах"
                className="w-full bg-[#262636] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            )}
          />
          {errors.cPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.cPassword.message as string}
            </p>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-300">
          <input
            type="checkbox"
            className="accent-purple-500"
            disabled={!privacy}
          />
          <span
            className="text-purple-400 hover:underline cursor-pointer"
            onClick={() => setModalOpen(true)}
          >
            Үйлчилгээний нөхцөл
          </span>{" "}
          зөвшөөрөх
        </label>

        <button
          type="submit"
          onClick={onSubmit}
          disabled={loading}
          className="w-full py-2 bg-primary hover:bg-secondary rounded-lg text-white font-medium transition disabled:opacity-50"
        >
          {loading ? "Бүртгүүлж байна..." : "Бүртгүүлэх"}
        </button>
      </form>

      {modalOpen && privacy && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-[#1E1E2A] p-6 rounded-lg max-w-1/2 w-full relative max-h-[80vh] overflow-y-auto">
            <button
              className="absolute top-3 right-3 text-gray-400"
              onClick={() => setModalOpen(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold text-white mb-4">
              Үйлчилгээний нөхцөл
            </h2>
            <div
              className="text-gray-300"
              dangerouslySetInnerHTML={{ __html: privacy.content }}
            />
            {privacy.link && (
              <a
                href={privacy.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:underline mt-2 block"
              >
                дэлгэрэнгүй
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}
