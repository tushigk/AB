'use client'

import { Provider } from "react-redux";
import { store } from "@/store"; 
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";
import InitProvider from "@/context/InitProvider";
import Header from "@/components/home/Header";
import { useState } from "react";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const pathname = usePathname(); 

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const hideHeaderPages = ["/login", "/register"];

  const showHeader = !hideHeaderPages.includes(pathname);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Provider store={store}>
          <ThemeProvider>
            <InitProvider>
              {showHeader && (
                <>
                  <Header/>
                </>
              )}
              {children}
            </InitProvider>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
