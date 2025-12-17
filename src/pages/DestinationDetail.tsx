import { useParams, Link } from "react-router-dom";
import { destinations, countryDetails } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, GraduationCap, DollarSign, Building2, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

const DestinationDetail = () => {
  const { country } = useParams<{ country: string }>();
  const destination = destinations.find((d) => d.id === country);
  const details = country ? countryDetails[country] : null;
  const [shouldOpenChat, setShouldOpenChat] = useState(false);

  // Effect to trigger chat opening when shouldOpenChat changes
  useEffect(() => {
    if (shouldOpenChat) {
      // Find and click the chat button
      const chatButton = document.querySelector('button[aria-label="Open chat"]') as HTMLButtonElement;
      if (chatButton) {
        chatButton.click();
        setShouldOpenChat(false); // Reset the state
      }
    }
  }, [shouldOpenChat]);

  if (!destination || !details) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Country Not Found</h1>
          <Link to="/destinations">
            <Button variant="outline">Back to Destinations</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-7xl mx-auto">
          <Link to="/destinations">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft size={20} />
              Back to Destinations
            </Button>
          </Link>

          <div className="flex items-center gap-6 mb-6">
            <div className="w-32 h-24 relative">
              <img
                src={destination.flagUrl}
                alt={`${destination.name} flag`}
                className="w-full h-full object-cover rounded shadow-md"
              />
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4">{destination.name}</h1>
              <p className="text-2xl text-primary font-medium">{destination.tagline}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Study Here */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">
            Why Study in <span className="gradient-text">{destination.name}</span>?
          </h2>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {details.whyStudy.map((reason, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                <CheckCircle className="text-primary shrink-0 mt-1" size={20} />
                <span className="text-lg">{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education System */}
      <section className="section-padding bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                <GraduationCap className="text-primary" size={32} />
                Education System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground leading-relaxed">{details.educationSystem}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Requirements & Details */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Requirements */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Admission Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {details.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="text-primary shrink-0 mt-1" size={18} />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Intakes */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Calendar className="text-primary" size={24} />
                  Intake Periods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {details.intakes.map((intake, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="text-primary shrink-0 mt-1" size={18} />
                      <span className="text-lg">{intake}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Study Levels */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <GraduationCap className="text-primary" size={24} />
                  Study Levels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {details.studyLevels.map((level, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="text-primary shrink-0 mt-1" size={18} />
                      <span>{level}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Costs */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <DollarSign className="text-primary" size={24} />
                  Estimated Costs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold mb-1">Tuition Fees:</p>
                  <p className="text-lg text-primary">{details.estimatedCost.tuition}</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Living Expenses:</p>
                  <p className="text-lg text-primary">{details.estimatedCost.living}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Top Universities */}
      <section className="section-padding bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 flex items-center gap-3">
            <Building2 className="text-primary" size={36} />
            Top Universities
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {details.topUniversities.map((uni, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <p className="font-medium">{uni}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Apply to {destination.name}?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start your application or book a free consultation with our experts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* <Button 
              variant="hero" 
              size="lg"
              onClick={() => setShouldOpenChat(true)}
            >
              Message Admin
            </Button> */}
            <Link to={`/tasks?country=${destination.id}`}>
              <Button variant="hero" size="lg">
                Apply now
              </Button>
            </Link>

            <Link to="/book-consultation">
              <Button variant="outline" size="lg">
                Book Free Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DestinationDetail;
