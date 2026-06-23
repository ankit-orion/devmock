import { converseJSON, type Usage } from "./bedrock";

export type Scorecard = {
  overallScore: number;
  verdict: string;
  summary: string;
  categoryScores: Record<string, number>;
  strengths: string[];
  improvements: string[];
};

export async function generateScorecard(opts: {
  company?: string | null;
  role: string;
  transcript: { round: string; type: string; qa: { q: string; a: string; score?: number }[] }[];
}): Promise<{ scorecard: Scorecard; usage: Usage }> {
  const system =
    "You are an interview panel summarizing a candidate's full mock interview into a scorecard. " +
    "Be honest, specific and constructive.";

  const transcriptText = opts.transcript
    .map(
      (r) =>
        `## ${r.round} (${r.type})\n` +
        r.qa.map((x) => `Q: ${x.q}\nA: ${x.a}${x.score != null ? `\n(score: ${x.score}/10)` : ""}`).join("\n\n"),
    )
    .join("\n\n");

  const prompt = `Company: ${opts.company || "Generic"}
Role: ${opts.role}

Full interview transcript:
${transcriptText}

Produce a final scorecard. Return JSON:
{
  "overallScore": number,                 // 0-100
  "verdict": string,                      // one line, e.g. "Strong — likely to advance"
  "summary": string,                      // 2-3 sentences
  "categoryScores": { [skill: string]: number },  // 0-100 each, e.g. Coding, System Design, Behavioral, Communication
  "strengths": string[],                  // 3 items
  "improvements": string[]                // 3 items
}`;

  const { data, usage } = await converseJSON<Scorecard>({
    system,
    prompt,
    maxTokens: 1200,
  });

  return {
    scorecard: {
      overallScore: Math.max(0, Math.min(100, Math.round(data.overallScore ?? 0))),
      verdict: data.verdict ?? "",
      summary: data.summary ?? "",
      categoryScores: data.categoryScores ?? {},
      strengths: data.strengths ?? [],
      improvements: data.improvements ?? [],
    },
    usage,
  };
}
