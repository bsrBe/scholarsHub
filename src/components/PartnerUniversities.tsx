import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PartnerUniversity {
  id: string;
  name: string;
  logo?: string;
  location: string;
  city: string;
  state?: string;
  country: string;
}

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
  { id: "29", name: "Aberystwyth University", logo: "/aberystwyth University.png", location: "Wales, England", city: "Wales", state: "Wales", country: "England" },
  { id: "30", name: "University of Sunderland", logo: "/University of Sunderland.png", location: "Sunderland, England", city: "Sunderland", state: "Sunderland", country: "England" },
  { id: "31", name: "C3S Business School", logo: "/C3S  Business School.png", location: "Spain Barcelona", city: "Barcelona", state: "Barcelona", country: "Spain" },
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
  { id: "45", name: "Girne American University", logo: "/Girne American University.png", location: "Karmi, Cyprus", city: "Cyprus Karmi", state: "Cyprus Karmi", country: "Turkey" },
];

const PartnerUniversities = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const itemsPerPage = 6;
  const totalPages = Math.ceil(partnerUniversities.length / itemsPerPage);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    if (newDirection === 1) {
      setCurrentIndex((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
    } else {
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
    }
  };

  const currentUniversities = partnerUniversities.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <section className="section-padding bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Partner <span className="gradient-text">Universities</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Explore our vast network of prestigious partner universities worldwide
          </motion.p>
        </div>

        <div className="relative group">
          {/* Navigation Buttons */}
          <div className="absolute top-1/2 -left-4 -right-4 flex justify-between z-20 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full shadow-xl bg-background pointer-events-auto hover:bg-primary hover:text-white"
              onClick={() => paginate(-1)}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full shadow-xl bg-background pointer-events-auto hover:bg-primary hover:text-white"
              onClick={() => paginate(1)}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {/* Animated Container */}
          <div className="relative h-[1500px] md:h-[850px] overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 400, damping: 40 },
                  opacity: { duration: 0.15 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = Math.abs(offset.x) > 50;
                  if (swipe) {
                    paginate(offset.x > 0 ? -1 : 1);
                  }
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 cursor-grab active:cursor-grabbing w-full absolute top-0 left-0"
              >
                {currentUniversities.map((university) => (
                  <Card
                    key={university.id}
                    className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/40 overflow-hidden flex flex-col bg-white/50 backdrop-blur-md"
                  >
                    <div className="flex-1 px-8 pt-10 pb-6 flex flex-col justify-between text-center">
                      <div className="w-full h-36 mb-6 flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-primary/5 rounded-full scale-125 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        {university.logo ? (
                          <img
                            src={university.logo}
                            alt={`${university.name} logo`}
                            className="max-h-full max-w-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-24 h-24 flex items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 text-4xl font-bold text-primary relative z-10">
                            {university.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                          </div>
                        )}
                      </div>

                      <h3 className="font-bold text-xl leading-snug text-foreground mb-4">
                        {university.name}
                      </h3>
                    </div>

                    <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-4 flex items-center gap-3">
                      <MapPin className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm font-semibold truncate tracking-wide">
                        {university.location}
                      </span>
                    </div>
                  </Card>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="text-center mt-8 text-muted-foreground italic flex items-center justify-center gap-2">
            <span className="w-8 h-[1px] bg-muted-foreground/30" />
            and more prestigious universities
            <span className="w-8 h-[1px] bg-muted-foreground/30" />
          </div>

          {/* Pagination Indicators */}
          <div className="flex justify-center gap-3 mt-10">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  index === currentIndex
                    ? "w-12 bg-primary"
                    : "w-3 bg-primary/20 hover:bg-primary/40"
                )}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerUniversities;

