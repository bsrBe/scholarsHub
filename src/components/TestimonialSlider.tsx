

import { useEffect, useState } from "react";
import api from '@/services/api';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star, Image as ImageIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Testimonial {
  _id: string;
  name: string;
  country: string;
  university: string;
  message: string;
  rating: number;
  image?: {
    url: string;
  };
}

const TestimonialSlider = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await api.get('/testimonials');
        setTestimonials(response.data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        toast({
          title: "Error",
          description: "Failed to load testimonials. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (isLoading) {
    return (
      <div className="relative max-w-4xl mx-auto">
        <Card className="bg-gradient-to-br from-card to-muted/30 border-2 shadow-xl">
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col items-center space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-32 w-full" />
              <div className="flex flex-col items-center space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No testimonials available at the moment.</p>
      </div>
    );
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative max-w-4xl mx-auto">
      <Card className="bg-gradient-to-br from-card to-muted/30 border-2 shadow-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="md:flex">
            {currentTestimonial.image?.url ? (
              <div className="md:w-1/3 bg-muted/30 flex items-center justify-center p-6">
                <img
                  src={currentTestimonial.image.url}
                  alt={currentTestimonial.name}
                  className="rounded-full w-32 h-32 md:w-48 md:h-48 object-cover border-4 border-primary/20"
                />
              </div>
            ) : (
              <div className="md:w-1/3 bg-muted/30 flex items-center justify-center p-6">
                <div className="rounded-full w-32 h-32 md:w-48 md:h-48 bg-muted/50 flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-muted-foreground" />
                </div>
              </div>
            )}
            <div className="p-6 md:p-8 md:w-2/3">
              {/* Rating Stars */}
              <div className="flex gap-1 mb-4 justify-center md:justify-start">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={`${i < currentTestimonial.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-lg md:text-xl mb-6 italic leading-relaxed">
                "{currentTestimonial.message}"
              </blockquote>

              {/* Author Info */}
              <div className="text-center md:text-left">
                <p className="font-semibold text-lg">{currentTestimonial.name}</p>
                <p className="text-muted-foreground text-sm">
                  {currentTestimonial.university} • {currentTestimonial.country}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex gap-4 justify-center mt-6">
        <Button
          variant="outline"
          size="icon"
          onClick={prevTestimonial}
          aria-label="Previous testimonial"
          disabled={testimonials.length <= 1}
        >
          <ChevronLeft size={20} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={nextTestimonial}
          aria-label="Next testimonial"
          disabled={testimonials.length <= 1}
        >
          <ChevronRight size={20} />
        </Button>
      </div>

      {/* Dots Indicator */}
      {testimonials.length > 1 && (
        <div className="flex gap-2 justify-center mt-4">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? "bg-primary w-8" : "bg-muted"
                }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TestimonialSlider;