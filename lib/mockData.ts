import { User } from "@/types/user";
import { Interview } from "@/types/interview";

export const mockUser: User = {
  id: "1",
  name: "Waqas",
  email: "waqas@example.com",
  role: "Student / Aspiring Frontend Developer",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Waqas",
  experienceLevel: "Junior",
  completedInterviewsCount: 8,
  averageScore: 86,
};

export const mockInterviews: Interview[] = [
  {
    id: "1",
    title: "Frontend Developer Interview",
    role: "Frontend Developer",
    level: "Junior",
    date: "2026-08-05",
    questions: [
      {
        id: "1",
        question: "What is React and how does the Virtual DOM work?",
        category: "React",
      },
      {
        id: "2",
        question: "What are Server Components in Next.js 15?",
        category: "Next.js",
      },
      {
        id: "3",
        question: "Explain the difference between interface and type in TypeScript.",
        category: "TypeScript",
      },
    ],
    feedback: {
      score: 85,
      strengths: ["Good communication skills", "Strong React & Next.js fundamentals"],
      weaknesses: ["Deepen TypeScript generics knowledge", "Practice complex state management"],
    },
  },
  {
    id: "2",
    title: "Full Stack Engineer Mock",
    role: "Full Stack Developer",
    level: "Mid-Level",
    date: "2026-08-02",
    questions: [
      {
        id: "1",
        question: "How do you handle authentication securely in Next.js apps?",
        category: "Security",
      },
      {
        id: "2",
        question: "What is the difference between SQL and NoSQL databases?",
        category: "Database",
      },
    ],
    feedback: {
      score: 90,
      strengths: ["Excellent database design concepts", "Clear explanation of Auth flow"],
      weaknesses: ["Could detail query indexing strategies further"],
    },
  },
  {
    id: "3",
    title: "JavaScript Core Assessment",
    role: "JavaScript Engineer",
    level: "Junior",
    date: "2026-07-28",
    questions: [
      {
        id: "1",
        question: "Explain Event Loop and Asynchronous Execution in JS.",
        category: "JavaScript",
      },
      {
        id: "2",
        question: "What are Closures and how are they useful?",
        category: "JavaScript",
      },
    ],
    feedback: {
      score: 82,
      strengths: ["Solid understanding of promises and async/await"],
      weaknesses: ["Need more practice explaining event delegation"],
    },
  },
];
