import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface PartnerUniversity {
  id: string;
  name: string;
  logo?: string; // URL or emoji/icon
  location: string;
  city: string;
  state?: string;
  country: string;
}

// Add or update partner universities here. To show a logo, place it in `public/images/partners`
// and reference it with the `logo` property, e.g.
// { id: "1", name: "Adelphi University", logo: "/images/partners/adelphi.png", location: "...", ... }
const partnerUniversities: PartnerUniversity[] = [
  { id: "1", name: "Adelphi University", logo: "/Adelphi University.png", location: "New York, USA", city: "New York", state: "New York", country: "USA" },
  { id: "2", name: "Anderson University", logo: "/Anderson University.png", location: "South Carolina, USA", city: "Anderson", state: "South Carolina", country: "USA" },
  { id: "3", name: "Baptist University Of Florida", logo: "/Baptist University Of Florida.png", location: "Florida, USA", city: "Graceville", state: "Florida", country: "USA" },
  { id: "4", name: "Campbellsville University", logo: "/Campbellsville University.png", location: "Kentucky, USA", city: "Campbellsville", state: "Kentucky", country: "USA" },
  { id: "5", name: "Cumberland University", logo: "/Cumberland University.jpg", location: "Tennessee, USA", city: "Lebanon", state: "Tennessee", country: "USA" },
  { id: "6", name: "Faulkner University", logo: "/Faulkner University.png", location: "Alabama, USA", city: "Montgomery", state: "Alabama", country: "USA" },
  { id: "7", name: "Golden Gate University", logo: "/Golden Gate University.png", location: "California, USA", city: "San Francisco", state: "California", country: "USA" },
  { id: "8", name: "St. Francis College", logo: "/St. Francis College.png", location: "New York, USA", city: "Brooklyn", state: "New York", country: "USA" },
  { id: "9", name: "University of the Cumberlands", logo: "/University of the Cumberlands.svg", location: "Kentucky, USA", city: "Williamsburg", state: "Kentucky", country: "USA" },
  { id: "10", name: "Wayland Baptist University", logo: "/Wayland Baptist University.png", location: "Texas, USA", city: "Plainview", state: "Texas", country: "USA" },
  { id: "11", name: "Wittenberg University", logo: "/Wittenberg University.svg", location: "Springfield, USA", city: "Springfield", state: "Ohio", country: "USA" },
  { id: "12", name: "Marshall University", logo: "/Marshall University.png", location: "West Virginia, USA", city: "Huntington", state: "West Virginia", country: "USA" },
  { id: "13", name: "The University of Toledo", logo: "/The University of Toledo.svg", location: "Ohio, USA", city: "Toledo", state: "Ohio", country: "USA" },
  { id: "14", name: "Murray State University", logo: "/Murray State University.png", location: "Kentucky, USA", city: "Murray", state: "Kentucky", country: "USA" },
  { id: "15", name: "University of Louisville", logo: "/University of Louisville.png", location: "Kentucky, USA", city: "Louisville", state: "Kentucky", country: "USA" },
  { id: "16", name: "University of South Alabama", logo: "/University of South Alabama.png", location: "Alabama, USA", city: "Mobile", state: "Alabama", country: "USA" },
  { id: "17", name: "University of Central Florida", logo: "/University of Central Florida.png", location: "Florida, USA", city: "Orlando", state: "Florida", country: "USA" },
  { id: "18", name: "Auburn University", logo: "/Auburn University.png", location: "Alabama, USA", city: "Auburn", state: "Alabama", country: "USA" },
  { id: "19", name: "University of Alabama", logo: "/University of Alabama.jpeg", location: "Alabama, USA", city: "Tuscaloosa", state: "Alabama", country: "USA" },
  { id: "20", name: "University of Kentucky", logo: "/University of Kentucky.png", location: "Kentucky, USA", city: "Lexington", state: "Kentucky", country: "USA" },
  { id: "21", name: "University of Regina", logo: "/University of Regina.png", location: "Saskatchewan, Canada", city: "Regina", state: "Saskatchewan", country: "Canada" },
  { id: "22", name: "Trent University", logo: "/Trent University.png", location: "Ontario, Canada", city: "Trent", state: "Ontario", country: "Canada" },
  { id: "23", name: "Niagara College", logo: "/Niagara College.png", location: "Ontario, Canada", city: "Niagara", state: "Ontario", country: "Canada" },
  { id: "24", name: "Algoma University", logo: "/Algoma University.png", location: "Ontario, Canada", city: "Algoma", state: "Ontario", country: "Canada" },
  { id: "25", name: "Northeastern University", logo: "/Northeastern University.png", location: "Toronto, Canada", city: "Toronto", state: "Ontario", country: "Canada" },
  { id: "26", name: "Cyprus International University", logo: "/Cyprus International University.png", location: "Nicosia, Cyprus", city: "Nicosia", state: "Nicosia", country: "Cyprus" },
  { id: "27", name: "University of Roehampton", logo: "/University of Roehampton.png", location: "London, England", city: "London", state: "London", country: "England" },
  { id: "28", name: "University of Wolverhampton", logo: "/University of Wolverhampton.png", location: "Walsall, England", city: "Walsall", state: "Walsall", country: "England" },
  { id: "29", name: "Aberystwyth University", logo: "/Aberystwyth University.png", location: "Wales, England", city: "Wales", state: "Wales", country: "England" },
  { id: "30", name: "University of Sunderland", logo: "/University of Sunderland.png", location: "Sunderland, England", city: "Sunderland", state: "Sunderland", country: "England" },
  { id: "31", name: "C3S Business School", logo: "/C3S Business School.png", location: "Cape Town, South Africa", city: "Cape Town", state: "Cape Town", country: "South Africa" },
  { id: "32", name: "Dublin Business School", logo: "/Dublin Business School.png", location: "Dublin, Ireland", city: "Dublin", state: "Dublin", country: "Ireland" },
  { id: "33", name: "University of Limerick", logo: "/University of Limerick.png", location: "Limerick, Ireland", city: "Limerick", state: "Limerick", country: "Ireland" },
  { id: "34", name: "IBAT College Dublin", logo: "/IBAT college Dublin.png", location: "Dublin, Ireland", city: "Dublin", state: "Dublin", country: "Ireland" },
  { id: "35", name: "Federation University", logo: "/Federation University.png", location: "Berwick, Australia", city: "Berwick", state: "Berwick", country: "Australia" },
  { id: "36", name: "Griffith University", logo: "/Griffith University.png", location: "Queensland, Australia", city: "Queensland", state: "Queensland", country: "Australia" },
  { id: "37", name: "La Trobe University", logo: "/La Trobe University.png", location: "Melbourne, Australia", city: "Melbourne", state: "Melbourne", country: "Australia" },
  { id: "38", name: "Deakin University", logo: "/Deakin University.png", location: "Melbourne, Australia", city: "Melbourne", state: "Melbourne", country: "Australia" },
  { id: "39", name: "Haaha-Helia University of Applied Science", logo: "/Haaha-Helia University of Applied Science.png", location: "Helsinki, Finland", city: "Helsinki", state: "Helsinki", country: "Finland" },
  { id: "40", name: "Auckland Institute of Studies", logo: "/Auckland Institute of Studies.png", location: "Auckland, New Zealand", city: "Auckland", state: "Auckland", country: "New Zealand" },
  { id: "41", name: "International University of Applied Science", logo: "/International University of Applied Science.png", location: "Erfurt, Germany", city: "Erfurt", state: "Erfurt", country: "Germany" },
  { id: "42", name: "SRH University Heidelberg", logo: "/SRH University Heidelberg.png", location: "Berlin, Germany", city: "Berlin", state: "Berlin", country: "Germany" },
  { id: "43", name: "New European College", logo: "/New European College.png", location: "Munich, Germany", city: "Munich", state: "Munich", country: "Germany" },
  { id: "44", name: "University of Europe for Applied Science", logo: "/University of Europe for Applied Science.png", location: "Berlin, Germany", city: "Berlin", state: "Berlin", country: "Germany" },
  { id: "45", name: "Girne American University", logo: "/Girne American University.png", location: "Turkey, Cyprus", city: "Cyprus Karmi", state: "Cyprus Karmi", country: "Turkey" },
];

