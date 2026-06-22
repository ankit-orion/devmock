export type Difficulty = "Junior" | "Mid" | "Senior";
export type InterviewType = "Mixed" | "Coding" | "System Design" | "Behavioral";

export type Round = {
  name: string;
  type: string;
  focus: string[];
  count: number;
};

export const TYPE_COLORS: Record<string, string> = {
  Coding: "#a78bfa",
  "System Design": "#f5a97f",
  Behavioral: "#7aa2f7",
  Leadership: "#8bd5a0",
  Mixed: "#5bc0c0",
};

export const KNOWN_COMPANIES = [
  "Amazon",
  "Google",
  "Meta",
  "Microsoft",
  "Apple",
  "Netflix",
  "Stripe",
  "Uber",
];

// Commonly-reported interview structures (illustrative, not guaranteed).
const COMPANY_TEMPLATES: Record<string, Round[]> = {
  amazon: [
    { name: "Online Assessment", type: "Coding", focus: ["Arrays", "Hash Maps"], count: 2 },
    { name: "Phone Screen", type: "Behavioral", focus: ["Ownership", "Customer Obsession"], count: 3 },
    { name: "Onsite — Coding", type: "Coding", focus: ["Trees", "Dynamic Programming"], count: 2 },
    { name: "Onsite — System Design", type: "System Design", focus: ["Scalability", "Caching"], count: 1 },
    { name: "Bar Raiser", type: "Behavioral", focus: ["Dive Deep", "Deliver Results"], count: 3 },
  ],
  google: [
    { name: "Phone Screen", type: "Coding", focus: ["Strings", "Recursion"], count: 2 },
    { name: "Onsite — Coding 1", type: "Coding", focus: ["Graphs", "Dynamic Programming"], count: 2 },
    { name: "Onsite — Coding 2", type: "Coding", focus: ["Trees", "Heaps"], count: 2 },
    { name: "System Design", type: "System Design", focus: ["Distributed Systems", "Sharding"], count: 1 },
    { name: "Googleyness & Leadership", type: "Behavioral", focus: ["Collaboration", "Impact"], count: 3 },
  ],
  meta: [
    { name: "Phone Screen", type: "Coding", focus: ["Arrays", "Two Pointers"], count: 2 },
    { name: "Onsite — Coding", type: "Coding", focus: ["Graphs", "Intervals"], count: 2 },
    { name: "System Design", type: "System Design", focus: ["News Feed", "Scalability"], count: 1 },
    { name: "Behavioral", type: "Behavioral", focus: ["Move Fast", "Conflict"], count: 3 },
  ],
  microsoft: [
    { name: "Online Assessment", type: "Coding", focus: ["Arrays", "Strings"], count: 2 },
    { name: "Onsite — Coding", type: "Coding", focus: ["Trees", "Linked Lists"], count: 2 },
    { name: "System Design", type: "System Design", focus: ["APIs", "Caching"], count: 1 },
    { name: "As Appropriate (AA)", type: "Behavioral", focus: ["Growth Mindset", "Ownership"], count: 2 },
  ],
};

const DIFFICULTY_NOTE: Record<Difficulty, string> = {
  Junior: "Fundamentals-focused, gentler pacing",
  Mid: "Standard difficulty across rounds",
  Senior: "Deeper system design and leadership emphasis",
};

export function difficultyNote(d: Difficulty) {
  return DIFFICULTY_NOTE[d];
}

function genericPlan(type: InterviewType, difficulty: Difficulty): Round[] {
  const sd: Round = {
    name: "System Design",
    type: "System Design",
    focus: difficulty === "Senior" ? ["Scalability", "Trade-offs", "Reliability"] : ["APIs", "Data Modeling"],
    count: 1,
  };
  const coding1: Round = { name: "Coding Round 1", type: "Coding", focus: ["Arrays", "Hash Maps"], count: 2 };
  const coding2: Round = { name: "Coding Round 2", type: "Coding", focus: ["Trees", "Graphs"], count: 2 };
  const behavioral: Round = { name: "Behavioral", type: "Behavioral", focus: ["Teamwork", "Ownership"], count: 3 };

  switch (type) {
    case "Coding":
      return difficulty === "Junior" ? [coding1, behavioral] : [coding1, coding2, behavioral];
    case "System Design":
      return [sd, { ...sd, name: "System Design 2", focus: ["Caching", "Queues"] }, behavioral];
    case "Behavioral":
      return [behavioral, { ...behavioral, name: "Values & Leadership", focus: ["Conflict", "Impact"] }];
    default: // Mixed
      return difficulty === "Senior"
        ? [coding1, coding2, sd, behavioral]
        : [coding1, sd, behavioral];
  }
}

/** Build a (mock) interview plan from the intake details. */
export function generatePlan(opts: {
  company: string;
  type: InterviewType;
  difficulty: Difficulty;
}): Round[] {
  const key = opts.company.trim().toLowerCase();
  if (key && COMPANY_TEMPLATES[key]) {
    return COMPANY_TEMPLATES[key];
  }
  return genericPlan(opts.type, opts.difficulty);
}
