"use client";
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { XMarkIcon, FilmIcon, DocumentTextIcon, QuestionMarkCircleIcon, UserIcon, SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import { useTheme } from '../../context/ThemeContext';
import { Wallet2 } from 'lucide-react';

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isSidebarOpen, toggleSidebar }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        toggleSidebar();
      }
    };
    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen, toggleSidebar]);

  return (
    <div className={`fixed inset-0 z-20 flex ${isSidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div
        className={`fixed inset-0 bg-black/50 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0'
        }`}
      ></div>

      <div
        ref={sidebarRef}
        className={`relative h-full w-72 md:w-80 dark:bg-background border-r border-foreground/20 dark:background/90 dark:text-foreground transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out z-30`}
      >
        <div className="p-6 flex flex-col h-full">
          <nav className="flex flex-col space-y-4 flex-grow mt-[25%]">
            {[
              { href: '/videos', icon: FilmIcon, label: 'Бичлэг' },
              { href: '/articles', icon: DocumentTextIcon, label: 'Мэдээ' },
              { href: '/quizzes', icon: QuestionMarkCircleIcon, label: 'Судалгааны тест' },
              { href: '/profile', icon: UserIcon, label: 'Профайл' },
              { href: '/token', icon: Wallet2, label: 'Токен' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center text-primary dark:text-foreground hover:bg-primary/10 dark:hover:bg-primary-900/30 hover:text-primary dark:hover:text-primary-300 rounded-md px-4 py-3 text-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-300"
                onClick={toggleSidebar}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-6 border-t border-white/20">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-center px-4 py-3 rounded-xl
                  bg-gradient-to-r from-primary/90 to-primary text-white font-medium shadow-lg
                  hover:scale-[1.02] transition-transform"
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              >
                {theme === "light" ? (
                  <MoonIcon className="w-5 h-5 mr-2" />
                ) : (
                  <SunIcon className="w-5 h-5 mr-2" />
                )}
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}
