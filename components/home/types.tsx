export interface Video {
  id: number;
  title: string;
  thumbnail: string;
  episodes: number;
  freeEpisodes: number[];
  videoUrls?: { [episode: number]: string }; 
  episodePrices?: { [episode: number]: number };
}

export interface TextContent {
  id: number;
  title: string;
  preview: string;
  price: number;
  image: string;
  fullText?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
}

export interface QuizType {
  id: number;
  title: string;
  description: string;
  price: number;
  questions: QuizQuestion[];
  image: string;
}

export const videos: Video[] = [
  { id: 1, title: 'Human Behavior Study', thumbnail: '/image.webp', episodes: 10, freeEpisodes: [1, 2, 3, 4, 5] ,videoUrls: {
      1: "/video.mp4",
      2: "/video.mp4",
      3: "/video.mp4",
      4: "/video.mp4",
      5: "/video.mp4",
      6: "/video.mp4",
      7: "/video.mp4",
      8: "/video.mp4",
      9: "/video.mp4",
      10: "/video.mp4",
    },episodePrices: {
      6: 10,
      7: 50,
      8: 50,
      9: 50,
      10: 50,
    }},
  { id: 2, title: 'Ethics in Decision-Making', thumbnail: '/image2.webp', episodes: 25, freeEpisodes: [1, 2, 3, 4] },
  { id: 3, title: 'Ethics in Decision-Making', thumbnail: '/image2.webp', episodes: 25, freeEpisodes: [1, 2, 3, 4] },
  { id: 4, title: 'Ethics in Decision-Making', thumbnail: '/image2.webp', episodes: 25, freeEpisodes: [1, 2, 3, 4] },
  { id: 5, title: 'Ethics in Decision-Making', thumbnail: '/image2.webp', episodes: 25, freeEpisodes: [1, 2, 3, 4] },
  { id: 6, title: 'Ethics in Decision-Making', thumbnail: '/image2.webp', episodes: 25, freeEpisodes: [1, 2, 3, 4] },
  { id: 7, title: 'Ethics in Decision-Making', thumbnail: '/image2.webp', episodes: 25, freeEpisodes: [1, 2, 3, 4] },
  { id: 8, title: 'Ethics in Decision-Making', thumbnail: '/image2.webp', episodes: 25, freeEpisodes: [1, 2, 3, 4] },
  { id: 9, title: 'Ethics in Decision-Making', thumbnail: '/image2.webp', episodes: 25, freeEpisodes: [1, 2, 3, 4] },
];

export const textContent: TextContent[] = [
  { id: 1, title: 'Cognitive Bias Analysis', preview: 'Uncover how biases shape decisions...', price: 10, image: '/education.png', fullText: '' },
  { id: 2, title: 'Social Dynamics Report', preview: 'Explore group behavior patterns...', price: 50, image: '/education.png', fullText: '' },
  { id: 3, title: 'Decision Making in Groups', preview: 'Learn how groups affect choices...', price: 75, image: '/education2.png', fullText: '' },
  { id: 4, title: 'Psychology of Motivation', preview: 'Understand what drives human behavior...', price: 120, image: '/education3.png', fullText: '' },
];


export const quizContent: TextContent[] = [
  { id: 1, title: 'Quiz1', preview: 'Uncover how biases shape decisions...', price: 10 , image: '/test.png'},
  { id: 2, title: 'Quiz2', preview: 'Explore group behavior patterns...', price: 50 , image: '/test.png'},
];

export const days: string[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export const quizQuestions: QuizQuestion[] = [
  { id: 1, question: 'How do you approach complex decisions?', options: ['Analytical', 'Intuitive', 'Collaborative', 'Impulsive'] },
  { id: 2, question: 'How do you handle stress?', options: ['Proactive', 'Avoidant', 'Reflective', 'Reactive'] },
  { id: 3, question: 'What motivates your actions?', options: ['Duty', 'Curiosity', 'Reward', 'Fear'] },
  { id: 4, question: 'How do you prioritize tasks?', options: ['Urgency', 'Impact', 'Ease', 'Delegation'] },
  { id: 5, question: 'How do you respond to conflict?', options: ['Confront', 'Mediate', 'Avoid', 'Escalate'] },
  { id: 6, question: 'What drives your learning?', options: ['Practicality', 'Theory', 'Experience', 'Mentorship'] },
  { id: 7, question: 'How do you view risk?', options: ['Opportunity', 'Threat', 'Neutral', 'Challenge'] },
  { id: 8, question: 'How do you collaborate?', options: ['Lead', 'Support', 'Independent', 'Facilitate'] },
  { id: 9, question: 'What shapes your ethics?', options: ['Principles', 'Outcomes', 'Culture', 'Authority'] },
  { id: 10, question: 'How do you adapt to change?', options: ['Plan', 'Improvise', 'Resist', 'Embrace'] },
];

export const quizTypes: QuizType[] = quizContent.map((content) => ({
  id: content.id,
  title: content.title,
  description: content.preview,
  price: content.price,
  questions: quizQuestions, 
  image: content.image
}));