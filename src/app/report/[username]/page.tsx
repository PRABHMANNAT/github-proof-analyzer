import { redirect } from "next/navigation";

export default async function ReportPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  redirect(`/analyze?username=${encodeURIComponent(username)}#report`);
}
