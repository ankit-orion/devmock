import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";

// Model id can vary by account/region — override with BEDROCK_MODEL_ID.
// Use an inference-profile id (e.g. "us.anthropic.claude-sonnet-4-...") if your
// region requires it.
const MODEL_ID =
  process.env.BEDROCK_MODEL_ID ||
  "anthropic.claude-3-5-sonnet-20241022-v2:0";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
});

export type Usage = { input: number; output: number };

type ConverseOpts = {
  system?: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
};

export async function converse(
  opts: ConverseOpts,
): Promise<{ text: string; usage: Usage }> {
  const res = await client.send(
    new ConverseCommand({
      modelId: MODEL_ID,
      system: opts.system ? [{ text: opts.system }] : undefined,
      messages: [{ role: "user", content: [{ text: opts.prompt }] }],
      inferenceConfig: {
        maxTokens: opts.maxTokens ?? 1024,
        temperature: opts.temperature ?? 0.7,
      },
    }),
  );

  const text =
    res.output?.message?.content
      ?.map((c) => c.text ?? "")
      .join("")
      .trim() ?? "";

  return {
    text,
    usage: {
      input: res.usage?.inputTokens ?? 0,
      output: res.usage?.outputTokens ?? 0,
    },
  };
}

/** Extract the first balanced JSON object/array from a string. */
function extractJSON(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = fenced ? fenced[1] : text;
  const start = body.search(/[[{]/);
  if (start === -1) throw new Error("No JSON found in model output");
  const open = body[start];
  const close = open === "{" ? "}" : "]";
  let depth = 0;
  for (let i = start; i < body.length; i++) {
    if (body[i] === open) depth++;
    else if (body[i] === close) {
      depth--;
      if (depth === 0) return body.slice(start, i + 1);
    }
  }
  throw new Error("Unbalanced JSON in model output");
}

export async function converseJSON<T>(
  opts: ConverseOpts,
): Promise<{ data: T; usage: Usage }> {
  const { text, usage } = await converse({
    ...opts,
    prompt:
      opts.prompt +
      "\n\nRespond with ONLY valid JSON. No prose, no markdown fences.",
    temperature: opts.temperature ?? 0.4,
  });
  const data = JSON.parse(extractJSON(text)) as T;
  return { data, usage };
}
