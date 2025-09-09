import React, { useState } from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/solid";

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

export function RegisterForm({ onSubmit, control, errors, loading }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);

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
            <p className="text-red-500 text-sm mt-1">{errors.username.message as string}</p>
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
            <p className="text-red-500 text-sm mt-1">{errors.email.message as string}</p>
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
            <p className="text-red-500 text-sm mt-1">{errors.password.message as string}</p>
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
            <p className="text-red-500 text-sm mt-1">{errors.cPassword.message as string}</p>
          )}
        </div>

        {/* Terms */}
        <label className="flex items-center gap-2 text-sm text-gray-300">
          <input
            type="checkbox"
            className="accent-purple-500"
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
          />
          Би <button type="button" className="text-purple-400 hover:underline" onClick={() => setTermsOpen(true)}>
            үйлчилгээний нөхцлийг
          </button>{" "}
          зөвшөөрч байна
        </label>

        {/* Submit */}
        <button
          type="submit"
          onClick={onSubmit}
          disabled={loading || !agreed}
          className="w-full py-2 bg-primary hover:bg-secondary rounded-lg text-white font-medium transition disabled:opacity-50"
        >
          {loading ? "Бүртгүүлж байна..." : "Бүртгүүлэх"}
        </button>
      </form>

      {/* Terms Modal */}
      <AnimatePresence>
        {termsOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-3xl w-full shadow-2xl max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  Үйлчилгээний нөхцөл
                </h3>
                <button onClick={() => setTermsOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="prose dark:prose-invert text-gray-700 dark:text-gray-300">
                <p>
                  Энэхүү үйлчилгээний нөхцөл нь таны болон манай компаний хоорондын эрх, үүргийг тодорхойлж, үйлчилгээг хэрхэн ашиглах талаар заасан болно.
                </p>
                <h2>1. Нийтлэг нөхцөл</h2>
                <p>
                  Үйлчилгээ ашиглахад танд тодорхой шаардлага, хязгаарлалт байх бөгөөд та эдгээрийг дагаж мөрдөх ёстой.
                </p>
                <h2>2. Хувийн мэдээлэл</h2>
                <p>
                  Таны мэдээллийг зөвшөөрөлтэйгээр цуглуулж, хамгаалах болно. Мэдээллийг гуравдагч этгээдэд зарим нөхцөлд шилжүүлэх боломжтой.
                </p>
                <h2>3. Хариуцлага</h2>
                <p>
                  Үйлчилгээний доголдол, алдаанаас үүдэн учирсан аливаа хохиролд манай компани хариуцлага хүлээхгүй.
                </p>
                <h2>4. Үйлчилгээний өөрчлөлт</h2>
                <p>
                  Манай компани үйлчилгээний нөхцөлийг урьдчилан мэдэгдэлгүйгээр өөрчлөх эрхтэй.
                </p>
                <h2>5. Холбоо барих</h2>
                <p>
                  Хэрэв танд асуулт байвал бидэнтэй холбоо барихыг зөвлөж байна.
                </p>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setTermsOpen(false)}
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
                >
                  Хаах
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
