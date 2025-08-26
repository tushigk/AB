import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";

export type IRegisterForm = {
  username: string;
  password: string;
  email: string;
  cPassword: string;
};

type Props = {
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  control: any;
  errors: any;
  loading: boolean;
};

export function RegisterForm({ onSubmit, control, errors, loading }: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="flex flex-col gap-4">
      <div className="flex gap-4">
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
      </div>

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
      </div>

      <div className="relative">
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
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-300">
        <input type="checkbox" className="accent-purple-500" />
        Үйлчилгээний нөхцөл{" "}
        <a href="#" className="text-purple-400 hover:underline">
          зөвшөөрөх
        </a>
      </label>

      <button
        type="submit"
        onClick={onSubmit}
        className="w-full py-2 bg-primary hover:bg-secondary rounded-lg text-white font-medium transition"
      >
        Бүртгүүлэх
      </button>
    </form>
  );
}
