import ContactForm from "@/components/ContactForm";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

const Contact = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Have questions? We're here to help. Reach out to us through any
            of the channels below or fill out the contact form.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-8">Contact Information</h2>
              </div>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Mail className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email</h3>
                    <a
                      href="mailto:info@scholarshub.com"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      info@scholarshub.com
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Phone className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Phone</h3>
                    <a
                      href="tel:+1234567890"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      +1 (234) 567-890
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Office</h3>
                    <p className="text-muted-foreground">
                      123 Education Street<br />
                      City Name, State 12345
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 bg-gradient-to-br from-primary/10 to-accent/10">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Quick Chat</h3>
                  <div className="flex gap-4">
                    <a
                      href="https://wa.me/1234567890"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors flex-1 justify-center font-medium"
                    >
                      <MessageCircle size={20} />
                      WhatsApp
                    </a>
                    <a
                      href="https://t.me/scholarshub"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-3 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/90 transition-colors flex-1 justify-center font-medium"
                    >
                      <MessageCircle size={20} />
                      Telegram
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Office Hours */}
              <Card className="border-2">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Office Hours</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span className="font-medium">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span className="font-medium">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span className="font-medium">Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="border-2 shadow-xl">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="section-padding bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Visit Our Office</h2>
          <div className="bg-muted rounded-2xl h-96 flex items-center justify-center">
            <p className="text-muted-foreground">
              Google Maps embed would be placed here
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
