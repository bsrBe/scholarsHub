import { getIconByName, IconName } from "@/lib/iconMap";
import { FileText } from "lucide-react";

interface ProcessStepProps {
  step: number;
  title: string;
  description: string;
  icon: IconName;
  isLast?: boolean;
}

const ProcessStep = ({ step, title, description, icon, isLast = false }: ProcessStepProps) => {
  const IconComponent = getIconByName(icon) ?? FileText;

  return (
    <div className="relative flex flex-col items-center text-center">
      {/* Step Number Badge */}
      <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold shadow-lg z-10">
        {step}
      </div>

      {/* Icon Circle */}
      <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mb-4 shadow-md hover:shadow-lg transition-shadow">
        {IconComponent && <IconComponent size={40} className="text-primary" />}
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">{description}</p>

      {/* Connector Line */}
      {!isLast && (
        <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
      )}
    </div>
  );
};

export default ProcessStep;
