import Link from 'next/link';
import { MarketingShell } from '@/components/marketing/MarketingShell';

const serviceCards = [
  {
    title: 'Smart Team Messaging',
    description:
      'Channel-based and direct messaging with typing indicators, real-time updates, and message history built for velocity.',
  },
  {
    title: 'AI Workflow Assistant',
    description:
      'Draft summaries, automate repetitive replies, and surface useful context directly in conversations.',
  },
  {
    title: 'Voice and Video Calls',
    description:
      'Integrated audio and HD video calls with a low-friction handoff from chat to live collaboration.',
  },
  {
    title: 'Notification Hub',
    description:
      'Actionable alerts and call/message notifications so teams stay aligned without notification fatigue.',
  },
];

export default function ServicesPage() {
  return (
    <MarketingShell>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <section className="max-w-3xl">
          <p className="uppercase tracking-[0.2em] text-xs font-semibold mb-4" style={{ color: '#8B5E3C' }}>
            Services & Products
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5" style={{ color: '#3A2A20' }}>
            Everything needed to communicate, coordinate, and close loops.
          </h1>
          <p className="text-base sm:text-lg" style={{ color: '#6B584A' }}>
            NeuraChat combines collaboration essentials into one connected platform so your team can focus on decisions,
            not tool management.
          </p>
        </section>

        <section className="mt-10 grid md:grid-cols-2 gap-5">
          {serviceCards.map((service) => (
            <article
              key={service.title}
              className="rounded-2xl p-6"
              style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid #E0D4C8' }}
            >
              <h2 className="text-2xl font-semibold mb-3" style={{ color: '#3A2A20' }}>
                {service.title}
              </h2>
              <p style={{ color: '#6B584A' }}>{service.description}</p>
            </article>
          ))}
        </section>

        <section className="mt-12 rounded-2xl p-6 sm:p-8" style={{ background: 'rgba(209, 191, 167, 0.35)', border: '1px solid #D1BFA7' }}>
          <h3 className="text-2xl font-semibold mb-3" style={{ color: '#3A2A20' }}>
            Need a custom rollout plan?
          </h3>
          <p className="mb-6" style={{ color: '#6B584A' }}>
            We help teams migrate from fragmented communication stacks to a unified NeuraChat experience.
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 py-3 rounded-lg font-semibold text-white"
            style={{ background: '#6B4A2F' }}
          >
            Talk to our team
          </Link>
        </section>
      </main>
    </MarketingShell>
  );
}
