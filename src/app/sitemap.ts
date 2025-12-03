import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    // HOME — halaman publik utama
    {
      url: "https://neurofit-one.vercel.app/",
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },

    // LOGIN — halaman publik, tapi tidak penting untuk SEO
    {
      url: "https://neurofit-one.vercel.app/login",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.2,
    },

    // FORM DATA DIRI — halaman private user
    {
      url: "https://neurofit-one.vercel.app/FormIsiDataDiri",
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.1,
    },

    // MEALS — private user
    {
      url: "https://neurofit-one.vercel.app/meals",
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.5,
    },

    // FITNESS — private user
    {
      url: "https://neurofit-one.vercel.app/fitnes",
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.5,
    },

    // DASHBOARD PROFILE / HOME PRIVATE
    {
      url: "https://neurofit-one.vercel.app/home",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.4,
    },
  ];
}
