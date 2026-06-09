import Link from 'next/link';
import SectionHeader from '@/components/ui/SectionHeader';

const SERVICES = [
  {
    icon: '💍',
    title: 'Weddings',
    description: 'Welcome signs, seating charts, bar menus, vow signs, and everything in between. Custom artwork to make your wedding day feel like you.',
    href: '/portfolio?category=weddings',
    from: '$40',
  },
  {
    icon: '🎓',
    title: 'Graduations',
    description: 'Celebrate the milestone. Personalized signs featuring names, schools, and all the details that make this achievement uniquely theirs.',
    href: '/portfolio?category=graduations',
    from: '$40',
  },
  {
    icon: '✈️',
    title: 'Missionary Farewells',
    description: 'Honor the sacrifice. Beautiful signs to send off missionaries and service members with love and pride from their communities.',
    href: '/portfolio?category=missionary-farewells',
    from: '$40',
  },
  {
    icon: '🌸',
    title: 'Showers',
    description: 'Baby showers, bridal showers, and everything in between. Soft, beautiful signs that match your celebration\'s aesthetic perfectly.',
    href: '/portfolio?category=showers',
    from: '$40',
  },
  {
    icon: '🎂',
    title: 'Birthdays',
    description: 'From milestone 1sts to meaningful 100ths. Custom birthday signs that make the guest of honor feel truly celebrated.',
    href: '/portfolio?category=birthdays',
    from: '$40',
  },
  {
    icon: '🪞',
    title: 'Mirrors & Glass',
    description: 'A favorite finish. Hand-lettered mirrors for weddings, nurseries, and home décor that become cherished keepsakes.',
    href: '/portfolio?category=mirrors-glass',
    from: '$60',
  },
];

export default function Services({ headline = 'Something Beautiful for Every Occasion' }: { headline?: string }) {
  return (
    <section className="py-24 md:py-32 bg-warm-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          label="Services"
          headline={headline}
          subtext="Whether it's the biggest day of your life or a quiet backyard gathering, every celebration deserves something handmade."
          className="mb-16"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className="group p-7 rounded-2xl border border-border hover:border-gold/40 hover:shadow-lg transition-all duration-300 bg-white"
            >
              <div className="text-3xl mb-4">{service.icon}</div>
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-display text-2xl text-ink">{service.title}</h3>
                <span className="text-xs text-muted bg-cream px-2 py-1 rounded-full shrink-0 ml-2 mt-1">
                  From {service.from}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-ink-light">
                {service.description}
              </p>
              <div className="mt-5 text-xs text-gold tracking-wide group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                See Examples →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
