import type { NextConfig } from "next";

<<<<<<< HEAD
const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...(supabaseHostname
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHostname,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
    ],
  },
=======
const nextConfig: NextConfig = {
  /* config options here */
>>>>>>> aee5cace0a3729fe7528f70e855b8a40f488de50
};

export default nextConfig;
