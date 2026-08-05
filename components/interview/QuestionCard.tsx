import Card from "@/components/ui/Card";

interface QuestionCardProps {
  question: string;
  number: number;
  category?: string;
}

export default function QuestionCard({
  question,
  number,
  category,
}: QuestionCardProps) {
  return (
    <Card className="p-6 border-l-4 border-l-indigo-600 dark:border-l-indigo-500">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Question {number}
        </span>
        {category && (
          <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            {category}
          </span>
        )}
      </div>

      <h2 className="text-xl font-bold text-zinc-900 dark:text-white leading-snug">
        {question}
      </h2>
    </Card>
  );
}
