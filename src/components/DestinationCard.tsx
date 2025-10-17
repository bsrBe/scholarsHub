import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface DestinationCardProps {
  id: string;
  name: string;
  flag: string;
  tagline: string;
  description: string;
}

const DestinationCard = ({ id, name, flag, tagline, description }: DestinationCardProps) => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50 overflow-hidden">
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-8 text-center group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
        <div className="text-7xl mb-2">{flag}</div>
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
    </Card>
  );
};

export default DestinationCard;
