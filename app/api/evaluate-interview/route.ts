import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAnswerForQuestion, isNonAnswer, evaluateFallbackAnswers, safeUpdate, safeInsertRows } from "@/lib/interviewService";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { interviewId, questions, answers } = await request.json();

    if (!interviewId) {
      return NextResponse.json({ success: false, error: "Missing interviewId" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "";

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const groqKey =
      process.env.GROQ_API_KEY ||
      process.env.NEXT_PUBLIC_GROQ_API_KEY ||
      "";

    const n8nWebhookUrl =
      process.env.N8N_WEBHOOK_URL ||
      process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ||
      "https://waqasyounas.app.n8n.cloud/webhook/interview-completed";

    const evalQuestions =
      questions && questions.length > 0
        ? questions
        : [
            { id: "q1", question_number: 1, question_text: "Technical Architecture & Principles" },
            { id: "q2", question_number: 2, question_text: "State Management & Async Operations" },
            { id: "q3", question_number: 3, question_text: "Performance Optimization & Code Quality" },
            { id: "q4", question_number: 4, question_text: "Testing & Reliability" },
            { id: "q5", question_number: 5, question_text: "System Design & Problem Solving" },
          ];

    let evaluationResult: any = null;

    if (groqKey) {
      const groqModels = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "llama3-70b-8192"];
      const evaluationPrompt = `You are an Honest and Strict Senior Technical Interviewer evaluating a candidate's interview performance.

Questions and Candidate Answers:
${evalQuestions
  .map((q: any, idx: number) => {
    const userAns = getAnswerForQuestion(q, idx, answers);
    return `Q${idx + 1}: ${q.question_text || q.question}\nAnswer: ${userAns ? userAns : "No answer provided"}`;
  })
  .join("\n\n")}

CRITICAL EVALUATION & SCORING RULES:
1. COMPLETE & RELEVANT ANSWERS (80 - 100 Marks):
   - When candidate provides relevant technical answers, BE GENEROUS and award 85-100 marks.
2. BRIEF / PARTIAL ANSWERS (60 - 84 Marks):
   - If candidate attempts the question with partial technical relevance, award 60-84 marks.
3. SKIPPED / NON-ANSWERS / OFF-TOPIC (0 Marks):
   - ONLY assign 0 marks if candidate explicitly skips ("idk", "pass", blank) or writes completely off-topic content.
4. MATHEMATICAL OVERALL SCORE:
   - "overall_score" MUST be the exact mathematical average of all question_score items: Math.round(Sum of question_scores / total_questions).

Provide an evaluation as a JSON object matching this schema:
{
  "overall_score": number (0-100),
  "strengths": string[],
  "weaknesses": string[],
  "questionResults": [
    {
      "question_number": number,
      "question_score": number (0-100),
      "ai_feedback": string
    }
  ]
}`;

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
                  content:
                    "You are a strictly honest technical evaluator. Assign 0 marks for skipped/non-answers/irrelevant answers. Award partial marks for incomplete answers. Output valid JSON.",
                },
                { role: "user", content: evaluationPrompt },
              ],
              response_format: { type: "json_object" },
              temperature: 0.2,
            }),
          });

          if (groqRes.ok) {
            const groqData = await groqRes.json();
            const contentStr = groqData.choices?.[0]?.message?.content;
            if (contentStr) {
              const parsed = JSON.parse(contentStr);
              if (parsed && typeof parsed.overall_score === "number") {
                evaluationResult = parsed;
                break;
              }
            }
          }
        } catch (err) {
          console.warn(`Groq server call error for model ${modelName}:`, err);
        }
      }
    }

    if (!evaluationResult || typeof evaluationResult.overall_score !== "number") {
      evaluationResult = evaluateFallbackAnswers(evalQuestions, answers);
    }

    // Mathematical accuracy guarantee
    if (Array.isArray(evaluationResult.questionResults) && evaluationResult.questionResults.length > 0) {
      const sumScores = evaluationResult.questionResults.reduce(
        (acc: number, curr: any) => acc + (Number(curr.question_score) || 0),
        0
      );
      evaluationResult.overall_score = Math.round(sumScores / evaluationResult.questionResults.length);
    }

    // Update / Insert questions in Supabase using admin client
    if (questions && questions.length > 0) {
      for (const q of questions) {
        const qNum = q.question_number || q.number || 1;
        const userAns = getAnswerForQuestion(q, qNum - 1, answers);

        const defaultQScore = isNonAnswer(userAns) ? 0 : 70;
        const defaultFeedback = isNonAnswer(userAns)
          ? "No answer provided or candidate indicated lack of knowledge."
          : "Response evaluated successfully.";

        const qResult = evaluationResult.questionResults?.find(
          (res: any) => res.question_number === qNum
        ) || { question_score: defaultQScore, ai_feedback: defaultFeedback };

        const finalQScore = typeof qResult.question_score === "number" ? qResult.question_score : defaultQScore;

        if (q.id && !q.id.startsWith("q")) {
          await safeUpdate(
            supabase,
            "questions",
            {
              user_answer: userAns,
              question_score: finalQScore,
              ai_feedback: qResult.ai_feedback || defaultFeedback,
            },
            "id",
            q.id
          );
        } else {
          await safeInsertRows(supabase, "questions", [
            {
              interview_id: interviewId,
              question_number: qNum,
              question_text: q.question || q.question_text || `Question ${qNum}`,
              category: q.category || "Technical",
              user_answer: userAns,
              question_score: finalQScore,
              ai_feedback: qResult.ai_feedback || defaultFeedback,
            },
          ]);
        }
      }
    }

    // Fetch candidate and interview info for n8n payload
    const { data: interviewRow } = await supabase
      .from("interviews")
      .select("role, user_id")
      .eq("id", interviewId)
      .maybeSingle();

    let candidateEmail = "";
    let candidateName = "Candidate";

    if (interviewRow?.user_id) {
      // 1. Try public.profiles table
      const { data: profileRow } = await supabase
        .from("profiles")
        .select("email, name")
        .eq("id", interviewRow.user_id)
        .maybeSingle();

      if (profileRow?.email) {
        candidateEmail = profileRow.email;
        candidateName = profileRow.name || candidateEmail.split("@")[0];
      } else {
        // 2. Try Supabase Auth admin user lookup
        try {
          const { data: authUserData } = await supabase.auth.admin.getUserById(interviewRow.user_id);
          if (authUserData?.user?.email) {
            candidateEmail = authUserData.user.email;
            candidateName = authUserData.user.user_metadata?.name || candidateEmail.split("@")[0];
          }
        } catch (authErr) {
          console.warn("Auth admin lookup fallback skipped:", authErr);
        }
      }
    }

    const overallFeedback = {
      score: evaluationResult.overall_score,
      strengths: evaluationResult.strengths || ["Solid technical fundamentals"],
      weaknesses: evaluationResult.weaknesses || ["Elaborate with deeper code examples"],
    };

    // Update interview in Supabase. safeUpdate strips any column the live schema
    // doesn't recognize (e.g. a missing `updated_at`) and retries, instead of
    // letting PostgREST silently reject the whole write and leave score at 0.
    const { error: updateErr } = await safeUpdate(
      supabase,
      "interviews",
      {
        status: "completed",
        score: evaluationResult.overall_score,
        overall_feedback: overallFeedback,
        updated_at: new Date().toISOString(),
      },
      "id",
      interviewId
    );

    if (updateErr) {
      console.error("❌ Supabase DB score update error in server route:", updateErr);
    } else {
      console.log("✅ Supabase DB score updated to:", evaluationResult.overall_score);
    }

    // Trigger n8n Webhook Server-to-Server
    const strengthsList = (evaluationResult.strengths || []).map((s: string) => `• ${s}`).join("\n");
    const weaknessesList = (evaluationResult.weaknesses || []).map((w: string) => `• ${w}`).join("\n");
    const feedbackText = `Score: ${evaluationResult.overall_score}%\n\nStrengths:\n${strengthsList}\n\nAreas to Improve:\n${weaknessesList}`;

    const n8nPayload = {
      to: candidateEmail,
      recipient: candidateEmail,
      name: candidateName,
      email: candidateEmail,
      role: interviewRow?.role || "Software Engineer",
      score: evaluationResult.overall_score,
      feedback: feedbackText,
      event: "interview_completed",
      interview_id: interviewId,
      user_name: candidateName,
      user_email: candidateEmail,
      overall_score: evaluationResult.overall_score,
      overall_feedback: overallFeedback,
      strengths: evaluationResult.strengths || [],
      weaknesses: evaluationResult.weaknesses || [],
      question_results: evaluationResult.questionResults || [],
      completed_at: new Date().toISOString(),
    };

    console.log("🚀 Vercel Serverless forwarding to n8n Webhook:", n8nWebhookUrl, n8nPayload);

    let n8nStatus = 0;
    let n8nResponse = "";
    try {
      const n8nRes = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(n8nPayload),
      });
      n8nStatus = n8nRes.status;
      n8nResponse = await n8nRes.text();
      console.log("✅ n8n Webhook response on Vercel:", n8nStatus, n8nResponse);
    } catch (n8nErr: any) {
      console.error("❌ Failed to call n8n webhook from server:", n8nErr);
    }

    return NextResponse.json({
      success: true,
      score: evaluationResult.overall_score,
      feedback: overallFeedback,
      n8nStatus,
      n8nResponse,
    });
  } catch (error: any) {
    console.error("❌ Error in /api/evaluate-interview route:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
