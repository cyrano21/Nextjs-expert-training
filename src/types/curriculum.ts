export interface Quiz {
  question: string;
  options: string[];
  correctOption: number;
}

export interface LessonContent {
  theory: string;
  practice: string;
  quiz: Quiz[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  content: LessonContent;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  prerequisites: string[];
  outcomes: string[];
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
  author: string;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
}
