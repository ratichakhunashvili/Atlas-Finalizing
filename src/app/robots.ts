import type { MetadataRoute } from "next";

/* An interface prototype with fictional fixtures: nothing here should be crawled. */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
