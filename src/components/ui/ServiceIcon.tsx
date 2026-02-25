interface ServiceIconProps {
  slug: string;
  className?: string;
}

export function ServiceIcon({ slug, className = "h-8 w-8" }: ServiceIconProps) {
  const props = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };

  switch (slug) {
    // Marketing Strategy - Compass icon
    case "marketing-strategy":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <polygon
            points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={1.5}
          />
        </svg>
      );

    // Google Ads - Magnifying glass / search icon
    case "google-ads":
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" />
          <line x1="8" y1="11" x2="14" y2="11" />
          <line x1="11" y1="8" x2="11" y2="14" />
        </svg>
      );

    // Meta Ads - Target / bullseye icon
    case "meta-ads":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
          <line x1="12" y1="2" x2="12" y2="4" />
          <line x1="12" y1="20" x2="12" y2="22" />
          <line x1="2" y1="12" x2="4" y2="12" />
          <line x1="20" y1="12" x2="22" y2="12" />
        </svg>
      );

    // TikTok Ads - Music note with trending arrow
    case "tiktok-ads":
      return (
        <svg {...props}>
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      );

    // Social Media Management - Chat bubbles icon
    case "social-media-management":
      return (
        <svg {...props}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <line x1="8" y1="8" x2="16" y2="8" />
          <line x1="8" y1="12" x2="13" y2="12" />
        </svg>
      );

    // Content Creation - Video camera / film icon
    case "content-creation":
      return (
        <svg {...props}>
          <rect x="2" y="6" width="14" height="12" rx="2" ry="2" />
          <polyline points="16,10.4 22,7 22,17 16,13.6" />
        </svg>
      );

    // Photography - Camera icon
    case "photography":
      return (
        <svg {...props}>
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      );

    // Copywriting - Pen / pencil icon
    case "copywriting":
      return (
        <svg {...props}>
          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          <line x1="15" y1="5" x2="19" y2="9" />
        </svg>
      );

    // SEO & Google Business Profile - Map pin / location icon
    case "seo-google-business-profile":
      return (
        <svg {...props}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );

    // Email Marketing - Envelope / mail icon
    case "email-marketing":
      return (
        <svg {...props}>
          <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
          <polyline points="22,4 12,13 2,4" />
        </svg>
      );

    // Fallback - generic star/sparkle icon
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      );
  }
}
