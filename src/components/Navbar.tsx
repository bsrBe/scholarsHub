import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NavUser from "./NavUser";

import logo from "@/assets/scholarshubgloballogo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Destinations", path: "/destinations" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "FAQ", path: "/faq" },
    { name: "Blog", path: "/blog" },
  ];

  const contactOptions = [
    { name: "For Users", path: "/contact" },
    { name: "For Partners", path: "/contact/partners" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-card shadow-md">
      <div className="max-w-[75%] mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group -ml-2 sm:-ml-4">
            <div className="relative h-14 sm:h-20 transition-transform duration-300 group-hover:scale-105">
              <img
                src={logo}
                alt="Scholars Hub Logo"
                className="h-full w-auto object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(link.path)
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
                  }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Contact Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive("/contact") || isActive("/contact/partners")
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                    }`}
                >
                  Contact Us
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-background border shadow-lg">
                {contactOptions.map((option) => (
                  <DropdownMenuItem key={option.path} asChild>
                    <Link
                      to={option.path}
                      className={`w-full px-2 py-2 text-sm font-medium transition-colors ${isActive(option.path)
                        ? "text-primary bg-primary/10"
                        : "text-foreground hover:text-primary hover:bg-muted"
                        }`}
                    >
                      {option.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Auth Buttons */}
          <div className="hidden xl:flex items-center space-x-3">
            <NavUser />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="xl:hidden p-2 rounded-xl hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="xl:hidden pb-4 animate-fade-in">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive(link.path)
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                    }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Contact Options for Mobile */}
              <div className="px-4 py-2">
                <p className="text-xs font-medium text-muted-foreground mb-2">Contact Us</p>
                <div className="space-y-1">
                  {contactOptions.map((option) => (
                    <Link
                      key={option.path}
                      to={option.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive(option.path)
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                        }`}
                    >
                      {option.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="w-full p-2">
                <NavUser />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
