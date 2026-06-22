import { SessionView } from "@/components/interview/SessionView";

export const metadata = { title: "Interview session" };

export default async function InterviewSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SessionView sessionId={id} />;
}
