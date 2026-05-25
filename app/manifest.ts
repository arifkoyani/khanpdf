import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KhanPDF",
    short_name: "KhanPDF",
    description: "Free online URL to PDF converter",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#f16625",
    icons: [
      {
        src: "/khanpdf_logo.jpeg",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    scope: "/",
  };
}
