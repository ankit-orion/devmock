import { converseJSON, type Usage } from "./bedrock";

export type PlannedRound = {
  name: string;
  type: "CODING" | "SYSTEM_DESIGN" | "BEHAVIORAL";
  focusAreas: string[];
  count: number;
};

export async function planInterview(opts: {
  company?: string | null;
  role: string;
  jobDescription?: string | null;
  difficulty: string;
  focus: string;
  resumeSummary?: string | null;
  companyTemplate?: unknown; // rounds JSON from CompanyInterviewTemplate
}): Promise<{ rounds: PlannedRound[]; usage: Usage }> {
  const system =
    "You are an expert technical interview designer. You design realistic, " +
    "company-accurate interview loops. Always return strict JSON.";

  const prompt = `Design an interview loop based on the following.

Company: ${opts.company || "Not specified"}
Role: ${opts.role}
Difficulty: ${opts.difficulty}
Focus: ${opts.focus}
Job description: ${opts.jobDescription || "Not provided"}
Candidate resume summary: ${opts.resumeSummary || "Not provided"}
${
  opts.companyTemplate
    ? `Known interview structure for this company (use as strong grounding): ${JSON.stringify(opts.companyTemplate)}`
    : "No known company template — derive a sensible loop from the role, focus and difficulty."
}

Return JSON of this exact shape:
{
  "rounds": [
    { "name": string, "type": "CODING" | "SYSTEM_DESIGN" | "BEHAVIORAL", "focusAreas": string[], "count": number }
  ]
}
Rules:
- 3 to 6 rounds.
- "count" is the number of primary questions in that round (1-3).
- Calibrate depth to the difficulty (Senior => more system design + leadership).`;

  return converseJSON<{ rounds: PlannedRound[] }>({
    system,
    prompt,
    maxTokens: 1200,
  }).then((r) => ({ rounds: r.data.rounds ?? [], usage: r.usage }));
}
