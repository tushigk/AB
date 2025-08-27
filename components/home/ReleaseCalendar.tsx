"use client";
import { motion } from "framer-motion";
import { days } from "./types";

export default function ReleaseCalendar() {
  return (
    <section className="max-w-6xl mx-auto py-16 px-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-4xl md:text-5xl font-extrabold font-heading text-center text-foreground mb-10"
      >
        📅 Гарах хуваарь
      </motion.h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-6">
        {days.map((day, idx) => (
          <motion.div
            key={day}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative group bg-gradient-to-br from-background/80 to-background/40 
                       backdrop-blur-lg border border-white/10 shadow-lg rounded-2xl 
                       p-6 flex flex-col items-center justify-center 
                       hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/30 
                       transition duration-300 ease-out"
          >
            <h3 className="text-lg md:text-xl font-bold font-heading text-foreground group-hover:text-primary transition">
              {day}
            </h3>
            <p className="text-sm text-foreground/60 mt-2">
              Хуваарь байхгүй байна
            </p>

            <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300 rounded-b-2xl" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
