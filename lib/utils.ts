export function formatDate(date: string): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function capitalize(text: string): string {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function calculatePercentage(score: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((score / total) * 100);
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getScoreBadgeColor(score: number): {
  bg: string;
  text: string;
  border: string;
} {
  if (score >= 80) {
    return {
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      text: "text-emerald-700 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-800",
    };
  }
  if (score >= 60) {
    return {
      bg: "bg-amber-50 dark:bg-amber-950/40",
      text: "text-amber-700 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-800",
    };
  }
  return {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-800",
  };
}

export function truncateText(text: string, maxLength: number = 60): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function extractInterviewScore(interview: any): number {
  if (!interview) return 0;
  if (typeof interview.score === "number" && interview.score > 0) {
    return interview.score;
  }
  if (typeof interview.overall_feedback?.score === "number" && interview.overall_feedback.score > 0) {
    return interview.overall_feedback.score;
  }
  if (typeof interview.feedback?.score === "number" && interview.feedback.score > 0) {
    return interview.feedback.score;
  }
  if (typeof interview.score === "number") {
    return interview.score;
  }
  return 0;
}

export async function repairAndExtractScore(interview: any, supabaseClient: any): Promise<number> {
  const directScore = extractInterviewScore(interview);
  if (directScore > 0) return directScore;

  if (interview?.id && supabaseClient) {
    try {
      const { data: qRows } = await supabaseClient
        .from("questions")
        .select("question_score")
        .eq("interview_id", interview.id);

      if (qRows && qRows.length > 0) {
        const validQuestionScores = qRows
          .map((q: any) => Number(q.question_score))
          .filter((s: number) => !isNaN(s) && s > 0);

        if (validQuestionScores.length > 0) {
          const calcAvg = Math.round(
            validQuestionScores.reduce((a: number, b: number) => a + b, 0) / qRows.length
          );

          if (calcAvg > 0) {
            // Repair database row asynchronously
            supabaseClient
              .from("interviews")
              .update({ score: calcAvg, status: "completed" })
              .eq("id", interview.id)
              .then(() => {});

            return calcAvg;
          }
        }
      }
    } catch (e) {
      console.warn("Score repair failed:", e);
    }
  }

  return directScore;
}
