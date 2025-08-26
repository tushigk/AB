"use client";
import { useState } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { LoginModal, SignupModal } from "./Modals";
import { useTheme } from "@/context/ThemeContext";

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function Header({ isSidebarOpen, toggleSidebar }: HeaderProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <>
      <header className="bg-background backdrop-blur-md border-foreground/20 p-3 md:p-4 sticky top-0 z-50">
        <div className="max-w-full mx-auto flex justify-between items-center">
          {/* Left side: Menu + Logo */}
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

            <div className="flex items-center">
              {theme === "dark" ? (
                <img
                  src="/logo2.png"
                  alt="Logo Dark"
                  className="w-20 h-12 md:w-28 md:h-16"
                />
              ) : (
                <img
                  src="/logo.png"
                  alt="Logo Light"
                  className="w-20 h-12 md:w-28 md:h-16"
                />
              )}
            </div>
          </div>

          {/* Search bar (desktop only) */}
          <div className="relative hidden md:block w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50" />
            <input
              type="text"
              placeholder="Хайх..."
              className="pl-10 pr-3 py-2 w-full bg-background border border-foreground/20 rounded-full text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>

          {/* Right side: Auth buttons */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Mobile: search icon */}
            <button className="md:hidden p-2 rounded-full hover:bg-foreground/10">
              <MagnifyingGlassIcon className="w-6 h-6 text-foreground" />
            </button>

            {/* Login */}
            <button
              onClick={() => setIsLoginOpen(true)}
              className="flex items-center gap-1 border border-primary text-primary px-3 py-1.5 md:px-4 md:py-2 rounded-full text-sm md:text-base hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary transition"
            >
              <UserIcon className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Нэвтрэх</span>
            </button>

            {/* Signup */}
            <button
              onClick={() => setIsSignupOpen(true)}
              className="bg-secondary text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-sm md:text-base hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary transition"
            >
              <span className="hidden sm:inline">Бүртгүүлэх</span>
              <span className="sm:hidden">+</span>
            </button>
          </div>
        </div>
      </header>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
    </>
  );
}
