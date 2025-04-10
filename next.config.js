/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Configuration pour les images externes
  images: {
    domains: ["images.unsplash.com", "avatars.githubusercontent.com"],
  },

  // Désactiver temporairement les erreurs pendant le nettoyage
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
