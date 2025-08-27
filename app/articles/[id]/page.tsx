"use client";

import { notFound } from "next/navigation";
import { textContent, TextContent } from "@/components/home/types";
import React from "react";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ArticlePageClient({ params }: Props) {
  const [article, setArticle] = React.useState<TextContent | null>(null);

  React.useEffect(() => {
    params.then(({ id }) => {
      const found = textContent.find((item) => item.id === Number(id));
      if (!found) return notFound();
      setArticle(found);
    });
  }, [params]);

  if (!article) return <p className="text-center mt-12 text-gray-400">Ачааллаж байна...</p>;

  return (
    <article className="min-h-screen bg-background text-foreground font-sans px-6 py-12 max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{article.title}</h1>
      <p className="text-lg text-gray-400 mb-8">{article.preview}</p>
      
      {article.image && (
        <div className="mb-8">
          <img
            src={article.image}
            alt={article.title}
            className="w-full rounded-xl object-cover shadow-lg"
          />
        </div>
      )}

      {article.fullText ? (
        <div className="prose prose-lg prose-invert max-w-full leading-relaxed">
          <p>{article.fullText}</p>
        </div>
      ) : (
        <p className="text-gray-500 italic">Агуулга одоогоор байхгүй байна.</p>
      )}
   
    </article>
  );
}
