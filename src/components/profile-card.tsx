import Image from "next/image";
import Link from "next/link";
import { Building2, CalendarDays, ExternalLink, type LucideIcon, MapPin, Users } from "lucide-react";
import { formatGitHubDate } from "@/lib/analyzer";
import type { GitHubUser } from "@/lib/types";

type ProfileCardProps = {
  user: GitHubUser;
};

export function ProfileCard({ user }: ProfileCardProps) {
  const website = user.blog?.trim();

  return (
    <section className="rounded-2xl border border-white/10 bg-[#10131b]/80 p-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <Image
          src={user.avatar_url || "https://avatars.githubusercontent.com/u/0?v=4"}
          alt={`${user.login} avatar`}
          width={104}
          height={104}
          className="size-24 rounded-2xl border border-white/10 bg-white/5 object-cover md:size-28"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Profile overview</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">{user.name || user.login}</h1>
              <Link href={user.html_url} className="mt-1 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
                @{user.login}
                <ExternalLink size={14} aria-hidden="true" />
              </Link>
            </div>
            <div className="flex gap-3 text-sm text-slate-300">
              <span className="rounded-lg border border-white/10 px-3 py-2">{user.public_repos} repos</span>
              <span className="rounded-lg border border-white/10 px-3 py-2">{user.followers} followers</span>
            </div>
          </div>
          {user.bio ? <p className="mt-5 max-w-3xl text-slate-300">{user.bio}</p> : null}
          <div className="mt-6 grid gap-3 text-sm text-slate-400 sm:grid-cols-2 lg:grid-cols-3">
            {user.location ? <Fact icon={MapPin} text={user.location} /> : null}
            {user.company ? <Fact icon={Building2} text={user.company} /> : null}
            {website ? (
              <Link href={website.startsWith("http") ? website : `https://${website}`} className="inline-flex items-center gap-2 hover:text-white">
                <ExternalLink size={15} aria-hidden="true" />
                Website
              </Link>
            ) : null}
            <Fact icon={Users} text={`${user.following} following`} />
            <Fact icon={CalendarDays} text={`Created ${formatGitHubDate(user.created_at)}`} />
            <Fact icon={CalendarDays} text={`Updated ${formatGitHubDate(user.updated_at)}`} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Fact({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2">
      <Icon size={15} className="shrink-0" aria-hidden="true" />
      <span className="truncate">{text}</span>
    </span>
  );
}
