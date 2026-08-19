import { supabase } from "./supabase";

export function getFallbackQuestions(role: string, level: string, count: number): Array<{ question: string; category: string }> {
  const cleanRole = (role || "Software Engineer").trim();
  const isSenior = level.toLowerCase().includes("senior") || level.toLowerCase().includes("lead");
  let base: Array<{ question: string; category: string }> = [];

  const lowerRole = cleanRole.toLowerCase();

  if (lowerRole.includes("frontend") || lowerRole.includes("react") || lowerRole.includes("next") || lowerRole.includes("vue") || lowerRole.includes("angular")) {
    base = [
      { question: `Explain how state management and rendering optimization work in ${cleanRole} applications.`, category: "Frontend Architecture" },
      { question: `What strategies do you use for bundle size reduction, code splitting, and Web Vitals in ${cleanRole} projects?`, category: "Performance & UX" },
      { question: isSenior ? `Describe how you architect scalable micro-frontends and reusable UI design systems for ${cleanRole}.` : `What is the difference between client-side rendering and server-side rendering for ${cleanRole}?`, category: "Core Framework" },
      { question: `How do TypeScript generics and strict mode help prevent runtime errors in ${cleanRole} development?`, category: "TypeScript & Quality" },
      { question: `How do you diagnose and resolve complex memory leaks or re-render issues in ${cleanRole}?`, category: "Debugging & Performance" },
      { question: `How do CORS, XSS, and accessibility (a11y) standards impact ${cleanRole} development?`, category: "Security & Accessibility" },
      { question: `Walk us through your approach to automated unit testing and component testing for ${cleanRole}.`, category: "Testing Strategy" },
      { question: `Describe a challenging responsive layout or UI state challenge you solved in a ${level} level ${cleanRole} role.`, category: "Problem Solving" },
    ];
  } else if (lowerRole.includes("python") || lowerRole.includes("django") || lowerRole.includes("fastapi") || lowerRole.includes("flask")) {
    base = [
      { question: `Explain asynchronous programming (asyncio), concurrency, and event loops in ${cleanRole}.`, category: "Python Core" },
      { question: `How do you optimize SQL query execution, database indexing, and ORM usage in ${cleanRole} applications?`, category: "Databases & ORM" },
      { question: `Compare REST vs GraphQL vs gRPC API design when building microservices for ${cleanRole}.`, category: "API Design" },
      { question: `How do you handle memory management, GIL limitations, and CPU-bound task queues (Celery/Redis) in ${cleanRole}?`, category: "Scalability & Queues" },
      { question: `How do you secure API endpoints against SQL injection, authentication bypass, and rate limiting in ${cleanRole}?`, category: "Security" },
      { question: `Describe your testing strategy (pytest, unittest) and CI/CD automation pipeline for ${cleanRole}.`, category: "Testing & DevOps" },
      { question: `Walk us through how you refactored a slow legacy codebase in a ${level} level ${cleanRole} project.`, category: "Problem Solving" },
    ];
  } else if (lowerRole.includes("backend") || lowerRole.includes("node") || lowerRole.includes("java") || lowerRole.includes("go") || lowerRole.includes("c#") || lowerRole.includes(".net")) {
    base = [
      { question: `Compare REST APIs vs GraphQL vs gRPC for building scalable microservices as a ${cleanRole}.`, category: "API Architecture" },
      { question: `How do database indexing, connection pooling, and query optimization improve throughput for ${cleanRole} services?`, category: "Databases & Scaling" },
      { question: `Explain authentication vs authorization (JWT, OAuth2, RBAC) and endpoint security in ${cleanRole}.`, category: "Security" },
      { question: `How do you manage asynchronous message queues (Kafka, RabbitMQ) and retry policies in ${cleanRole}?`, category: "Distributed Systems" },
      { question: `Walk us through how you design database migrations without downtime in production for ${cleanRole}.`, category: "DevOps & Reliability" },
      { question: `How do caching patterns (Redis, Memcached) improve data retrieval speed in ${cleanRole}?`, category: "Caching Strategies" },
      { question: `Describe how you handle disaster recovery, distributed tracing, and logging for a ${level} ${cleanRole}.`, category: "Observability" },
    ];
  } else if (lowerRole.includes("devops") || lowerRole.includes("cloud") || lowerRole.includes("kubernetes") || lowerRole.includes("aws") || lowerRole.includes("sre")) {
    base = [
      { question: `Explain Infrastructure as Code (IaC) using Terraform or CloudFormation for ${cleanRole} environments.`, category: "Infrastructure & IaC" },
      { question: `How do you design zero-downtime CI/CD deployment pipelines (GitHub Actions, GitLab, Jenkins) for ${cleanRole}?`, category: "CI/CD & Automation" },
      { question: `Compare Docker container optimization vs Kubernetes pod orchestration and autoscaling for ${cleanRole}.`, category: "Containers & K8s" },
      { question: `How do you set up centralized logging, Prometheus/Grafana monitoring, and alerting SLAs for ${cleanRole}?`, category: "Observability & SRE" },
      { question: `How do you enforce Cloud Security, IAM policies, and secret management in ${cleanRole}?`, category: "Cloud Security" },
      { question: `Describe your incident response workflow during a major production outage in a ${level} ${cleanRole} role.`, category: "Incident Response" },
    ];
  } else if (lowerRole.includes("data") || lowerRole.includes("etl") || lowerRole.includes("sql") || lowerRole.includes("analytics") || lowerRole.includes("machine learning") || lowerRole.includes("ai")) {
    base = [
      { question: `Explain how you design scalable ETL/ELT pipelines and data warehousing strategies for ${cleanRole}.`, category: "Data Pipelines" },
      { question: `How do SQL window functions, indexing, and query partitioning optimize large dataset queries for ${cleanRole}?`, category: "SQL & Query Tuning" },
      { question: `Compare batch processing (Spark, Hadoop) vs stream processing (Kafka, Flink) for ${cleanRole}.`, category: "Big Data Processing" },
      { question: `How do you ensure data quality, schema validation, and data lineage in ${cleanRole} workflows?`, category: "Data Governance" },
      { question: `Describe how you deploy and monitor production data models or pipelines in a ${level} ${cleanRole} position.`, category: "Production MLOps" },
    ];
  } else if (lowerRole.includes("mobile") || lowerRole.includes("flutter") || lowerRole.includes("ios") || lowerRole.includes("android") || lowerRole.includes("react native")) {
    base = [
      { question: `Explain state management and app lifecycle handling for ${cleanRole} applications.`, category: "Mobile Architecture" },
      { question: `How do you optimize offline storage, local databases (SQLite/Realm), and network sync for ${cleanRole}?`, category: "Data Sync & Storage" },
      { question: `How do you optimize app startup speed, memory usage, and battery consumption in ${cleanRole}?`, category: "Mobile Performance" },
      { question: `Explain your process for automated UI testing and app store deployment (Fastlane) for ${cleanRole}.`, category: "Testing & CI/CD" },
      { question: `Describe a challenging device-specific or platform bug you diagnosed in a ${level} ${cleanRole} role.`, category: "Debugging & Hardware" },
    ];
  } else {
    // Dynamic Role-Specific Fallback for ANY Custom Role Name!
    base = [
      { question: `Walk me through your engineering process when designing a core system or feature as a ${cleanRole}.`, category: "System & Domain Design" },
      { question: `What are the primary technical tools, frameworks, and best practices essential for a ${level} ${cleanRole}?`, category: "Technical Core" },
      { question: `How do you approach performance optimization, scalability, and resource management in ${cleanRole}?`, category: "Performance & Scaling" },
      { question: `How do you ensure security, data integrity, and compliance requirements in ${cleanRole} projects?`, category: "Security & Compliance" },
      { question: `Describe a complex problem or project obstacle you solved recently as a ${cleanRole} and the trade-offs involved.`, category: "Problem Solving & Strategy" },
      { question: `How do you write reliable tests and conduct peer code reviews to maintain quality for ${cleanRole}?`, category: "Quality & Testing" },
      { question: `What emerging industry trends or tools are transforming the role of a ${cleanRole} today?`, category: "Domain Expertise" },
    ];
  }

  // Shuffle base questions using Fisher-Yates algorithm for random non-repeating selection
  const shuffled = [...base];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
}

