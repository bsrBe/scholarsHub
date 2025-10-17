import ProcessStep from "@/components/ProcessStep";
import { processSteps } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const HowItWorks = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            How It <span className="gradient-text">Works</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Your journey to studying abroad made simple. Follow our proven
            6-step process to achieve your academic dreams.
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {processSteps.map((step, index) => (
              <ProcessStep
                key={step.step}
                {...step}
                isLast={index === processSteps.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Explanation */}
      <section className="section-padding bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">Timeline Overview</h2>
          <Card className="border-2">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-32 shrink-0 font-semibold text-primary">Week 1-2</div>
                  <div>
                    <p className="font-semibold mb-1">Initial Setup & Planning</p>
                    <p className="text-muted-foreground">
                      Create your profile, discuss your goals with counselors, and select target destinations.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-32 shrink-0 font-semibold text-primary">Week 3-6</div>
                  <div>
                    <p className="font-semibold mb-1">Document Preparation</p>
                    <p className="text-muted-foreground">
                      Gather and upload all required documents. Our team will review and provide feedback.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-32 shrink-0 font-semibold text-primary">Week 7-12</div>
                  <div>
                    <p className="font-semibold mb-1">Application Submission</p>
                    <p className="text-muted-foreground">
                      Submit applications to selected universities and track their progress.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-32 shrink-0 font-semibold text-primary">Week 13-16</div>
                  <div>
                    <p className="font-semibold mb-1">Visa Process</p>
                    <p className="text-muted-foreground">
                      Once accepted, begin visa application with our expert guidance.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-32 shrink-0 font-semibold text-primary">Week 17+</div>
                  <div>
                    <p className="font-semibold mb-1">Pre-Departure & Travel</p>
                    <p className="text-muted-foreground">
                      Attend orientation, arrange accommodation, book flights, and prepare for departure.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Is there any upfront payment required?</h3>
                <p className="text-muted-foreground">
                  No! We believe in your dreams. Our "No Initial Payment" policy means you can start
                  your journey without any financial burden. We only charge after successful placement.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Do I need Matric to apply?</h3>
                <p className="text-muted-foreground">
                  No Matric is required! We work with universities that accept various educational
                  backgrounds. Our counselors will help find the right program for your qualifications.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">How long does the entire process take?</h3>
                <p className="text-muted-foreground">
                  Typically 4-6 months from initial consultation to departure. However, timelines vary
                  based on destination, intake period, and individual circumstances.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">What if my visa gets rejected?</h3>
                <p className="text-muted-foreground">
                  With our 95% visa success rate, rejections are rare. If it happens, we'll reapply
                  with improved documentation at no extra cost or help you find alternative options.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Take the first step today with a free consultation from our expert counselors.
          </p>
          <Link to="/book-consultation">
            <Button variant="secondary" size="lg">
              Book Free Consultation
              <ArrowRight size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default HowItWorks;
