import ArticlePageClient from "./ArticlePageClient";

interface Params {
  params: { id: string };
}

export default function ArticlePage({ params }: Params) {
  return <ArticlePageClient id={params.id} />;
}