const NON_ANSWER_PATTERNS = [
  "don't know",
  "dont know",
  "donot know",
  "do not know",
  "no idea",
  "idk",
  "dunno",
  "pass",
  "skip",
  "n/a",
  "na",
  "no answer",
  "not sure",
  "have no idea",
  "cannot answer",
  "can't answer",
  "nothing",
  "none",
];

export function isNonAnswer(text: string): boolean {
  if (!text) return true;
  const cleaned = text.trim().toLowerCase().replace(/[^a-z0-9\s]/g, "");
  if (cleaned.length === 0) return true;
  return NON_ANSWER_PATTERNS.some((pattern) => cleaned === pattern || cleaned.includes(pattern));
}

export function getAnswerForQuestion(
  q: any,
  idx: number,
  answers: Record<string, string>
): string {
  if (!answers || typeof answers !== "object") return "";

  if (q?.id && answers[q.id]) return answers[q.id];
  if (answers[String(idx)]) return answers[String(idx)];
  if (answers[String(idx + 1)]) return answers[String(idx + 1)];
  if (q?.question_number && answers[String(q.question_number)]) return answers[String(q.question_number)];
  if (q?.question_number && answers[String(q.question_number - 1)]) return answers[String(q.question_number - 1)];

  const keys = Object.keys(answers);
  if (keys[idx] && answers[keys[idx]]) return answers[keys[idx]];

  return "";
}

