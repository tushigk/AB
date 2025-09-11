"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Film,
  FileText,
  HelpCircle,
  User,
  Wallet2,
  Moon,
  Sun,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { authApi } from "@/apis";
import useSWR from "swr";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { logout } from "@/store/auth-slice";
import { message } from "antd";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const fetchUser = async () => await authApi.me();
  const { data: user, mutate } = useSWR("userMe", fetchUser);

  const navItems = [
    { href: "/videos", icon: Film, label: "Бичлэг" },
    { href: "/articles", icon: FileText, label: "Мэдээ" },
    { href: "/quizzes", icon: HelpCircle, label: "Судалгааны тест" },
    { href: "/token", icon: Wallet2, label: "Токен" },
  ];

  const handleLogout = async () => {
    try {
      dispatch(logout());
      router.push("/");
      await mutate(null, false);
    } catch (err) {
      message.error("Алдаа гарлаа");
    }
  };

  return (
    <header className="w-full bg-background/70 backdrop-blur-lg shadow-sm sticky top-0 z-50">
      <div className="max-w-full mx-auto flex items-center justify-between px-8 py-3 relative">
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <motion.img
              src={theme === "light" ? "/logolight.png" : "/logodark.png"}
              alt="Logo"
              className="w-10 md:w-28"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </Link>
        </div>

        <nav className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <span
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[16px] font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-white shadow-md"
                      : "text-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4 ml-auto">
          {user ? (
            <div className="relative hidden md:flex items-center gap-7">
              <p className="text-[16px] font-medium text-foreground">
                Таны токен: {user.tokens || 0} 🪙
              </p>

              <button
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white"
              >
                <User className="w-5 h-5 cursor-pointer" />
              </button>

              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-12 w-40 bg-background border border-foreground/10 rounded-xl shadow-lg py-2"
                  >
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-primary/10 cursor-pointer"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <User className="w-4 h-4 cursor-pointer" /> Профайл
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-red-100 text-red-600 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 cursor-pointer" /> Гарах
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden md:block px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium"
            >
              Нэвтрэх
            </Link>
          )}

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition cursor-pointer"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          <button
            className="md:hidden p-2 rounded-lg bg-primary text-white"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-background border-t border-foreground/10 shadow-lg px-4 py-4 space-y-3"
          >
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-white shadow-md"
                        : "text-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </span>
                </Link>
              );
            })}

            {user ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-primary/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5" /> Профайл
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-red-100 text-red-600"
                >
                  <LogOut className="w-5 h-5" /> Гарах
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Нэвтрэх
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
