import { useEffect, useState } from "react";
import api from '@/services/api';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star, Image as ImageIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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
  const [direction, setDirection] = useState(0);
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

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    if (newDirection === 1) {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
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

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative max-w-4xl mx-auto px-4 overflow-hidden">
      <div className="relative min-h-[400px] md:min-h-[300px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 450, damping: 45 },
              opacity: { duration: 0.15 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) > 50;
              if (swipe) {
                paginate(offset.x > 0 ? -1 : 1);
              }
            }}
            className="w-full absolute top-0 left-0 cursor-grab active:cursor-grabbing"
          >
            <Card className="bg-gradient-to-br from-card to-muted/30 border-2 shadow-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="md:flex">
                  {currentTestimonial.image?.url ? (
                    <div className="md:w-1/3 bg-muted/30 flex items-center justify-center p-6">
                      <img
                        src={currentTestimonial.image.url}
                        alt={currentTestimonial.name}
                        className="rounded-full w-32 h-32 md:w-48 md:h-48 object-cover border-4 border-primary/20 pointer-events-none"
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
                    <blockquote className="text-lg md:text-xl mb-6 italic leading-relaxed select-none">
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
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 justify-center mt-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => paginate(-1)}
          aria-label="Previous testimonial"
          disabled={testimonials.length <= 1}
          className="h-12 w-12 rounded-full shadow-md hover:bg-primary hover:text-white"
        >
          <ChevronLeft size={24} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => paginate(1)}
          aria-label="Next testimonial"
          disabled={testimonials.length <= 1}
          className="h-12 w-12 rounded-full shadow-md hover:bg-primary hover:text-white"
        >
          <ChevronRight size={24} />
        </Button>
      </div>

      {/* Dots Indicator */}
      {testimonials.length > 1 && (
        <div className="flex gap-3 justify-center mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                index === currentIndex
                  ? "w-10 bg-primary"
                  : "w-3 bg-muted hover:bg-muted-foreground/30"
              )}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TestimonialSlider;