export function evaluateFallbackAnswers(
  questions: Array<{ id?: string; question_text?: string; question?: string; question_number: number }>,
  answers: Record<string, string>
) {
  let totalScore = 0;
  const questionResults: any[] = [];
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  const commonStopWords = new Set(["explain", "how", "works", "the", "in", "what", "is", "and", "you", "to", "for", "with", "a", "of", "do", "your", "are", "on", "can", "should", "using", "when", "describe", "compare"]);

  questions.forEach((q, idx) => {
    const userAnswer = getAnswerForQuestion(q, idx, answers);
    const trimmed = userAnswer.trim();

    let qScore = 0;
    let qFeedback = "";

    // 1. Check for non-answers or empty responses
    if (isNonAnswer(trimmed)) {
      qScore = 0;
      qFeedback = "No answer provided or candidate indicated lack of knowledge on this question.";
    } else {
      const qText = (q.question_text || q.question || "").toLowerCase();
      const answerLower = trimmed.toLowerCase();
      const wordCount = trimmed.split(/\s+/).filter(Boolean).length;

      // Extract question topic words
      const questionTopicWords = qText
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)
        .filter((w) => w.length > 3 && !commonStopWords.has(w));

      const techKeywords = [
        "architecture", "performance", "component", "state", "api", "testing",
        "optimization", "security", "hooks", "async", "database", "scale",
        "react", "dom", "redux", "context", "ssr", "typescript", "rest", "graphql",
        "index", "queue", "jwt", "oauth", "node", "python", "sql", "nosql"
      ];

      const topicOverlap = questionTopicWords.filter((tw) => answerLower.includes(tw));
      const techOverlap = techKeywords.filter((kw) => answerLower.includes(kw));

      // 2. Check for irrelevance
      if (wordCount < 4 && topicOverlap.length === 0 && techOverlap.length === 0) {
        qScore = 0;
        qFeedback = "Response appears off-topic or lacks relevant technical content.";
      } else if (topicOverlap.length === 0 && techOverlap.length === 0 && wordCount < 15) {
        // Answer does not touch question topic nor technical keywords
        qScore = 0;
        qFeedback = "Response is irrelevant to the question asked.";
      } else {
        // Answer has some technical or topic relevance - calculate score with deductions for brevity/missing terms
        let baseScore = 50;
        if (wordCount >= 10) baseScore += 15;
        if (wordCount >= 25) baseScore += 15;

        // Reward topic and technical relevance
        baseScore += Math.min(20, topicOverlap.length * 5 + techOverlap.length * 3);

        qScore = Math.min(100, Math.max(20, baseScore));

        if (qScore >= 85) {
          qFeedback = "Excellent answer! Demonstrates clear technical understanding and practical experience.";
        } else if (qScore >= 65) {
          qFeedback = "Solid attempt, but missing some key technical details or architectural examples.";
        } else {
          qFeedback = "Partially relevant answer. Significant points deducted for lack of technical depth and missing core concepts.";
        }
      }
    }

    totalScore += qScore;

    questionResults.push({
      question_id: q.id,
      question_number: q.question_number || idx + 1,
      user_answer: userAnswer,
      question_score: qScore,
      ai_feedback: qFeedback,
    });
  });

  const overallScore = Math.round(totalScore / (questions.length || 1));

  if (overallScore >= 80) {
    strengths.push("Strong articulation of core concepts and architecture");
    strengths.push("Demonstrates confidence in problem solving and best practices");
    weaknesses.push("Consider providing deeper metrics or benchmarking details in past projects");
  } else if (overallScore >= 50) {
    strengths.push("Good effort attempting interview questions");
    strengths.push("Clear understanding of basic domain principles");
    weaknesses.push("Elaborate further on trade-offs and edge-case scenarios");
    weaknesses.push("Practice structured answering frameworks (e.g. STAR method)");
  } else {
    strengths.push("Attempted the session");
    weaknesses.push("Review technical fundamentals for unanswered or off-topic questions");
    weaknesses.push("Practice articulating technical concepts clearly before future interviews");
  }

  return {
    overall_score: overallScore,
    strengths,
    weaknesses,
    questionResults,
  };
}

