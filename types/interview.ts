export interface Question {
  id: string;
  question: string;
  category: string;
}

export interface Feedback {
  score: number;
  strengths: string[];
  weaknesses: string[];
}

export interface Interview {
  id: string;
  title: string;
  role: string;
  level: string;
  date: string;
  questions: Question[];
  feedback: Feedback;
}
