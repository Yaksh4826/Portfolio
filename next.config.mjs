/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "comicbook.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.worldvectorlogo.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
