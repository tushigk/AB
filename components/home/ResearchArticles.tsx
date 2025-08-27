"use client";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { TextContent } from "./types";

interface ResearchArticlesProps {
  textContent: TextContent[];
}

export default function ResearchArticles({ textContent }: ResearchArticlesProps) {
  return (
    <section className="md:max-w-4/5 max-w-full mx-auto py-12 px-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-heading font-bold text-foreground">
          Мэдээ мэдээлэл
        </h2>
        <Link
          href="/articles"
          className="text-primary hover:underline font-medium"
        >
          Бүгдийг үзэх →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
        {textContent.slice(0, 4).map((item) => (
          <div
            key={item.id}
            className="relative bg-background border border-foreground/20 rounded-lg p-4 hover:shadow-lg hover:shadow-primary/20 transition"
          >
            <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
              18+
            </div>
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-72 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-heading font-semibold text-foreground">
              {item.title}
            </h3>
            <p className="text-foreground/70 mt-2">{item.preview}</p>

            <Link
              href={`/articles/${item.id}`}
              className="mt-4 inline-flex items-center bg-gradient-to-r from-secondary to-accent text-white px-4 py-2 rounded-md hover:opacity-90 transition"
              aria-label={`Unlock ${item.title} for ${item.price}₮`}
            >
              <LockClosedIcon className="w-5 h-5 mr-2" /> Нээх {item.price}₮
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
