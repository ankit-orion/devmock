import { converse, converseJSON, type Usage } from "./bedrock";

export type TranscriptItem = { role: "ai" | "user"; text: string };

export async function generateQuestion(opts: {
  company?: string | null;
  role: string;
  roundName: string;
  roundType: string;
  focusAreas: string[];
  transcript: TranscriptItem[];
  bankQuestions?: string[];
  resumeProjects?: string[];
}): Promise<{ text: string; category: string | null; source: "BANK" | "GENERATED" | "RESUME_BASED"; usage: Usage }> {
  const system =
    "You are a senior technical interviewer running one round of a mock interview. " +
    "Ask ONE clear, realistic question at a time, in the style of the target company.";

  const transcriptText = opts.transcript.length
    ? opts.transcript.map((t) => `${t.role === "ai" ? "Interviewer" : "Candidate"}: ${t.text}`).join("\n")
    : "(no questions asked yet)";

  const prompt = `Company: ${opts.company || "Generic"}
Role: ${opts.role}
Current round: ${opts.roundName} (${opts.roundType})
Focus areas for this round: ${opts.focusAreas.join(", ")}
${opts.bankQuestions?.length ? `Commonly-asked questions to draw from or adapt:\n- ${opts.bankQuestions.join("\n- ")}` : ""}
${opts.resumeProjects?.length ? `Candidate resume projects (use for behavioral/intro questions):\n- ${opts.resumeProjects.join("\n- ")}` : ""}

Conversation so far in this round:
${transcriptText}

Produce the NEXT question to ask (not a repeat). Prefer a bank question if a relevant one exists; otherwise generate one; use a resume project if it fits a behavioral round.

Return JSON: { "text": string, "category": string, "source": "BANK" | "GENERATED" | "RESUME_BASED" }`;

  const { data, usage } = await converseJSON<{ text: string; category: string; source: "BANK" | "GENERATED" | "RESUME_BASED" }>({
    system,
    prompt,
    maxTokens: 600,
  });
  return { text: data.text, category: data.category ?? null, source: data.source ?? "GENERATED", usage };
}

export async function evaluateAnswer(opts: {
  roundType: string;
  question: string;
  answer: string;
  alreadyFollowedUp: boolean;
}): Promise<{
  score: number;
  strengths: string[];
  weaknesses: string[];
  feedback: string;
  needsFollowUp: boolean;
  followUpQuestion: string | null;
  usage: Usage;
}> {
  const system =
    "You are a rigorous but fair technical interviewer evaluating a candidate's answer. " +
    "Be specific and concise.";

  const prompt = `Round type: ${opts.roundType}
Question: ${opts.question}
Candidate answer:
"""
${opts.answer}
"""
${opts.alreadyFollowedUp ? "A follow-up has already been asked for this question — do NOT ask another (set needsFollowUp=false)." : "You may ask ONE probing follow-up if the answer is incomplete or shallow."}

Return JSON:
{
  "score": number,            // 0-10
  "strengths": string[],      // up to 2 short points
  "weaknesses": string[],     // up to 2 short points
  "feedback": string,         // 1-2 sentences
  "needsFollowUp": boolean,
  "followUpQuestion": string | null
}`;

  const { data, usage } = await converseJSON<{
    score: number;
    strengths: string[];
    weaknesses: string[];
    feedback: string;
    needsFollowUp: boolean;
    followUpQuestion: string | null;
  }>({ system, prompt, maxTokens: 700 });

  return {
    score: Math.max(0, Math.min(10, Math.round(data.score ?? 0))),
    strengths: data.strengths ?? [],
    weaknesses: data.weaknesses ?? [],
    feedback: data.feedback ?? "",
    needsFollowUp: opts.alreadyFollowedUp ? false : !!data.needsFollowUp,
    followUpQuestion: data.followUpQuestion ?? null,
    usage,
  };
}

// Re-export for convenience
export { converse };
