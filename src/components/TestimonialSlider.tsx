import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { testimonials } from "@/lib/constants";

const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative max-w-4xl mx-auto">
      <Card className="bg-gradient-to-br from-card to-muted/30 border-2 shadow-xl">
        <CardContent className="p-8 md:p-12">
          {/* Rating Stars */}
          <div className="flex gap-1 mb-4 justify-center">
            {[...Array(currentTestimonial.rating)].map((_, i) => (
              <Star key={i} size={20} className="fill-primary text-primary" />
            ))}
          </div>

          {/* Testimonial Text */}
          <blockquote className="text-xl md:text-2xl text-center mb-6 italic leading-relaxed">
            "{currentTestimonial.message}"
          </blockquote>

          {/* Author Info */}
          <div className="text-center">
            <p className="font-semibold text-lg">{currentTestimonial.name}</p>
            <p className="text-muted-foreground text-sm">
              {currentTestimonial.university} • {currentTestimonial.country}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex gap-4 justify-center mt-6">
        <Button variant="outline" size="icon" onClick={prevTestimonial} aria-label="Previous testimonial">
          <ChevronLeft size={20} />
        </Button>
        <Button variant="outline" size="icon" onClick={nextTestimonial} aria-label="Next testimonial">
          <ChevronRight size={20} />
        </Button>
      </div>

      {/* Dots Indicator */}
      <div className="flex gap-2 justify-center mt-4">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-primary w-8" : "bg-muted"
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialSlider;
