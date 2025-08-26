"use client";
import { days } from './types';

export default function ReleaseCalendar() {
  return (
    <section className="md:max-w-4/5 max-w-full mx-auto py-12 px-12">
      <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Гарах хуваарь</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4">
        {days.map((day) => (
          <div key={day} className="bg-background border border-foreground/20 p-4 rounded-lg text-center shadow-md hover:shadow-primary/20 transition">
            <h3 className="font-heading font-bold text-foreground">{day}</h3>
            <p className="text-sm text-foreground/70 mt-2">Хуваарь байхгүй байна</p>
          </div>
        ))}
      </div>
    </section>
  );
}