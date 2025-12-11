import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAllTestimonials } from '@/lib/api/testimonials';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.role || session.user.role !== 'admin') {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const testimonials = await getAllTestimonials();
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Error fetching all testimonials:', error);
    return NextResponse.json(
      { message: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}
