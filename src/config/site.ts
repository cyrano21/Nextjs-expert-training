export const siteConfig = {
  name: "Next.js Expert Academy",
  description: "Devenez un expert certifié Next.js avec notre plateforme d'apprentissage interactive.",
  url: "https://nextjs-expert-academy.com",
  ogImage: "https://nextjs-expert-academy.com/og.jpg",
  links: {
    twitter: "https://twitter.com/nextjsacademy",
    github: "https://github.com/nextjs-expert-academy",
  },
  contactEmail: "contact@nextjs-expert-academy.com",
};

export const navigationConfig = {
  mainNav: [
    {
      title: "Accueil",
      href: "/",
    },
    {
      title: "Cours",
      href: "/courses",
    },
    {
      title: "Roadmap",
      href: "/student/roadmap",
    },
    {
      title: "Tarifs",
      href: "/pricing",
    },
    {
      title: "Blog",
      href: "/blog",
    },
  ],
  studentNav: [
    {
      title: "Tableau de bord",
      href: "/student/dashboard",
      icon: "dashboard",
    },
    {
      title: "Roadmap",
      href: "/student/roadmap",
      icon: "roadmap",
    },
    {
      title: "Mes cours",
      href: "/student/courses",
      icon: "courses",
    },
    {
      title: "Profil",
      href: "/student/profile",
      icon: "profile",
    },
    {
      title: "Paramètres",
      href: "/student/settings",
      icon: "settings",
    },
  ],
};