const PartnerUniversities = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 16; // 4x4 grid
  const totalPages = Math.ceil(partnerUniversities.length / itemsPerPage);

  const currentUniversities = partnerUniversities.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  // Auto-scroll animation
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    }
  }, [currentIndex]);

  return (
    <section className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
             Partner <span className="gradient-text">Universities</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore Some of our network of prestigious partner universities across the United States
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          {totalPages > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 h-12 w-12 rounded-full shadow-lg bg-background hover:bg-primary hover:text-primary-foreground"
                onClick={handlePrev}
                aria-label="Previous universities"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 h-12 w-12 rounded-full shadow-lg bg-background hover:bg-primary hover:text-primary-foreground"
                onClick={handleNext}
                aria-label="Next universities"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Universities Grid */}
          <div
            ref={scrollContainerRef}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-all duration-500"
          >
            {currentUniversities.map((university) => (
              <Card
                key={university.id}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50 overflow-hidden flex flex-col bg-white"
              >
                {/* Logo + name */}
                <div className="flex-1 px-6 pt-6 pb-4 flex flex-col justify-between text-center">
                  <div className="w-full h-32 mb-4 flex items-center justify-center overflow-hidden">
                    {university.logo ? (
                      <img
                        src={university.logo}
                        alt={`${university.name} logo`}
                        className="max-h-full max-w-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 text-3xl font-bold text-primary">
                        {university.name
                          .split(' ')
                          .map((word) => word[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                    )}
                  </div>

                  <h3 className="font-semibold text-lg leading-tight text-foreground">
                    {university.name}
                  </h3>
                </div>

                {/* Location Bar */}
                <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm font-medium truncate">
                    {university.location}
                  </span>
                </div>
              </Card>
            ))}
          </div>
          
          <p className="text-center text-muted-foreground mt-6 text-lg">
            ...and more prestigious universities
          </p>

          {/* Pagination Dots */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    index === currentIndex
                      ? "w-8 bg-primary"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PartnerUniversities;

