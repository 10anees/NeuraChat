'use client';

import { FormEvent, useState } from 'react';
import { MarketingShell } from '@/components/marketing/MarketingShell';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <MarketingShell>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <section className="max-w-3xl mb-10">
          <p className="uppercase tracking-[0.2em] text-xs font-semibold mb-4" style={{ color: '#8B5E3C' }}>
            Contact
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5" style={{ color: '#3A2A20' }}>
            Tell us what your team needs.
          </h1>
          <p className="text-base sm:text-lg" style={{ color: '#6B584A' }}>
            Share a bit about your goals and we will follow up with a tailored recommendation.
          </p>
        </section>

        <section className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl p-6 sm:p-8"
            style={{ background: 'rgba(255,255,255,0.75)', border: '1px solid #E0D4C8' }}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="text-sm font-medium" style={{ color: '#3A2A20' }}>
                First Name
                <input
                  required
                  type="text"
                  name="firstName"
                  className="mt-2 w-full rounded-lg px-3 py-2"
                  style={{ background: '#fff', border: '1px solid #D1BFA7' }}
                />
              </label>
              <label className="text-sm font-medium" style={{ color: '#3A2A20' }}>
                Last Name
                <input
                  required
                  type="text"
                  name="lastName"
                  className="mt-2 w-full rounded-lg px-3 py-2"
                  style={{ background: '#fff', border: '1px solid #D1BFA7' }}
                />
              </label>
            </div>

            <label className="block text-sm font-medium mt-4" style={{ color: '#3A2A20' }}>
              Work Email
              <input
                required
                type="email"
                name="email"
                className="mt-2 w-full rounded-lg px-3 py-2"
                style={{ background: '#fff', border: '1px solid #D1BFA7' }}
              />
            </label>

            <label className="block text-sm font-medium mt-4" style={{ color: '#3A2A20' }}>
              Company
              <input
                type="text"
                name="company"
                className="mt-2 w-full rounded-lg px-3 py-2"
                style={{ background: '#fff', border: '1px solid #D1BFA7' }}
              />
            </label>

            <label className="block text-sm font-medium mt-4" style={{ color: '#3A2A20' }}>
              Message
              <textarea
                required
                name="message"
                rows={5}
                className="mt-2 w-full rounded-lg px-3 py-2"
                style={{ background: '#fff', border: '1px solid #D1BFA7' }}
              />
            </label>

            <button
              type="submit"
              className="mt-6 px-6 py-3 rounded-lg text-white font-semibold"
              style={{ background: '#6B4A2F' }}
            >
              Send Message
            </button>

            {submitted && (
              <p className="mt-4 text-sm" style={{ color: '#8B5E3C' }}>
                Thanks. Your message has been captured and we will contact you soon.
              </p>
            )}
          </form>

          <aside className="rounded-2xl p-6" style={{ background: 'rgba(209, 191, 167, 0.35)', border: '1px solid #D1BFA7' }}>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#3A2A20' }}>
              Reach us directly
            </h2>
            <p style={{ color: '#6B584A' }}>Email: neurachat@gmail.com</p>
            <p className="mt-2" style={{ color: '#6B584A' }}>Phone: (+92)3096705404 </p>
            <p className="mt-2" style={{ color: '#6B584A' }}>Office: FAST NUCES, Lahore, Pakistan</p>
          </aside>
        </section>
      </main>
    </MarketingShell>
  );
}
