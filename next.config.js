/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Paramètres pour résoudre les problèmes de verrouillage de fichiers
  onDemandEntries: {
    // période (en ms) où le serveur attendra avant de disposer d'une page
    maxInactiveAge: 60 * 1000,
    // nombre de pages à conserver dans la mémoire
    pagesBufferLength: 5,
  },
  
  // Désactiver le middleware temporairement pour tester
  skipMiddlewareUrlNormalize: true,
  
  // Évitez les problèmes de verrouillage de fichiers
  webpack: (config, { isServer }) => {
    // Optimisations pour éviter les problèmes de verrouillage
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
      ignored: ['**/node_modules', '**/.git']
    };
    
    return config;
  },
};

module.exports = nextConfig;
