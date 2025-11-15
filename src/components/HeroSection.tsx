import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Happy international students studying together"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          <div className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full">
            <span className="text-primary font-semibold text-sm">
              🎓 Your Study Abroad Journey Starts Here
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Start Your Study Abroad Journey with{" "}
            <span className="gradient-text">Scholars Hub</span>
          </h1>

          <p className="text-xl sm:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Expert guidance for studying in top universities worldwide.
          </p>

          {/* Key Benefits */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-3 rounded-xl shadow-md">
              <CheckCircle className="text-primary" size={20} />
              <span className="font-medium">No Initial Payment</span>
            </div>
            <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-3 rounded-xl shadow-md">
              <CheckCircle className="text-primary" size={20} />
              <span className="font-medium">No Matric Required</span>
            </div>
            <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-3 rounded-xl shadow-md">
              <CheckCircle className="text-primary" size={20} />
              <span className="font-medium">Fast Track Application</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/book-consultation">
              <Button variant="hero" size="lg" className="w-full sm:w-auto">
                Book Free Consultation
                <ArrowRight size={20} />
              </Button>
            </Link>
            <Link to="/apply">
              <Button variant="default" size="lg" className="w-full sm:w-auto bg-primary/90 hover:bg-primary">
                Apply Now
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
            <Link to="/destinations">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Explore Destinations
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
