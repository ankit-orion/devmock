import { Scorecard } from "@/components/results/Scorecard";

export const metadata = { title: "Scorecard" };

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <Scorecard sessionId={id} />;
}
