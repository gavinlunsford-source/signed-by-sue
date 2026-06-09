import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { getAboutPage } from '@/sanity/queries';
import { urlFor } from '@/sanity/image';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'About',
  description: 'Meet Hallie — the artist behind Signed by Sue. Handmade signs crafted with love for life\'s biggest celebrations.',
};

const DEFAULT_VALUES = [
  'Every piece is handmade, one at a time',
  'No two signs are ever identical',
  'Made for moments that deserve to last',
  'Art that tells your story',
];

const DEFAULT_STORY_PARAGRAPHS = [
  "Hi, I'm Hallie — the hands, heart, and brush behind Signed by Sue. What started as a way to make my own celebrations feel a little more personal has grown into something I never could have planned.",
  "I've always believed that the details matter. The sign at the entrance of a wedding. The board behind a graduate at their party. The mirror hanging in a nursery. These aren't just decorations — they're the things people photograph, keep, and remember long after the day has passed.",
  "I work out of my home studio, where every piece is made by hand. I don't use templates or shortcuts. Each sign is lettered, painted, and finished individually — and I take that responsibility seriously.",
  "My goal is simple: to give you something beautiful that feels completely, unmistakably yours. If you have a vision — or even just a feeling — I'd love to bring it to life.",
];

export default async function AboutPage() {
  const about = await getAboutPage().catch(() => null);

  const values = about?.values?.length ? about.values : DEFAULT_VALUES;
  const hasPhoto = about?.photo;
  const hasStory = about?.story?.length;
  const artistName = about?.artistName ?? 'Hallie';

  return (
    <div className="min-h-screen bg-warm-white pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Page header */}
        <div className="text-center mb-16">
          <p className="label-line text-xs tracking-[0.2em] uppercase text-gold mb-4">
            The Artist
          </p>
          <h1 className="font-display font-light text-5xl md:text-6xl text-ink">
            {about?.headline ?? 'The Artist Behind the Signs'}
          </h1>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-24">
          {/* Photo */}
          <div className="relative">
            {hasPhoto ? (
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-lg">
                <Image
                  src={urlFor(about!.photo!).width(800).height(1066).url()}
                  alt={`${artistName} — Signed by Sue`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="aspect-[3/4] rounded-3xl bg-gradient-to-br from-blush/60 via-cream to-rose/20 flex flex-col items-center justify-center shadow-lg">
                <span className="font-display text-[8rem] text-ink/10 italic leading-none">S</span>
                <p className="text-sm text-muted mt-4 tracking-wide">
                  {artistName}&apos;s photo coming soon
                </p>
              </div>
            )}

            {/* Values card overlay */}
            <div className="absolute -bottom-6 -right-4 lg:-right-8 bg-white rounded-2xl shadow-lg p-6 max-w-[220px]">
              <p className="text-xs text-muted tracking-widest uppercase mb-3">What I Believe</p>
              <ul className="flex flex-col gap-2">
                {values.slice(0, 3).map((value, i) => (
                  <li key={i} className="text-xs text-ink-light leading-snug flex items-start gap-2">
                    <span className="text-gold mt-0.5">✦</span>
                    {value}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Story */}
          <div className="lg:pt-8">
            <p className="label-line text-xs tracking-[0.2em] uppercase text-gold mb-6">
              My Story
            </p>

            {hasStory ? (
              <div className="prose prose-lg text-ink-light prose-headings:font-display prose-headings:font-light prose-headings:text-ink">
                <PortableText value={about!.story!} />
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {DEFAULT_STORY_PARAGRAPHS.map((para, i) => (
                  <p key={i} className={`leading-relaxed text-ink-light ${i === 0 ? 'font-display text-2xl text-ink-light italic' : 'text-base'}`}>
                    {para}
                  </p>
                ))}
              </div>
            )}

            <div className="mt-10 pt-8 border-t border-border">
              <p className="font-display text-2xl text-ink mb-1 italic">— {artistName}</p>
              <p className="text-xs text-muted tracking-wide">Signed by Sue</p>
            </div>
          </div>
        </div>

        {/* Values / beliefs */}
        <div className="bg-cream rounded-3xl p-10 md:p-14 mb-16">
          <div className="text-center mb-10">
            <h2 className="font-display font-light text-4xl text-ink">What Drives Every Piece</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div key={i} className="text-center p-6 bg-white rounded-2xl shadow-sm">
                <div className="w-10 h-10 rounded-full bg-blush flex items-center justify-center mx-auto mb-4">
                  <span className="text-rose text-sm">✦</span>
                </div>
                <p className="text-sm text-ink-light leading-snug">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Studio process sneak peek */}
        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {[
            { gradient: 'from-blush/60 to-cream', label: 'The Studio' },
            { gradient: 'from-cream to-rose/20', label: 'In Progress' },
            { gradient: 'from-sage/20 to-blush/40', label: 'Finished Pieces' },
          ].map(({ gradient, label }) => (
            <div
              key={label}
              className={`aspect-square rounded-2xl bg-gradient-to-br ${gradient} flex items-end p-5 shadow-sm`}
            >
              <span className="text-xs text-muted tracking-widest uppercase">{label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="font-display text-2xl text-ink mb-4">
            I&apos;d love to make something for you.
          </p>
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 px-8 py-4 bg-ink text-white text-sm tracking-wide rounded-full hover:bg-ink-light transition-colors"
          >
            Start a Conversation →
          </Link>
        </div>
      </div>
    </div>
  );
}
