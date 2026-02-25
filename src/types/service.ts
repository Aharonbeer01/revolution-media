export interface Service {
  slug: string;
  title: string;
  shortDescription: string;
  icon: string;
  heroDescription: string;
  challenge: string;
  approach: string[];
  includes: string[];
  isLocationRestricted?: boolean;
  locationNote?: string;
}
