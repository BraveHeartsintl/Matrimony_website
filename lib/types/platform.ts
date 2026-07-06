export interface PlatformTestimonial {
  name: string;
  location: string;
  community: string;
  image: string;
  text: string;
}

export interface PlatformRegionStat {
  city: string;
  members: number;
}

export interface PlatformStatsDisplay {
  members: string;
  matches: string;
  verified: string;
  cities: string;
  successStories: number;
}

export interface PlatformContent {
  stats: PlatformStatsDisplay;
  regions: PlatformRegionStat[];
  testimonials: PlatformTestimonial[];
}
