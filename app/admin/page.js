import Link from "next/link";

const cards = [
  { href: "/admin/projects", title: "Projects", desc: "Create, edit, delete portfolio projects." },
  { href: "/admin/profile", title: "Profile", desc: "Name, tagline, bio, avatar, social links." },
  { href: "/admin/techstack", title: "Tech stack", desc: "Skills with category and icon URL." },
  { href: "/admin/experience", title: "Experience", desc: "Roles, companies, timeline entries." },
];

export default function AdminHomePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Overview</h1>
      <p className="mt-1 text-muted-foreground">
        Choose a section to edit. Images can go through Cloudinary via upload on project & profile.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <li key={c.href}>
            <Link
              href={c.href}
              className="block rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md"
            >
              <h2 className="font-semibold text-foreground">{c.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
