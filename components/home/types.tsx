export interface Video {
  id: string | number; 
  title: string;
  thumbnail: string;
  episodes: number;
  freeEpisodes: number[];
  videoUrls?: { [episode: number]: string };
  episodePrices?: { [episode: number]: number };
  description?: string;
}

export interface TextContent {
  id: number;
  title: string;
  preview: string;
  image: string;
  fullText?: string;
  articleToken?: number;
}

export interface QuizQuestion {
  _id: string;
  text: string;
  options: string[];
}

export interface QuizResult {
  _id: string;
  label: string;
  description: string;
  minScore: number;
  maxScore: number;
}

export interface QuizType {
  id?: string;
  _id: string; 
  title: string;
  description: string;
  questions: QuizQuestion[];
  image: string; 
  surveyToken: number;
  results: QuizResult[];
  createdBy: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  subscriptionSubmissions: number;
  purchasedSubmissions: number;
  revenue: number;
}

export const days: string[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];