import ConsultationForm from "@/components/ConsultationForm";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import consultationImage from "@/assets/consultation-image.jpg";

const BookConsultation = () => {
  const benefits = [
    "Personalized guidance based on your profile",
    "Expert advice on university selection",
    "Clear understanding of the application process",
    "Visa requirements and procedures explained",
    "Scholarship and funding opportunities",
    "No obligation - completely free consultation",
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Book Your Free <span className="gradient-text">Consultation</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Connect with our expert counselors and take the first step
            towards your study abroad journey.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Info */}
            <div>
              <div className="mb-8">
                <img
                  src={consultationImage}
                  alt="Consultation with educational counselor"
                  className="w-full h-80 object-cover rounded-2xl shadow-xl"
                />
              </div>

              <Card className="border-2">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold mb-6">What You'll Get</h2>
                  <ul className="space-y-4">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="text-primary shrink-0 mt-1" size={20} />
                        <span className="text-lg">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 mt-6 bg-gradient-to-br from-primary/5 to-accent/5">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3">💡 Pro Tip</h3>
                  <p className="text-muted-foreground">
                    Prepare a list of questions and have your academic documents ready
                    to make the most of your consultation session.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Form */}
            <div>
              <Card className="border-2 shadow-xl">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold mb-6">Schedule Your Session</h2>
                  <ConsultationForm />
                </CardContent>
              </Card>

              <div className="mt-6 text-center text-muted-foreground">
                <p className="text-sm">
                  By booking a consultation, you agree to be contacted by our team.
                  We respect your privacy and will never share your information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="section-padding bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prefer to Talk Right Now?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Our counselors are available on WhatsApp and Telegram for immediate support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl w-full sm:w-auto">
                Chat on WhatsApp
              </button>
            </a>
            <a
              href="https://t.me/scholarshub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="px-8 py-4 bg-secondary text-secondary-foreground rounded-2xl font-semibold hover:bg-secondary/90 transition-all shadow-lg hover:shadow-xl w-full sm:w-auto">
                Chat on Telegram
              </button>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BookConsultation;
