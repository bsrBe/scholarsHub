import DestinationCard from "@/components/DestinationCard";
import { destinations } from "@/lib/constants";

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
          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <button className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl">
              Chat with a Counselor
            </button>
          </a>
        </div>
      </section>
    </main>
  );
};

export default Destinations;
