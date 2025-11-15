import { CheckCircle, Users, Award, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const values = [
    {
      icon: Users,
      title: "Student-Centered Approach",
      description: "Your success is our priority. We provide personalized guidance tailored to your unique goals and aspirations.",
    },
    {
      icon: Award,
      title: "Proven Track Record",
      description: "Thousands of successful placements in top universities across the globe, with a 95% visa success rate.",
    },
    {
      icon: Globe,
      title: "Global Network",
      description: "Strong partnerships with universities worldwide, giving you access to exclusive opportunities.",
    },
  ];

  const reasons = [
    "Expert counselors with 10+ years of experience",
    "No initial payment required - we believe in your dreams",
    "Comprehensive support from application to arrival",
    "Strong visa success rate across all destinations",
    "Post-arrival support to help you settle in",
    "Access to exclusive scholarships and funding opportunities",
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About <span className="gradient-text">Scholars Hub</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Empowering students to achieve their academic dreams through expert guidance
            and unwavering support on their study abroad journey.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4 gradient-text">Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To make quality international education accessible to every aspiring student,
                  regardless of their background. We break down barriers and provide the support
                  needed to turn study abroad dreams into reality.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4 gradient-text">Our Vision</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To be the world's most trusted study abroad consultancy, known for our
                  integrity, expertise, and commitment to student success. We envision a world
                  where education knows no borders.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">Our Story</h2>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
           <p>
  Founded in 2015, Scholars Hub started with one purpose: to make studying abroad easier,
  clearer, and more accessible for every student. What began as a small advisory service has
  grown into a trusted support system for students pursuing global education.
</p>

<p>
  Driven by experience navigating the challenges of studying overseas,
  saw the need for honest, reliable, and affordable guidance. Since then, we’ve helped many
  students begin their academic journey across 15+ countries.
</p>

<p>
  We believe that opportunity should never be limited by financial barriers. That’s why we
  introduced a “No Initial Payment” approach — you only move forward when you’re confident
  and ready. With 10+ years of experience and a 90% visa success rate, we’re committed to 
  supporting you at every stage of the process.
</p>

          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Why Choose Scholars Hub?</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {values.map((value) => (
              <Card key={value.title} className="text-center border-2 hover:border-primary/50 transition-all hover:shadow-xl">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <value.icon size={32} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-2">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-center">What Sets Us Apart</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {reasons.map((reason, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="text-primary shrink-0 mt-1" size={20} />
                      <span className="text-muted-foreground">{reason}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">10K+</div>
              <div className="text-lg opacity-90">Students Placed</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">25+</div>
              <div className="text-lg opacity-90">Countries</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">95%</div>
              <div className="text-lg opacity-90">Visa Success Rate</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">15+</div>
              <div className="text-lg opacity-90">Years Experience</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
