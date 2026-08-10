import type { MetadataRoute } from "next";

// Block ALL crawlers site-wide. Nothing on this deployment is indexable.
// The private lab path is intentionally NOT mentioned anywhere.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
