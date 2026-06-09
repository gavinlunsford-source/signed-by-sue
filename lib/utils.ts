export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export const PORTFOLIO_CATEGORIES = [
  { value: 'weddings', label: 'Weddings' },
  { value: 'graduations', label: 'Graduations' },
  { value: 'missionary-farewells', label: 'Missionary Farewells' },
  { value: 'showers', label: 'Showers' },
  { value: 'birthdays', label: 'Birthdays' },
  { value: 'mirrors-glass', label: 'Mirrors & Glass' },
  { value: 'custom-artwork', label: 'Custom Artwork' },
] as const;

export const EVENT_TYPES = [
  'Wedding',
  'Graduation',
  'Missionary Farewell',
  'Bridal Shower',
  'Baby Shower',
  'Birthday & Event',
  'Mirror Sign',
  'Custom Artwork',
  'Other',
] as const;

export const SIGN_SIZES = [
  { label: 'Small (up to 24" × 36")', adder: 0 },
  { label: 'Medium (up to 36" × 48")', adder: 10 },
  { label: 'Large (up to 5\' × 3\')', adder: 20 },
] as const;

export const COMPLEXITY_OPTIONS = [
  { label: 'Basic Lettering', description: 'Clean text only', adder: 0 },
  { label: 'Decorative Elements', description: 'Simple florals or accents', adder: 10 },
  { label: 'Detailed Artwork', description: 'More involved illustrations', adder: 20 },
  { label: 'Custom Illustration', description: 'Fully custom drawn design', adder: 30 },
] as const;

export const MATERIAL_OPTIONS = [
  { label: 'Paper', adder: 0 },
  { label: 'Customer-Provided Material', adder: 0 },
  { label: 'Mirror', adder: 20 },
  { label: 'Glass', adder: 20 },
  { label: 'Special Materials', adder: null },
] as const;

export const RUSH_OPTIONS = [
  { label: 'No rush — standard timeline', adder: 0 },
  { label: 'Needed within 7 days', adder: 15 },
  { label: 'Needed within 3 days', adder: 25 },
] as const;

export const BASE_PRICE = 40;
