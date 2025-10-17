import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold mb-4 gradient-text">Scholars Hub</h3>
            <p className="text-sm text-muted-foreground">
              Your trusted partner for studying abroad. No initial payment. No Matric required.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-primary transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="hover:text-primary transition-colors">
                  Study Destinations
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-primary transition-colors">
                  Blog & Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/how-it-works" className="hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/book-consultation" className="hover:text-primary transition-colors">
                  Book Consultation
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-primary" />
                <a href="mailto:info@scholarshub.com" className="hover:text-primary transition-colors">
                  info@scholarshub.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-primary" />
                <a href="tel:+1234567890" className="hover:text-primary transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-primary" />
                <span>123 Education Street, City</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-muted mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Scholars Hub. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle size={20} />
            </a>
            <a
              href="https://t.me/scholarshub"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
              aria-label="Telegram"
            >
              <MessageCircle size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/1234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-50"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={24} />
      </a>
    </footer>
  );
};

export default Footer;
