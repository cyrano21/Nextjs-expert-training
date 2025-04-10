import { NextResponse } from 'next/server';
import { getAllCourses } from '@/lib/data/courses';

export async function GET() {
  try {
    // Fetch all courses
    const courses = await getAllCourses();
    
    console.log('🚀 API Route Courses:', courses);
    
    return NextResponse.json(courses, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error) {
    console.error('❌ Error in courses API route:', error);
    
    return NextResponse.json(
      { message: 'Failed to fetch courses', error: String(error) }, 
      { status: 500 }
    );
  }
}
