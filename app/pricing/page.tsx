'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/AppShell';

const tiers = [
  {
    name: 'Starter',
    id: 'starter',
    price: 'Free',
    description: 'Perfect for small hackathons with up to 50 participants.',
    features: [
      'Up to 50 participants',
      '1 active hackathon',
      'Basic voting system (Elo-based)',
      'Project submission',
      'Leaderboard',
      'Email support',
    ],
    notIncluded: [
      'AI-powered features',
      'Custom branding',
      'Advanced analytics',
      'Priority support',
    ],
    cta: 'Get Started',
    href: '/submit',
    highlighted: false,
  },
  {
    name: 'Pro',
    id: 'pro',
    price: '$49',
    description: 'For medium-sized hackathons with AI features and analytics.',
    features: [
      'Up to 200 participants',
      '5 active hackathons',
      'Advanced voting system (Elo + pairwise)',
      'AI-generated pitches',
      'AI judge feedback',
      'AI event summaries',
      'QR code sharing',
      'Custom branding',
      'Advanced analytics dashboard',
      'Email & chat support',
    ],
    notIncluded: [
      'White-label solution',
      'Dedicated account manager',
    ],
    cta: 'Start Pro Trial',
    href: '/submit?plan=pro',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    id: 'enterprise',
    price: 'Custom',
    description: 'For large organizations with custom requirements.',
    features: [
      'Unlimited participants',
      'Unlimited hackathons',
      'All Pro features',
      'White-label solution',
      'Custom domain',
      'Webhook integrations',
      'SSO / SAML authentication',
      'Dedicated account manager',
      'SLA guarantee',
      'Custom development',
    ],
    notIncluded: [],
    cta: 'Contact Sales',
    href: 'mailto:hello@hackathon.dev?subject=Enterprise%20Inquiry',
    highlighted: false,
  },
];

const faqs = [
  {
    q: 'Can I switch plans later?',
    a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.',
  },
  {
    q: 'Is there a free trial for Pro?',
    a: 'Yes! Pro comes with a 14-day free trial. No credit card required to start.',
  },
  {
    q: 'What happens if I exceed my participant limit?',
    a: "We'll notify you when you approach your limit. You can upgrade to accommodate more participants.",
  },
  {
    q: 'Can I use my own domain?',
    a: 'Pro and Enterprise plans support custom domains. Starter plans use the default hackathon.dev subdomain.',
  },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <AppShell
      title="💰 Pricing"
      subtitle="Simple, transparent pricing for every hackathon"
    >
      {/* Hero text */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="text-[var(--muted-foreground)] text-lg">
          Run hackathons of any size. Start free, scale as you grow.
        </p>
      </div>

      {/* Tier cards */}
      <div className="grid gap-6 lg:grid-cols-3 mb-16">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`rounded-2xl border p-6 flex flex-col ${
              tier.highlighted
                ? 'border-[var(--primary)] bg-white shadow-lg shadow-[var(--primary)]/10 relative'
                : 'border-[var(--border)] bg-white'
            }`}
          >
            {tier.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--primary)] text-white text-xs font-bold shadow-sm">
                  ⭐ Most Popular
                </span>
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'var(--font-display)' }}>
                {tier.name}
              </h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-[var(--foreground)]">{tier.price}</span>
                {tier.price !== 'Free' && tier.price !== 'Custom' && (
                  <span className="text-[var(--muted-foreground)]">/event</span>
                )}
              </div>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">{tier.description}</p>
            </div>

            <Link
              href={tier.href}
              className={`mt-6 w-full rounded-xl px-5 py-3 text-sm font-semibold text-center transition-all ${
                tier.highlighted
                  ? 'bg-[var(--primary)] text-white hover:opacity-90 shadow-sm'
                  : 'border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]'
              }`}
            >
              {tier.cta}
            </Link>

            <div className="mt-6 flex-1">
              <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide mb-3">
                What&apos;s included
              </p>
              <ul className="space-y-2">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <svg className="w-4 h-4 text-[var(--success)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-[var(--foreground)]">{feature}</span>
                  </li>
                ))}
                {tier.notIncluded.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm opacity-50">
                    <svg className="w-4 h-4 text-[var(--muted-foreground)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                    <span className="text-[var(--muted-foreground)] line-through">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Feature comparison table */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-[var(--foreground)] text-center mb-8" style={{ fontFamily: 'var(--font-display)' }}>
          Feature Comparison
        </h2>
        <div className="rounded-xl border border-[var(--border)] bg-white overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--muted)] border-b border-[var(--border)]">
                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--muted-foreground)]">
                  Feature
                </th>
                <th className="text-center px-4 py-4 text-sm font-semibold text-[var(--muted-foreground)]">Starter</th>
                <th className="text-center px-4 py-4 text-sm font-semibold text-[var(--primary)]">Pro</th>
                <th className="text-center px-4 py-4 text-sm font-semibold text-[var(--muted-foreground)]">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {[
                ['Participants', '50', '200', 'Unlimited'],
                ['Active hackathons', '1', '5', 'Unlimited'],
                ['AI pitch generator', '—', '✅', '✅'],
                ['AI judge feedback', '—', '✅', '✅'],
                ['AI event summary', '—', '✅', '✅'],
                ['Custom branding', '—', '✅', '✅'],
                ['QR codes', '✅', '✅', '✅'],
                ['Analytics dashboard', 'Basic', 'Advanced', 'Advanced'],
                ['Custom domain', '—', '✅', '✅'],
                ['SSO / SAML', '—', '—', '✅'],
                ['Webhook integrations', '—', '—', '✅'],
                ['Priority support', '—', '✅', '✅'],
                ['Dedicated account manager', '—', '—', '✅'],
              ].map(([feature, starter, pro, enterprise]) => (
                <tr key={feature as string} className="hover:bg-[var(--muted)]/30 transition-colors">
                  <td className="px-6 py-3.5 text-sm text-[var(--foreground)] font-medium">{feature as string}</td>
                  <td className="px-4 py-3.5 text-center text-sm text-[var(--muted-foreground)]">{starter as string}</td>
                  <td className="px-4 py-3.5 text-center text-sm font-semibold text-[var(--primary)]">{pro as string}</td>
                  <td className="px-4 py-3.5 text-center text-sm text-[var(--muted-foreground)]">{enterprise as string}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-[var(--foreground)] text-center mb-8" style={{ fontFamily: 'var(--font-display)' }}>
          Frequently Asked Questions
        </h2>
        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-xl border border-[var(--border)] overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between px-6 py-4 text-left bg-white hover:bg-[var(--muted)]/30 transition-colors"
              >
                <span className="text-sm font-semibold text-[var(--foreground)]">{faq.q}</span>
                <svg
                  className={`w-4 h-4 text-[var(--muted-foreground)] flex-shrink-0 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-4 bg-white">
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl bg-[var(--primary)] p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          Ready to run your hackathon?
        </h2>
        <p className="text-white/80 mb-6">
          Start for free — no credit card required.
        </p>
        <Link
          href="/submit"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[var(--primary)] hover:opacity-90 transition-opacity"
        >
          Get Started Free
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </AppShell>
  );
}
