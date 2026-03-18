import { MarketingShell } from '@/components/marketing/MarketingShell';

const teamMembers = [
  {
    name: 'Qatada',
    role: 'Chief Executive Officer (CEO)',
    bio: 'Company vision, investor relations, strategic partnerships, product roadmap leadership, final decision-making authority, stakeholder communication.',
  },
  {
    name: 'Saad Zafar',
    role: 'Chief Technical Officer (CTO)',
    bio: 'System architecture design, backend development, AI integration oversight, code review, technical hiring, DevOps and infrastructure management.',
  },
  {
    name: 'Anees Hamid',
    role: 'Chief Operations Officer (COO)',
    bio: 'Day-to-day operations, project management, sprint planning, team coordination, customer support oversight, vendor management, process optimization.',
  },
  {
    name: 'Muhammad Ezaan',
    role: 'Chief Finance Officer (CFO)',
    bio: 'Financial planning and budgeting, investor reporting, marketing strategy and campaigns, social media, brand identity, revenue tracking.',
  },
];

export default function AboutPage() {
  return (
    <MarketingShell>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <section className="max-w-3xl">
          <p className="uppercase tracking-[0.2em] text-xs font-semibold mb-4" style={{ color: '#8B5E3C' }}>
            About Us
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5" style={{ color: '#3A2A20' }}>
            We are building communication software for teams that move fast.
          </h1>
          <p className="text-base sm:text-lg" style={{ color: '#6B584A' }}>
            Our mission is simple: make high-quality collaboration tools accessible, dependable, and delightful for modern organizations.
          </p>
        </section>

        <section className="mt-10 grid sm:grid-cols-2 gap-5">
          {teamMembers.map((member) => (
            <article
              key={member.name}
              className="rounded-2xl p-6"
              style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid #E0D4C8' }}
            >
              <h2 className="text-2xl font-semibold" style={{ color: '#3A2A20' }}>
                {member.name}
              </h2>
              <p className="mt-1 text-sm font-medium" style={{ color: '#8B5E3C' }}>
                {member.role}
              </p>
              <p className="mt-4" style={{ color: '#6B584A' }}>
                {member.bio}
              </p>
            </article>
          ))}
        </section>
      </main>
    </MarketingShell>
  );
}
