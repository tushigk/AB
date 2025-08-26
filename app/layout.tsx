'use client'
import { Provider } from "react-redux";
import { store } from "@/store"; 
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";
import InitProvider from "@/context/InitProvider";

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
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Provider store={store}>
          <ThemeProvider>
            <InitProvider>{children}</InitProvider>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
