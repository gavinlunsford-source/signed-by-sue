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
  'Baby Shower',
  'Bridal Shower',
  'Birthday',
  'Mirror or Glass Sign',
  'Custom Artwork',
  'Other',
] as const;

export const SIGN_SIZES = [
  'Small (up to 12")',
  'Medium (12"–24")',
  'Large (24"–36")',
  'Extra Large (36"+)',
  'Not sure — I need a recommendation',
] as const;

export const MATERIALS = [
  'Wood (standard)',
  'Wood (premium/stained)',
  'Mirror or Glass',
  'Canvas',
  'Acrylic',
  'Not sure — I need a recommendation',
] as const;
