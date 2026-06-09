import SectionHeader from '@/components/ui/SectionHeader';
import type { WorkStep } from '@/types';

const DEFAULT_STEPS: WorkStep[] = [
  {
    _key: '1',
    stepNumber: 1,
    title: 'Share Your Vision',
    description:
      'Fill out the quote request form with your event details, size preferences, and any inspiration you have.',
  },
  {
    _key: '2',
    stepNumber: 2,
    title: 'Get a Custom Quote',
    description:
      "I'll reach out within 24–48 hours with pricing, timeline, and any questions about your piece.",
  },
  {
    _key: '3',
    stepNumber: 3,
    title: 'Watch It Come to Life',
    description:
      "Once you approve the design and deposit, I'll craft your sign by hand — sending progress photos along the way.",
  },
  {
    _key: '4',
    stepNumber: 4,
    title: 'Celebrate & Treasure',
    description:
      "Your finished piece arrives ready to display — a handmade keepsake that tells your story for years to come.",
  },
];

interface HowItWorksProps {
  steps?: WorkStep[];
}

export default function HowItWorks({ steps }: HowItWorksProps) {
  const displaySteps = steps?.length ? steps : DEFAULT_STEPS;

  return (
    <section className="py-24 md:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          label="The Process"
          headline="How It Works"
          subtext="From first message to finished piece — a simple, personal process made just for you."
          className="mb-16"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {displaySteps.map((step, i) => (
            <div key={step._key} className="relative">
              {/* Connector line (desktop) */}
              {i < displaySteps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-border to-transparent z-0" />
              )}

              <div className="relative z-10">
                {/* Step number */}
                <div className="w-12 h-12 rounded-full border-2 border-gold/40 flex items-center justify-center mb-5 bg-warm-white">
                  <span className="font-display text-lg text-gold">{step.stepNumber}</span>
                </div>

                <h3 className="font-display text-xl text-ink mb-3">{step.title}</h3>
                <p className="text-sm leading-relaxed text-ink-light">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
