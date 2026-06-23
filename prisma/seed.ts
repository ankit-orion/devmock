import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const companyTemplates = [
  {
    company: "Amazon",
    notes: "Heavy focus on Leadership Principles. The Bar Raiser is the most senior interviewer.",
    rounds: [
      { name: "Online Assessment", type: "CODING", focusAreas: ["Arrays", "Hash Maps"], count: 2 },
      { name: "Phone Screen", type: "BEHAVIORAL", focusAreas: ["Ownership", "Customer Obsession"], count: 3 },
      { name: "Onsite — Coding", type: "CODING", focusAreas: ["Trees", "Dynamic Programming"], count: 2 },
      { name: "Onsite — System Design", type: "SYSTEM_DESIGN", focusAreas: ["Scalability", "Caching"], count: 1 },
      { name: "Bar Raiser", type: "BEHAVIORAL", focusAreas: ["Dive Deep", "Deliver Results"], count: 3 },
    ],
  },
  {
    company: "Google",
    notes: "Strong emphasis on algorithmic depth and 'Googleyness'.",
    rounds: [
      { name: "Phone Screen", type: "CODING", focusAreas: ["Strings", "Recursion"], count: 2 },
      { name: "Onsite — Coding 1", type: "CODING", focusAreas: ["Graphs", "Dynamic Programming"], count: 2 },
      { name: "Onsite — Coding 2", type: "CODING", focusAreas: ["Trees", "Heaps"], count: 2 },
      { name: "System Design", type: "SYSTEM_DESIGN", focusAreas: ["Distributed Systems", "Sharding"], count: 1 },
      { name: "Googleyness & Leadership", type: "BEHAVIORAL", focusAreas: ["Collaboration", "Impact"], count: 3 },
    ],
  },
  {
    company: "Meta",
    notes: "Fast-paced; values pragmatism and impact.",
    rounds: [
      { name: "Phone Screen", type: "CODING", focusAreas: ["Arrays", "Two Pointers"], count: 2 },
      { name: "Onsite — Coding", type: "CODING", focusAreas: ["Graphs", "Intervals"], count: 2 },
      { name: "System Design", type: "SYSTEM_DESIGN", focusAreas: ["News Feed", "Scalability"], count: 1 },
      { name: "Behavioral", type: "BEHAVIORAL", focusAreas: ["Move Fast", "Conflict"], count: 3 },
    ],
  },
  {
    company: "Microsoft",
    notes: "Balanced coding + design with a growth-mindset behavioral round.",
    rounds: [
      { name: "Online Assessment", type: "CODING", focusAreas: ["Arrays", "Strings"], count: 2 },
      { name: "Onsite — Coding", type: "CODING", focusAreas: ["Trees", "Linked Lists"], count: 2 },
      { name: "System Design", type: "SYSTEM_DESIGN", focusAreas: ["APIs", "Caching"], count: 1 },
      { name: "As Appropriate (AA)", type: "BEHAVIORAL", focusAreas: ["Growth Mindset", "Ownership"], count: 2 },
    ],
  },
];

const questionBank: { company: string | null; category: string; text: string }[] = [
  // Amazon Leadership Principles
  { company: "Amazon", category: "LP: Ownership", text: "Tell me about a time you took on something significant outside your area of responsibility." },
  { company: "Amazon", category: "LP: Customer Obsession", text: "Describe a time you went above and beyond for a customer." },
  { company: "Amazon", category: "LP: Dive Deep", text: "Tell me about a time you used data to make a difficult decision." },
  { company: "Amazon", category: "DSA: Arrays", text: "Given an array of integers, return indices of the two numbers that add up to a target." },
  { company: "Amazon", category: "DSA: Trees", text: "Find the lowest common ancestor of two nodes in a binary tree." },
  // Google
  { company: "Google", category: "DSA: Graphs", text: "Given a 2D grid of '1's (land) and '0's (water), count the number of islands." },
  { company: "Google", category: "DSA: Dynamic Programming", text: "Given a string, find the length of the longest palindromic subsequence." },
  { company: "Google", category: "System Design: Scalability", text: "Design a globally distributed rate limiter." },
  // Meta
  { company: "Meta", category: "DSA: Intervals", text: "Merge all overlapping intervals and return the non-overlapping set." },
  { company: "Meta", category: "System Design", text: "Design the Facebook News Feed for 1B daily active users." },
  // Microsoft
  { company: "Microsoft", category: "DSA: Linked Lists", text: "Detect and remove a cycle from a singly linked list." },
  // Generic (company-agnostic)
  { company: null, category: "System Design: Caching", text: "Design a URL shortener that handles 100M requests per day." },
  { company: null, category: "Behavioral: Teamwork", text: "Tell me about a time you disagreed with a teammate and how you resolved it." },
  { company: null, category: "DSA: Hash Maps", text: "Given an array, find the length of the longest substring without repeating characters." },
  { company: null, category: "Behavioral: Failure", text: "Describe a project that did not go as planned. What did you learn?" },
];

async function main() {
  console.log("Seeding company templates…");
  for (const t of companyTemplates) {
    await prisma.companyInterviewTemplate.upsert({
      where: { company: t.company },
      update: { rounds: t.rounds, notes: t.notes },
      create: { company: t.company, rounds: t.rounds, notes: t.notes },
    });
  }

  console.log("Seeding question bank…");
  // clear + reinsert for idempotency
  await prisma.questionBankEntry.deleteMany();
  await prisma.questionBankEntry.createMany({ data: questionBank });

  console.log(
    `Done: ${companyTemplates.length} company templates, ${questionBank.length} questions.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
