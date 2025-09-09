export interface Video {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  totalEpisodes: number;
  freeEpisodes: number[];
  dramaEpisodes: {
    _id: string;
    episodeNumber: number;
    thumbnailUrl: string;
    m3u8Key: string;
    videoKey: string;
  }[];
  dramaToken: number;
  episodePrices: { [episode: number]: number };
  episodeToken: number;
}



export interface Article {
  _id: string;
  title: string;
  description: string;
  image: {
    _id: string;
    url: string;
    createdAt: string;
    __v: number;
  };
  articleToken: number;
  category: string;
  createUser: string;
  subscriptionViews: number;
  purchasedViews: number;
  revenue: number;
  watchedList: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
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
  isPurchased?: boolean;
}

export const days: string[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];