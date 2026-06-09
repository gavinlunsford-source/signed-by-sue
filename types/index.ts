export interface PortfolioProject {
  _id: string;
  _type: 'portfolio';
  title: string;
  slug: { current: string };
  category: PortfolioCategory;
  images: SanityImage[];
  description?: string;
  clientName?: string;
  date?: string;
  featured?: boolean;
}

export type PortfolioCategory =
  | 'weddings'
  | 'graduations'
  | 'missionary-farewells'
  | 'showers'
  | 'birthdays'
  | 'mirrors-glass'
  | 'custom-artwork';

export interface PricingItem {
  _id: string;
  _type: 'pricing';
  title: string;
  category?: string;
  startingPrice?: number;
  priceLabel?: string;
  description?: string;
  features?: string[];
  isCustomQuote?: boolean;
  sortOrder?: number;
}

export interface Testimonial {
  _id: string;
  _type: 'testimonial';
  name: string;
  role?: string;
  quote: string;
  rating?: number;
  photo?: SanityImage;
  featured?: boolean;
}

export interface Faq {
  _id: string;
  _type: 'faq';
  question: string;
  answer: PortableTextBlock[];
  category?: string;
  sortOrder?: number;
}

export interface HomePage {
  _id: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  heroCTA?: string;
  howItWorksSteps?: WorkStep[];
  featuredPortfolioItems?: PortfolioProject[];
  sectionServicesHeadline?: string;
  sectionTestimonialsHeadline?: string;
  finalCTAHeadline?: string;
  finalCTASubtext?: string;
}

export interface WorkStep {
  _key: string;
  title: string;
  description: string;
  stepNumber: number;
}

export interface AboutPage {
  _id: string;
  headline?: string;
  subheadline?: string;
  story?: PortableTextBlock[];
  photo?: SanityImage;
  artistName?: string;
  values?: string[];
}

export interface SiteSettings {
  _id: string;
  businessName?: string;
  tagline?: string;
  email?: string;
  phone?: string;
  instagram?: string;
  facebook?: string;
}

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

export type PortableTextBlock = {
  _type: string;
  _key: string;
  [key: string]: unknown;
};
