import ServiceCard from "@/components/ServiceCard";
import { services } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Services = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Our <span className="gradient-text">Services</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Comprehensive end-to-end support for your entire study abroad journey,
            from initial planning to settling into your new university.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Process CTA */}
      <section className="section-padding bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Our expert counselors are here to guide you through every step.
            Book a free consultation to discuss your study abroad plans.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book-consultation">
              <Button variant="hero" size="lg">
                Book Free Consultation
                <ArrowRight size={20} />
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                See How It Works
                <ArrowRight size={20} />
              </Button>
            </Link>
            <Link to="/blog">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Read Our Blog
                <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Services;