/**
 * Direct Client-Side Interview Creation (No Custom Backend API Routes used)
 */
export async function createInterviewSession({
  role = "Frontend Developer",
  level = "Junior",
  technology = "General",
  questionCount = 5,
  customTopics = "",
}: {
  role: string;
  level: string;
  technology?: string;
  questionCount?: number;
  customTopics?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User authentication required. Please log in.");
  }

  const targetCount = Math.min(Math.max(Number(questionCount) || 5, 1), 20);

  // 1. Ensure user profile exists in public.profiles to avoid foreign key violations
  const { data: profileRow } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!profileRow) {
    await supabase.from("profiles").upsert({
      id: user.id,
      name: user.user_metadata?.name || user.email?.split("@")[0] || "Candidate",
      email: user.email || "",
      role,
      experience_level: level,
    });
  }

  // 2. Generate questions via Server API / Groq
  let generatedQuestions: Array<{ question: string; category: string }> = [];

  try {
    const apiRes = await fetch("/api/generate-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role,
        level,
        technology,
        questionCount: targetCount,
        customTopics,
      }),
    });

    if (apiRes.ok) {
      const apiData = await apiRes.json();
      if (apiData.success && Array.isArray(apiData.questions) && apiData.questions.length > 0) {
        generatedQuestions = apiData.questions;
        console.log(`✅ Groq generated ${generatedQuestions.length} role-tailored questions for "${role}"`);
      }
    }
  } catch (err) {
    console.warn("Server API question generation error, attempting fallback generation:", err);
  }

  if (generatedQuestions.length === 0) {
    generatedQuestions = getFallbackQuestions(role, level, targetCount);
  }

  if (generatedQuestions.length === 0) {
    generatedQuestions = getFallbackQuestions(role, level, targetCount);
  }

  // 3. Insert interview into Supabase `interviews` table directly
  let insertPayload: any = {
    user_id: user.id,
    title: `${role} Practice Session`,
    role,
    level,
    difficulty: level,
    technology,
    question_count: targetCount,
    status: "in_progress",
    score: 0,
  };

  let interviewRow = null;
  let interviewError = null;

  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await supabase
      .from("interviews")
      .insert(insertPayload)
      .select()
      .single();

    if (res.data) {
      interviewRow = res.data;
      interviewError = null;
      break;
    }

    interviewError = res.error;
    const msg = res.error?.message || "";
    const colMatch = msg.match(/Could not find the '([^']+)' column/i);
    if (colMatch && colMatch[1] && insertPayload.hasOwnProperty(colMatch[1])) {
      delete insertPayload[colMatch[1]];
    } else {
      break;
    }
  }

  if (interviewError || !interviewRow) {
    throw new Error(interviewError?.message || "Failed to create interview record in Supabase");
  }

  // 4. Insert questions into Supabase `questions` table directly
  let questionsPayload = generatedQuestions.map((q, idx) => ({
    interview_id: interviewRow.id,
    question_number: idx + 1,
    question_text: q.question,
    category: q.category,
  }));

  let { data: insertedQuestions, error: qErr } = await supabase
    .from("questions")
    .insert(questionsPayload)
    .select();

  if (qErr && qErr.message?.includes("category")) {
    const qNoCat = generatedQuestions.map((q, idx) => ({
      interview_id: interviewRow.id,
      question_number: idx + 1,
      question_text: q.question,
    }));
    const retryQ = await supabase.from("questions").insert(qNoCat).select();
    insertedQuestions = retryQ.data;
  }

  return {
    success: true,
    interview_id: interviewRow.id,
    interview: interviewRow,
    questions: insertedQuestions || questionsPayload,
  };
}

