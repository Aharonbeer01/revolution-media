export interface CaseStudyMetric {
  label: string;
  value: string;
  prefix?: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  propertyType: string;
  location: string;
  tags: string[];
  heroImage: string;
  metrics: CaseStudyMetric[];
  problem: string;
  strategy: string;
  execution: string;
  results: string;
  relatedServices?: string[];
  relatedCaseStudies?: string[];
}
