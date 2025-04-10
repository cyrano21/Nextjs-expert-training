import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { modulesData } from '@/lib/data/modules'

export interface Lesson {
  id: string
  moduleId: string
  title: string
  description?: string
  content: string
  objectives?: string[]
  slug: string
  prevLessonUrl?: string
  nextLessonUrl?: string
  estimatedTime?: number
}

export async function getLesson(moduleId: string, lessonId: string): Promise<Lesson | null> {
  try {
    const lessonPath = path.join(
      process.cwd(), 
      'src', 
      'app', 
      'student', 
      'learn', 
      'modules', 
      moduleId, 
      `${lessonId}.mdx`
    )

    const fileContent = await fs.readFile(lessonPath, 'utf8')
    const { data, content } = matter(fileContent)

    return {
      id: lessonId,
      moduleId,
      title: typeof data.title === 'string' ? data.title : lessonId,
      description: typeof data.description === 'string' ? data.description : undefined,
      content,
      objectives: Array.isArray(data.objectives) ? data.objectives : undefined,
      slug: lessonId,
      estimatedTime: typeof data.estimatedTime === 'number' ? data.estimatedTime : undefined
    }
  } catch (error) {
    console.error(`Erreur lors du chargement de la leçon ${lessonId} du module ${moduleId}:`, error)
    return null
  }
}

export async function getLessonWithNavigation(moduleId: string, lessonId: string) {
  const module = modulesData.find(m => m.slug === moduleId)
  if (!module) return null

  const lessons = module.lessons
  const currentLessonIndex = lessons.findIndex(lesson => lesson.slug === lessonId)
  
  if (currentLessonIndex === -1) return null

  const currentLesson = await getLesson(moduleId, lessonId)
  if (!currentLesson) return null

  const prevLesson = currentLessonIndex > 0 ? lessons[currentLessonIndex - 1] : null
  const nextLesson = currentLessonIndex < lessons.length - 1 ? lessons[currentLessonIndex + 1] : null

  return {
    lesson: currentLesson,
    prevLesson: prevLesson ? {
      ...prevLesson,
      prevLessonUrl: `/student/learn/modules/${moduleId}/${prevLesson.slug}`
    } : null,
    nextLesson: nextLesson ? {
      ...nextLesson,
      nextLessonUrl: `/student/learn/modules/${moduleId}/${nextLesson.slug}`
    } : null
  }
}

export async function getLessonsList(moduleId: string): Promise<Lesson[]> {
  const module = modulesData.find(m => m.slug === moduleId)
  if (!module) return []

  const lessonPromises = module.lessons.map(async lesson => {
    const fullLesson = await getLesson(moduleId, lesson.slug)
    return fullLesson
  })

  return (await Promise.all(lessonPromises)).filter(Boolean) as Lesson[]
}