/**
 * Direct Client-Side Answer Evaluation (No Custom Backend API Routes used)
 */
export async function evaluateInterviewSession({
  interviewId,
  questions,
  answers,
}: {
  interviewId: string;
  questions: any[];
  answers: Record<string, string>;
}) {
  try {
    const res = await fetch("/api/evaluate-interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interviewId, questions, answers }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return data;
      }
    }
  } catch (err) {
    console.warn("Client fetch to /api/evaluate-interview failed, attempting fallback:", err);
  }

  let evaluationResult = null;
  const groqKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || process.env.GROQ_API_KEY || "";

  const evalQuestions = (questions && questions.length > 0) ? questions : [
    { id: "q1", question_number: 1, question_text: "Technical Architecture & Principles" },
    { id: "q2", question_number: 2, question_text: "State Management & Async Operations" },
    { id: "q3", question_number: 3, question_text: "Performance Optimization & Code Quality" },
    { id: "q4", question_number: 4, question_text: "Testing & Reliability" },
    { id: "q5", question_number: 5, question_text: "System Design & Problem Solving" },
  ];

  if (groqKey) {
    const groqModels = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "llama3-70b-8192"];
    const evaluationPrompt = `You are an Honest and Strict Senior Technical Interviewer evaluating a candidate's interview performance.

Questions and Candidate Answers:
${evalQuestions
  .map(
    (q: any, idx: number) => {
      const userAns = getAnswerForQuestion(q, idx, answers);
      return `Q${idx + 1}: ${q.question_text || q.question}\nAnswer: ${userAns ? userAns : "No answer provided"}`;
    }
  )
  .join("\n\n")}

CRITICAL HONEST SCORING RULES:
1. ACCURATE / RELEVANT ANSWERS (80 - 100 Marks):
   - Award high scores for correct, technically accurate, and thorough answers.
2. PARTIALLY RELEVANT / INCOMPLETE ANSWERS (30 - 79 Marks):
   - Award partial marks according to technical relevance. Deduct marks for missing key concepts, brevity, or inaccuracies.
3. SKIPPED / NON-ANSWERS (0 Marks):
   - If candidate states "I don't know", "idk", "no idea", "pass", "skip", "n/a", or leaves the answer blank/empty, assign EXACTLY question_score = 0.
4. IRRELEVANT / OFF-TOPIC ANSWERS (0 Marks):
   - If candidate provides content completely unrelated to the question asked, assign EXACTLY question_score = 0.
5. MATHEMATICAL OVERALL SCORE:
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
            "Authorization": `Bearer ${groqKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              { role: "system", content: "You are a strictly honest technical evaluator. Assign 0 marks for skipped/non-answers/irrelevant answers. Award partial marks for incomplete answers. Output valid JSON." },
              { role: "user", content: evaluationPrompt }
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
        console.warn(`Groq evaluation client call error with model ${modelName}:`, err);
      }
    }
  }

  if (!evaluationResult || typeof evaluationResult.overall_score !== "number") {
    evaluationResult = evaluateFallbackAnswers(evalQuestions, answers);
  }

  // Guarantee mathematical accuracy: calculate overall_score as the exact average of individual question scores
  if (Array.isArray(evaluationResult.questionResults) && evaluationResult.questionResults.length > 0) {
    const sumScores = evaluationResult.questionResults.reduce(
      (acc: number, curr: any) => acc + (Number(curr.question_score) || 0),
      0
    );
    evaluationResult.overall_score = Math.round(sumScores / evaluationResult.questionResults.length);
  }

  // Update individual questions directly in Supabase
  if (questions && questions.length > 0) {
    for (const q of questions) {
      const qNum = q.question_number || q.number;
      const key = q.id || String(qNum);
      const userAns = answers[key] || answers[String(qNum - 1)] || answers[String(qNum)] || "";

      const defaultQScore = isNonAnswer(userAns) ? 0 : 70;
      const defaultFeedback = isNonAnswer(userAns)
        ? "No answer provided or candidate indicated lack of knowledge."
        : "Response evaluated successfully.";

      const qResult = evaluationResult.questionResults?.find(
        (res: any) => res.question_number === qNum
      ) || { question_score: defaultQScore, ai_feedback: defaultFeedback };

      if (q.id && !q.id.startsWith("q")) {
        await supabase
          .from("questions")
          .update({
            user_answer: userAns,
            question_score: typeof qResult.question_score === "number" ? qResult.question_score : defaultQScore,
            ai_feedback: qResult.ai_feedback || defaultFeedback,
          })
          .eq("id", q.id);
      }
    }
  }

  // Update interview session row directly in Supabase
  const overallFeedback = {
    score: evaluationResult.overall_score,
    strengths: evaluationResult.strengths || ["Solid technical fundamentals"],
    weaknesses: evaluationResult.weaknesses || ["Elaborate with deeper code examples"],
  };

  let updatePayload: any = {
    status: "completed",
    score: evaluationResult.overall_score,
    overall_feedback: overallFeedback,
    updated_at: new Date().toISOString(),
  };

  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await supabase
      .from("interviews")
      .update(updatePayload)
      .eq("id", interviewId);

    if (!res.error) break;

    const msg = res.error.message || "";
    const colMatch = msg.match(/Could not find the '([^']+)' column/i);
    if (colMatch && colMatch[1] && updatePayload.hasOwnProperty(colMatch[1])) {
      delete updatePayload[colMatch[1]];
    } else {
      break;
    }
  }

  // Trigger n8n Webhook if configured
  const n8nWebhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL || "https://waqasyounas.app.n8n.cloud/webhook/interview-completed";
  if (n8nWebhookUrl) {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Fetch user profile from Supabase profiles table as fallback
      let profileEmail = "";
      let profileName = "";
      if (user?.id) {
        const { data: profileRow } = await supabase
          .from("profiles")
          .select("email, name")
          .eq("id", user.id)
          .single();
        if (profileRow) {
          profileEmail = profileRow.email || "";
          profileName = profileRow.name || "";
        }
      }

      // Fetch interview role from Supabase
      const { data: interviewRow } = await supabase
        .from("interviews")
        .select("role")
        .eq("id", interviewId)
        .single();

      const storedEmail = typeof window !== "undefined" ? (localStorage.getItem("user_email") || localStorage.getItem("email")) : "";
      const storedName = typeof window !== "undefined" ? localStorage.getItem("name") : "";

      const candidateEmail = user?.email || profileEmail || storedEmail || "waqasyounas292@gmail.com";
      const candidateName = user?.user_metadata?.name || profileName || storedName || (candidateEmail ? candidateEmail.split("@")[0] : "Candidate");
      const interviewRole = interviewRow?.role || "Software Engineer";
      const scoreVal = evaluationResult.overall_score;

      const strengthsList = (evaluationResult.strengths || []).map((s: string) => `• ${s}`).join("\n");
      const weaknessesList = (evaluationResult.weaknesses || []).map((w: string) => `• ${w}`).join("\n");
      const feedbackText = `Score: ${scoreVal}%\n\nStrengths:\n${strengthsList}\n\nAreas to Improve:\n${weaknessesList}`;

      const payload = {
        name: candidateName,
        email: candidateEmail,
        role: interviewRole,
        score: scoreVal,
        feedback: feedbackText,
        event: "interview_completed",
        interview_id: interviewId,
        user_name: candidateName,
        user_email: candidateEmail,
        overall_score: scoreVal,
        overall_feedback: overallFeedback,
        strengths: evaluationResult.strengths || [],
        weaknesses: evaluationResult.weaknesses || [],
        question_results: evaluationResult.questionResults || [],
        completed_at: new Date().toISOString(),
      };

      console.log("🚀 Dispatching n8n Webhook payload via /api/n8n-webhook:", payload);

      const n8nRes = await fetch("/api/n8n-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await n8nRes.json();
      console.log("✅ n8n Webhook response status:", n8nRes.status, resData);
    } catch (webhookErr) {
      console.warn("⚠️ Failed to trigger n8n webhook:", webhookErr);
    }
  }

  return {
    success: true,
    interview_id: interviewId,
    score: evaluationResult.overall_score,
    feedback: overallFeedback,
  };
}
