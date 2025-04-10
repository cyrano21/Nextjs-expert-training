import { cache } from "react";
import * as path from "path";
import * as fs from "fs/promises";
import { z } from "zod";
import matter from "gray-matter";

// Local icon type with explicit function signature
type IconType = (props: { className?: string }) => React.ReactNode;

// Define CourseObjective interface without circular references
export interface CourseObjective {
  id: string;
  title: string;
  description: string;
}

// Zod schemas for type validation
const CourseObjectiveSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
  })
  .transform((obj): CourseObjective => {
    // Explicitly type the transform function's return value
    return {
      id: obj.id,
      title: obj.title,
      description: obj.description,
    };
  });

// Utility function to validate and use CourseObjectiveSchema
export function validateCourseObjective(objective: unknown): CourseObjective {
  return CourseObjectiveSchema.parse(objective);
}

const CourseLearningPathSchema = z.object({
  id: z.string(),
  title: z.string(),
  moduleId: z.string(),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  description: z.string(),
  estimatedDuration: z.object({
    min: z.number(),
    max: z.number(),
  }),
  generalObjective: z.string(),
  learningStructure: z.string(),
  modules: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      moduleId: z.string(),
      duration: z.string(),
      objective: z.string(),
      lessons: z.array(
        z.object({
          id: z.string(),
          moduleId: z.string(),
          title: z.string(),
          description: z.string().optional(),
          interactiveActivities: z.array(z.string()).optional(),
          challengeProject: z.string().optional(),
        })
      ),
    })
  ),
  crossCuttingElements: z
    .object({
      gamification: z.boolean(),
      aiMentor: z.boolean(),
      communitySupport: z.boolean(),
      spacedRepetition: z.boolean(),
    })
    .optional(),
});

const CourseMetadataSchema = z.object({
  id: z.string(),
  title: z.string(),
  moduleId: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  estimatedTimeMinutes: z.number(),
  objectives: z.array(z.string()),
  icon: z.string().optional(),
  learningPath: CourseLearningPathSchema.optional(),
});

// Explicitly export types for Zod schemas
export type CourseLearningPath = z.infer<typeof CourseLearningPathSchema>;
export type CourseMetadata = z.infer<typeof CourseMetadataSchema>;

// Utility function to create an icon placeholder (kept for potential future use)
const createIconPlaceholder = (): IconType => {
  return ({ className }) => {
    // Explicitly use className to prevent lint warning
    return className ? null : null;
  };
};

// Utility function to demonstrate icon placeholder usage
export function getDemoIcon(): IconType {
  return createIconPlaceholder();
}

// Server-side only utility function to read file contents
export async function readFileContents(fullPath: string): Promise<string> {
  try {
    return await fs.readFile(fullPath, "utf-8");
  } catch (error) {
    console.error(`Error reading file ${fullPath}:`, error);
    return "";
  }
}

// Utility function to get the courses directory
export function getCoursesDirectory(): string {
  const baseDir = process.cwd();
  const coursesDir = path.resolve(
    baseDir,
    "content",
    "courses",
    "nextjs-beginner"
  );

  return coursesDir;
}

// Utility function to parse frontmatter
async function parseFrontmatter(content: string): Promise<{
  id?: string;
  title?: string;
  description?: string;
  tags?: string[];
  estimatedTimeMinutes?: number;
  objectives?: string[];
  module?: string;
}> {
  try {
    const parsed = matter(content);
    return parsed.data;
  } catch (error) {
    console.error("Error parsing frontmatter:", error);
    return {};
  }
}

// Server-side only utility function to read directory contents
export async function readDirectoryContents(
  directory: string
): Promise<string[]> {
  try {
    const items = await fs.readdir(directory);
    const directories = [];

    for (const item of items) {
      const fullPath = path.join(directory, item);

      try {
        const stat = await fs.stat(fullPath);

        if (
          stat.isDirectory() &&
          !item.startsWith(".") &&
          item !== "node_modules" &&
          /^module-\d+$/.test(item)
        ) {
          directories.push(item);
        }
      } catch (statError) {
        console.error(`Error checking ${item}:`, statError);
      }
    }

    return directories;
  } catch (error) {
    console.error("Error reading directory contents:", error);
    return [];
  }
}

