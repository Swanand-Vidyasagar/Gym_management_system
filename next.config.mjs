/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Server-side only - allows CommonJS modules
  serverComponentsExternalPackages: ['sequelize', 'mysql2', 'pg', 'pg-hstore'],
}

export default nextConfig
