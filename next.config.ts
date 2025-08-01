import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // This is to prevent the build from failing due to optional dependencies.
    config.externals.push('@opentelemetry/exporter-jaeger');
    config.externals.push('@genkit-ai/firebase');
    return config;
  },
};

export default nextConfig;
