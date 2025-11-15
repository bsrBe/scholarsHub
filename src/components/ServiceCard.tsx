import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { getIconByName, IconName } from "@/lib/iconMap";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: IconName;
}

const ServiceCard = ({ title, description, icon }: ServiceCardProps) => {
  const IconComponent = getIconByName(icon) ?? FileText;

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50">
      <CardHeader>
        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
          {IconComponent && <IconComponent size={28} className="text-primary" />}
        </div>
        <CardTitle className="text-xl mb-2">{title}</CardTitle>
        <CardDescription className="text-base leading-relaxed">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default ServiceCard;
