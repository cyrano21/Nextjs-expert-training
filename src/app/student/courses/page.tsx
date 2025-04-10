import { getAllCourses } from '@/lib/data/courses';
import { CourseCard } from '@/components/courses/CourseCard';
import { PageHeader } from '@/components/page-header';

export const metadata = {
  title: 'My Courses',
  description: 'Explore your learning journey'
};

export default async function CoursesPage() {
  const courses = await getAllCourses();

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Your Courses" 
        description="Explore and continue your learning journey" 
      />

      {courses.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No courses available at the moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard 
              key={course.moduleId} 
              course={course} 
              progress={50} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
