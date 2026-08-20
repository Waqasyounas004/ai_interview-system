import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { role, level, technology, questionCount, customTopics } = await request.json();

    const selectedRole = (role || "Frontend Developer").trim();
    const selectedLevel = (level || "Junior").trim();
    const targetCount = Math.min(Math.max(Number(questionCount) || 5, 1), 20);

    const groqKey =
      process.env.GROQ_API_KEY ||
      process.env.NEXT_PUBLIC_GROQ_API_KEY ||
      "";

    if (!groqKey) {
      return NextResponse.json({ success: false, questions: [] });
    }

    // See the matching note in app/api/evaluate-interview/route.ts — these three
    // legacy llama model names are decommissioned on Groq and were silently
    // failing every call, so question generation has been falling back to the
    // static getFallbackQuestions() templates instead of real Groq output.
    const groqModels = ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.6-27b"];

    const sessionSeed = `${Date.now()}_${Math.floor(Math.random() * 1000000)}`;

    const prompt = `YOU ARE A SENIOR TECHNICAL INTERVIEWER CONDUCTING A PRACTICE INTERVIEW FOR THE EXACT JOB ROLE: "${selectedRole}" (Experience Level: ${selectedLevel}).

CRITICAL MANDATE FOR ROLE RELEVANCE:
1. ALL ${targetCount} QUESTIONS MUST BE STRICTLY AND 100% TAILORED TO THE SPECIFIC TECHNICAL DOMAIN AND SKILLS OF A "${selectedRole}".
   - For example:
     • If Role is "Frontend Developer" / "React Developer": Ask about Virtual DOM, React Hooks, Next.js rendering, CSS optimization, state management, and accessibility.
     • If Role is "Python Developer" / "Backend Developer": Ask about Python async/await, FastAPI/Django, SQL database indexing, ORMs, and API security.
     • If Role is "DevOps Engineer": Ask about Docker, Kubernetes, CI/CD pipelines, Terraform, IaC, and cloud monitoring.
     • If Role is "Data Engineer": Ask about ETL pipelines, SQL window functions, Spark, data modeling, and streaming data architecture.
     • For ANY custom role (e.g. "${selectedRole}"): Ask real-world technical, architectural, and problem-solving questions specifically required for a ${selectedLevel} ${selectedRole}.

2. DO NOT GENERATE GENERIC OR UNRELATED QUESTIONS.
3. Every question must be distinct, scenario-based, and fresh for this session (Session Seed: ${sessionSeed}).

Return a JSON object containing a "questions" key with an array of objects, where each object has "question" (string) and "category" (string).`;

    for (const modelName of groqModels) {
      try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${groqKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              {
                role: "system",
                content: `You are an expert technical interviewer. You MUST generate ${targetCount} technical questions strictly tailored for the role of "${selectedRole}". Output valid JSON.`,
              },
              { role: "user", content: prompt },
            ],
            response_format: { type: "json_object" },
            temperature: 0.85,
          }),
        });

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          const contentStr = groqData.choices?.[0]?.message?.content;
          if (contentStr) {
            const parsed = JSON.parse(contentStr);
            const qList =
              parsed.questions || parsed.data || (Array.isArray(parsed) ? parsed : null);
            if (Array.isArray(qList) && qList.length >= 1) {
              const questions = qList.slice(0, targetCount).map((q: any) => ({
                question: q.question || q.text || String(q),
                category: q.category || `${selectedRole} Technical`,
              }));

              return NextResponse.json({ success: true, questions, model: modelName });
            }
          }
        }
      } catch (err) {
        console.warn(`Groq model ${modelName} server call failed:`, err);
      }
    }

    return NextResponse.json({ success: false, questions: [] });
  } catch (error: any) {
    console.error("Error in /api/generate-questions route:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
