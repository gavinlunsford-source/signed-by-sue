import { client, isSanityConfigured } from './client';
import type {
  PortfolioProject,
  PricingItem,
  PricingSettings,
  Testimonial,
  Faq,
  HomePage,
  AboutPage,
  SiteSettings,
} from '@/types';

async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T | null> {
  if (!isSanityConfigured) return null;
  return client.fetch<T>(query, params);
}

export async function getHomePage(): Promise<HomePage | null> {
  return sanityFetch<HomePage>(`*[_type == "homePage"][0]{
    _id,
    heroHeadline,
    heroSubheadline,
    heroCTA,
    heroImage,
    howItWorksSteps,
    sectionServicesHeadline,
    sectionTestimonialsHeadline,
    finalCTAHeadline,
    finalCTASubtext,
    featuredPortfolioItems[]->{
      _id, title, category, images, slug
    }
  }`);
}

export async function getPortfolioProjects(category?: string): Promise<PortfolioProject[]> {
  const filter = category
    ? `*[_type == "portfolio" && $category in categories]`
    : `*[_type == "portfolio"]`;
  const result = await sanityFetch<PortfolioProject[]>(
    `${filter} | order(date desc) { _id, title, slug, categories, images, description, clientName, date, featured }`,
    category ? { category } : {}
  );
  return result ?? [];
}

export async function getFeaturedProjects(): Promise<PortfolioProject[]> {
  const result = await sanityFetch<PortfolioProject[]>(
    `*[_type == "portfolio" && featured == true] | order(date desc)[0...6] { _id, title, slug, categories, images, description }`
  );
  return result ?? [];
}

export async function getPricing(): Promise<PricingItem[]> {
  const result = await sanityFetch<PricingItem[]>(
    `*[_type == "pricing"] | order(sortOrder asc) { _id, title, startingPrice, isCustomQuote, description, features, sortOrder }`
  );
  return result ?? [];
}

export async function getTestimonials(featuredOnly = false): Promise<Testimonial[]> {
  const filter = featuredOnly
    ? `*[_type == "testimonial" && featured == true]`
    : `*[_type == "testimonial"]`;
  const result = await sanityFetch<Testimonial[]>(
    `${filter} | order(_createdAt desc) { _id, name, role, quote, rating, photo, featured }`
  );
  return result ?? [];
}

export async function getFaqs(category?: string): Promise<Faq[]> {
  const filter = category
    ? `*[_type == "faq" && category == $category]`
    : `*[_type == "faq"]`;
  const result = await sanityFetch<Faq[]>(
    `${filter} | order(sortOrder asc) { _id, question, answer, category, sortOrder }`,
    category ? { category } : {}
  );
  return result ?? [];
}

export async function getAboutPage(): Promise<AboutPage | null> {
  return sanityFetch<AboutPage>(
    `*[_type == "aboutPage"][0]{ _id, headline, subheadline, artistName, photo, story, values, galleryImages }`
  );
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return sanityFetch<SiteSettings>(
    `*[_type == "siteSettings"][0]{ _id, businessName, tagline, email, phone, instagram, facebook, logo }`
  );
}

export async function getPricingSettings(): Promise<PricingSettings | null> {
  const raw = await sanityFetch<{
    _id: string;
    basePrice?: number;
    sizes?: Array<{ _key: string; label: string; adder: number }>;
    complexityOptions?: Array<{ _key: string; label: string; description?: string; adder: number }>;
    materialOptions?: Array<{ _key: string; label: string; adder?: number; requiresCustomQuote?: boolean }>;
    rushOptions?: Array<{ _key: string; label: string; adder: number }>;
    startingPrices?: Array<{ _key: string; label: string; price: string }>;
    exampleQuotes?: Array<{ _key: string; label: string; note?: string; total: number }>;
  }>(`*[_type == "pricingSettings"][0]{
    _id, basePrice,
    sizes[]{ _key, label, adder },
    complexityOptions[]{ _key, label, description, adder },
    materialOptions[]{ _key, label, adder, requiresCustomQuote },
    rushOptions[]{ _key, label, adder },
    startingPrices[]{ _key, label, price },
    exampleQuotes[]{ _key, label, note, total }
  }`);

  if (!raw) return null;

  return {
    _id: raw._id,
    basePrice: raw.basePrice,
    sizes: raw.sizes?.map((s) => ({ _key: s._key, label: s.label, adder: s.adder })),
    complexityOptions: raw.complexityOptions?.map((c) => ({ _key: c._key, label: c.label, description: c.description, adder: c.adder })),
    materialOptions: raw.materialOptions?.map((m) => ({ _key: m._key, label: m.label, adder: m.requiresCustomQuote ? null : (m.adder ?? 0) })),
    rushOptions: raw.rushOptions?.map((r) => ({ _key: r._key, label: r.label, adder: r.adder })),
    startingPrices: raw.startingPrices,
    exampleQuotes: raw.exampleQuotes,
  };
}
