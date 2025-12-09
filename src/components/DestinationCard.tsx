import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import "@/styles/animations.css";

interface DestinationCardProps {
  id: string;
  name: string;
  flagUrl: string;
  tagline: string;
  description: string;
}

const DestinationCard = ({ id, name, flagUrl, tagline, description }: DestinationCardProps) => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50 overflow-hidden">
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-8 text-center group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
        <div className="animate-float">
          <img
            src={flagUrl}
            alt={`${name} flag`}
            className="flag-wave inline-block w-24 h-24 md:w-32 md:h-32 mb-2 transition-transform duration-1000 group-hover:rotate-6 hover:!rotate-0"
          />
        </div>
      </div>

      <CardHeader>
        <CardTitle className="text-2xl">{name}</CardTitle>
        <CardDescription className="text-sm font-medium text-primary">{tagline}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{description}</p>
        <Link to={`/destinations/${id}`}>
          <Button variant="ghost" className="w-full group/btn">
            Learn More
            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card >
  );
};

export default DestinationCard;
