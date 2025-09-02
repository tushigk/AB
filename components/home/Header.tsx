"use client";
import {
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { authApi } from "@/apis";
import { IUser } from "@/models/user";
import { logout } from "@/store/auth-slice";
import { message } from "antd";
import { useDispatch } from "react-redux";
import Link from "next/link";

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const fetcher = async () => {
  const res = await authApi.me();
  return res;
};

export default function Header({ isSidebarOpen, toggleSidebar }: HeaderProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();

  const { data: user, error } = useSWR<IUser | null>("me", fetcher);

  const handleLogout = async () => {
    try {
      dispatch(logout());
      router.push("/");
    } catch (err) {
      message.error("Алдаа гарлаа");
    }
  };

  return (
    <header className="bg-background backdrop-blur-md border-foreground/20 p-3 md:p-4 sticky top-0 z-50 h-[90px]">
      <div className="max-w-full mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={toggleSidebar}
            className="text-primary hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-primary rounded-md p-1 transition"
            aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
          >
            {isSidebarOpen ? (
              <XMarkIcon className="w-7 h-7 md:w-8 md:h-8" />
            ) : (
              <Bars3Icon className="w-7 h-7 md:w-8 md:h-8" />
            )}
          </button>

          <Link href="/" className="flex items-center ml-5">
            <div className="flex items-center">
              {theme === "dark" ? (
                <img
                  src="/logodark.png"
                  alt="Logo Dark"
                  className="w-20 h-12 md:w-28 md:h-16"
                />
              ) : (
                <img
                  src="/logolight.png"
                  alt="Logo Light"
                  className="w-20 h-12 md:w-28 md:h-16"
                />
              )}
            </div>
          </Link>
        </div>

        <div className="relative hidden md:block w-64">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50" />
          <input
            type="text"
            placeholder="Хайх..."
            className="pl-10 pr-3 py-2 w-full bg-background border border-foreground/20 rounded-full text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {!user ? (
            <>
              <button
                onClick={() => router.push("/login")}
                className="flex items-center gap-1 border border-primary text-primary px-3 py-1.5 md:px-4 md:py-2 rounded-full text-sm md:text-base hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary transition"
              >
                <UserIcon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">Нэвтрэх</span>
              </button>

              <button
                onClick={() => router.push("/register")}
                className="bg-secondary text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-sm md:text-base hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary transition"
              >
                <span className="hidden sm:inline">Бүртгүүлэх</span>
                <span className="sm:hidden">+</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-sm md:text-base hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              >
                Гарах
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
