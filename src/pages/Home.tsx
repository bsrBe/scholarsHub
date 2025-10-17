import HeroSection from "@/components/HeroSection";
import ServiceCard from "@/components/ServiceCard";
import DestinationCard from "@/components/DestinationCard";
import ProcessStep from "@/components/ProcessStep";
import TestimonialSlider from "@/components/TestimonialSlider";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { services, destinations, processSteps } from "@/lib/constants";
import { ArrowRight } from "lucide-react";

const Home = () => {
  return (
    <main>
      <HeroSection />

      {/* About Preview */}
      <section className="section-padding bg-muted/30">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why Choose <span className="gradient-text">Scholars Hub</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            We're committed to making your study abroad dreams a reality with expert guidance,
            personalized support, and a proven track record of successful placements in top universities worldwide.
          </p>
          <Link to="/about">
            <Button variant="outline" size="lg">
              Learn More About Us
              <ArrowRight size={20} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive support for every step of your study abroad journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.slice(0, 8).map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/services">
              <Button variant="hero" size="lg">
                View All Services
                <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Top Destinations */}
      <section className="section-padding bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Top Study Destinations</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore world-class education opportunities in leading countries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination) => (
              <DestinationCard key={destination.id} {...destination} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your journey to studying abroad in 6 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {processSteps.map((step, index) => (
              <ProcessStep
                key={step.step}
                {...step}
                isLast={index === processSteps.length - 1}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/how-it-works">
              <Button variant="outline" size="lg">
                Learn More
                <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What Our <span className="gradient-text">Students Say</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real stories from students who achieved their dreams with Scholars Hub
            </p>
          </div>

          <TestimonialSlider />
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Book a free consultation with our expert counselors today and take the first step
            towards your dream university.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book-consultation">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Book Free Consultation
                <ArrowRight size={20} />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
