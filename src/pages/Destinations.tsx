import DestinationCard from "@/components/DestinationCard";
import { destinations } from "@/lib/constants";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Destinations = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Study <span className="gradient-text">Destinations</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Explore world-class education opportunities in the best universities
            across the globe. Your perfect destination awaits!
          </p>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination) => (
              <DestinationCard key={destination.id} {...destination} />
            ))}
          </div>
          <p className="text-center text-muted-foreground mt-8 text-lg">
            ...and more destinations available
          </p>
        </div>
      </section>

      {/* Info Section */}
      <section className="section-padding bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Need Help Choosing?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Not sure which destination is right for you? Our expert counselors can help
            you choose the perfect country based on your academic goals, budget, and preferences.
          </p>
          <Link to="/book-consultation">
            <Button variant="hero" size="lg">
              Chat with a Counselor
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Destinations;
