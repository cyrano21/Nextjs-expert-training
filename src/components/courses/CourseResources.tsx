import React from "react";
import { ExternalLink, FileText, Globe, Youtube } from "lucide-react";

interface Resource {
  title: string;
  description: string;
  type: "documentation" | "tutorial" | "video" | "article";
  url: string;
}

interface CourseResourcesProps {
  courseSlug: string;
}

const CourseResources: React.FC<CourseResourcesProps> = ({ courseSlug }) => {
  // Ressources simulées pour les cours - Dans un vrai environnement, vous pourriez les récupérer d'une API
  const courseResources: Record<string, Resource[]> = {
    "01-introduction": [
      {
        title: "Documentation officielle de Next.js",
        description: "La référence complète pour apprendre Next.js",
        type: "documentation",
        url: "https://nextjs.org/docs",
      },
      {
        title: "Tutoriel Next.js",
        description: "Un guide étape par étape pour construire une application",
        type: "tutorial",
        url: "https://nextjs.org/learn",
      },
      {
        title: "Introduction à Next.js (Vidéo)",
        description: "Une vidéo d&apos;introduction au framework Next.js",
        type: "video",
        url: "https://www.youtube.com/watch?v=_8wkKL0LKks",
      },
    ],
    default: [
      {
        title: "Documentation Next.js",
        description: "La référence officielle de Next.js",
        type: "documentation",
        url: "https://nextjs.org/docs",
      },
      {
        title: "MDN Web Docs",
        description: "Ressources pour les développeurs web",
        type: "documentation",
        url: "https://developer.mozilla.org/fr/",
      },
    ],
  };

  const resources = courseResources[courseSlug] || courseResources["default"];

  // Icônes pour les types de ressources
  const resourceIcons = {
    documentation: <Globe className="h-5 w-5" />,
    tutorial: <FileText className="h-5 w-5" />,
    video: <Youtube className="h-5 w-5" />,
    article: <FileText className="h-5 w-5" />,
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Ressources complémentaires</h2>

      {resources.length > 0 ? (
        <div className="space-y-4">
          {resources.map((resource, index) => (
            <a
              key={index}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 mr-4">
                {resourceIcons[resource.type]}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{resource.title}</h3>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {resource.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          Aucune ressource disponible pour ce cours.
        </p>
      )}

      <div className="mt-6 pt-6 border-t">
        <h3 className="text-lg font-medium mb-3">
          Vous avez besoin d&apos;aide ?
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Si vous avez des questions ou rencontrez des difficultés,
          n&apos;hésitez pas à utiliser les ressources suivantes :
        </p>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center">
            <span className="bg-primary/10 p-1 rounded-full mr-2">
              <FileText className="h-4 w-4" />
            </span>
            <span>
              Consultez notre{" "}
              <a href="#" className="text-primary hover:underline">
                FAQ
              </a>
            </span>
          </li>
          <li className="flex items-center">
            <span className="bg-primary/10 p-1 rounded-full mr-2">
              <Globe className="h-4 w-4" />
            </span>
            <span>
              Rejoignez notre{" "}
              <a href="#" className="text-primary hover:underline">
                forum d&apos;entraide
              </a>
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CourseResources;
