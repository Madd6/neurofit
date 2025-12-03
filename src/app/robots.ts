import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/login", "/FormIsiDataDiri", "/meals", "/fitnes", "/profil"], // halaman privat
      },
    ],
    sitemap: "https://neurofit-one.vercel.app/sitemap.xml",
  };
}