// Function to read course data from files
export async function readCourseData(
  baseDir: string = getCoursesDirectory()
): Promise<CourseMetadata[]> {
  try {
    // Use baseDir if it's different from the default courses directory
    const coursesDirectory =
      baseDir !== getCoursesDirectory() ? baseDir : getCoursesDirectory();
    const moduleDirectories = await readDirectoryContents(coursesDirectory);

    const courses: CourseMetadata[] = [];

    for (const moduleDir of moduleDirectories) {
      const modulePath = path.join(coursesDirectory, moduleDir);
      const fileNames = await fs.readdir(modulePath);

      for (const fileName of fileNames) {
        if (fileName.endsWith(".mdx")) {
          const moduleId = fileName.replace(/\.mdx$/, "");
          const fullPath = path.join(modulePath, fileName);

          const fileContents = await readFileContents(fullPath);
          const data = await parseFrontmatter(fileContents);

          const courseMetadata: CourseMetadata = {
            id: String(data.id || moduleId),
            title: String(data.title || moduleId),
            moduleId,
            description: String(data.description || ""),
            tags: Array.isArray(data.tags) ? data.tags : [],
            level: "Beginner",
            estimatedTimeMinutes: Number(data.estimatedTimeMinutes || 0),
            objectives: Array.isArray(data.objectives) ? data.objectives : [],
            icon: "default-icon", // Using a string identifier instead of a function
            learningPath: {
              id: "nextjs-beginner-path",
              title: "Next.js Beginner Path",
              moduleId: "nextjs-beginner",
              level: "Beginner",
              description:
                "Un parcours complet pour les débutants souhaitant maîtriser Next.js et React",
              estimatedDuration: { min: 4, max: 6 },
              generalObjective:
                "Comprendre les concepts fondamentaux de React et Next.js",
              learningStructure: "Parcours composé de modules thématiques",
              modules: [
                {
                  id: "module-1",
                  title: "Bienvenue dans l'Écosystème Web & Next.js",
                  moduleId: "web-nextjs-ecosystem",
                  duration: "Semaine 1",
                  objective: "Démystifier le développement web moderne",
                  lessons: [
                    {
                      id: "01-introduction",
                      moduleId: "introduction",
                      title: "Qu'est-ce que Next.js ?",
                      description: "Pourquoi l'utiliser ? Setup initial",
                    },
                  ],
                },
              ],
              crossCuttingElements: {
                gamification: true,
                aiMentor: true,
                communitySupport: true,
                spacedRepetition: true,
              },
            },
          };

          const validatedCourse = CourseMetadataSchema.parse(courseMetadata);
          courses.push(validatedCourse);
        }
      }
    }

    return courses;
  } catch (error) {
    console.error("Error reading courses directory:", error);
    return [];
  }
}

// Cached version of readCourseData
export const getCourses = cache(readCourseData);

// Cached version of getAllCourses to improve performance
export const getAllCourses = async () => {
  console.log("📁 Courses Directory:", getCoursesDirectory());

  try {
    const courses = await getCourses();
    console.log("📚 Courses retrieved:", courses.length);
    console.log("📋 Course Details:", JSON.stringify(courses, null, 2));

    return courses;
  } catch (error) {
    console.error("Error retrieving courses:", error);
    return [];
  }
};

// Cached version of getCourseBySlug to improve performance
export const getCourseBySlug = cache(
  async (
    moduleId: string
  ): Promise<{ metadata: CourseMetadata; content: string } | null> => {
    const coursesDirectory = getCoursesDirectory();

    try {
      const moduleDirectories = await readDirectoryContents(coursesDirectory);

      for (const moduleDir of moduleDirectories) {
        const fullPath = path.join(coursesDirectory, moduleDir, `${moduleId}.mdx`);

        // Check if file exists
        try {
          await fs.access(fullPath);
        } catch {
          continue; // File doesn't exist in this module, try next
        }

        const fileContents = await readFileContents(fullPath);
        const { data, content } = matter(fileContents);

        const courseMetadata: CourseMetadata = {
          id: String(data.id || moduleId),
          title: String(data.title || moduleId),
          moduleId,
          description: String(data.description || ""),
          tags: Array.isArray(data.tags) ? data.tags : [],
          level: "Beginner",
          estimatedTimeMinutes: Number(data.estimatedTimeMinutes || 0),
          objectives: Array.isArray(data.objectives) ? data.objectives : [],
          icon: "default-icon", // Using a string identifier instead of a function
          learningPath: {
            id: "nextjs-beginner-path",
            title: "Next.js Beginner Path",
            moduleId: "nextjs-beginner",
            level: "Beginner",
            description:
              "Un parcours complet pour les débutants souhaitant maîtriser Next.js et React",
            estimatedDuration: { min: 4, max: 6 },
            generalObjective:
              "Comprendre les concepts fondamentaux de React et Next.js",
            learningStructure: "Parcours composé de modules thématiques",
            modules: [
              {
                id: "module-1",
                title: "Bienvenue dans l'Écosystème Web & Next.js",
                moduleId: "web-nextjs-ecosystem",
                duration: "Semaine 1",
                objective: "Démystifier le développement web moderne",
                lessons: [
                  {
                    id: "01-introduction",
                    moduleId: "introduction",
                    title: "Qu'est-ce que Next.js ?",
                    description: "Pourquoi l'utiliser ? Setup initial",
                  },
                ],
              },
            ],
            crossCuttingElements: {
              gamification: true,
              aiMentor: true,
              communitySupport: true,
              spacedRepetition: true,
            },
          },
        };

        const validatedCourse = CourseMetadataSchema.parse(courseMetadata);

        return {
          metadata: validatedCourse,
          content: content,
        };
      }

      return null;
    } catch (error) {
      console.error("Error retrieving course by moduleId:", error);
      return null;
    }
  }
);
