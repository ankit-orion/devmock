import { planInterview } from "../lib/ai/planner";
import { evaluateAnswer } from "../lib/ai/interviewer";

async function main() {
  console.log("Region:", process.env.AWS_REGION, "| Model:", process.env.BEDROCK_MODEL_ID);

  console.log("\n--- planInterview ---");
  const plan = await planInterview({
    company: "Amazon",
    role: "SDE II",
    difficulty: "Mid",
    focus: "Mixed",
  });
  console.log(JSON.stringify(plan.rounds, null, 2));

  console.log("\n--- evaluateAnswer ---");
  const ev = await evaluateAnswer({
    roundType: "CODING",
    question: "Two sum: return indices of two numbers adding to target.",
    answer: "Use a hash map of value->index; one pass, O(n) time, O(n) space.",
    alreadyFollowedUp: false,
  });
  console.log(JSON.stringify({ score: ev.score, strengths: ev.strengths, needsFollowUp: ev.needsFollowUp }, null, 2));
  console.log("\nAll AI calls OK.");
}

main().catch((e) => {
  console.error("AI ERROR:", e?.name, "-", e?.message);
  process.exit(1);
});
