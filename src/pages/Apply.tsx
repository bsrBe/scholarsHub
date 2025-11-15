import { useSearchParams } from "react-router-dom";
import ApplicationForm from "@/components/ApplicationForm";

const Apply = () => {
  const [searchParams] = useSearchParams();
  const preSelectedCountry = searchParams.get("country");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 bg-secondary text-secondary-foreground">
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            🎓 Start Your Journey
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Study Abroad Application
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Fill out the form below and our team will get in touch with you to guide you through your study abroad journey.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="section-padding">
        <div className="container mx-auto px-8 max-w-3xl">
          <div className="bg-card rounded-3xl shadow-lg p-8 md:p-12">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Application Form</h2>
              <p className="text-muted-foreground">
                Complete the form to begin your study abroad application process
              </p>
            </div>
            <ApplicationForm preSelectedCountry={preSelectedCountry || undefined} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Apply;
