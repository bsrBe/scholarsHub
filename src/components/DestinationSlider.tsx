import { useState } from "react";
import DestinationCard from "./DestinationCard";
import { destinations } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const DestinationSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const itemsPerPage = 6;
    const totalPages = Math.ceil(destinations.length / itemsPerPage);

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        if (newDirection === 1) {
            setCurrentIndex((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
        } else {
            setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
        }
    };

    const currentDestinations = destinations.slice(
        currentIndex * itemsPerPage,
        (currentIndex + 1) * itemsPerPage
    );

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        }),
    };

    return (
        <section className="section-padding bg-muted/30 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="text-4xl md:text-5xl font-bold mb-4"
                    >
                        Top Study Destinations
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto"
                    >
                        Explore world-class education opportunities in leading countries
                    </motion.p>
                </div>

                <div className="relative group perspective-1000">
                    {/* Enhanced Navigation Buttons */}
                    <div className="absolute top-1/2 -left-6 -right-6 flex justify-between z-20 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-14 w-14 rounded-2xl shadow-2xl bg-white/80 backdrop-blur-sm pointer-events-auto hover:bg-primary hover:text-white border-none transition-all hover:scale-110 active:scale-95"
                            onClick={() => paginate(-1)}
                        >
                            <ChevronLeft className="h-8 w-8" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-14 w-14 rounded-2xl shadow-2xl bg-white/80 backdrop-blur-sm pointer-events-auto hover:bg-primary hover:text-white border-none transition-all hover:scale-110 active:scale-95"
                            onClick={() => paginate(1)}
                        >
                            <ChevronRight className="h-8 w-8" />
                        </Button>
                    </div>

                    {/* Animated Slider Wrapper */}
                    <div className="relative h-[2800px] md:h-[1050px] overflow-hidden">
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 450, damping: 45 },
                                    opacity: { duration: 0.15 }
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
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 cursor-grab active:cursor-grabbing absolute top-0 left-0 w-full"
                            >
                                {currentDestinations.map((destination) => (
                                    <div
                                        key={destination.id}
                                    >
                                        <DestinationCard {...destination} />
                                    </div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Premium Pagination Dots */}
                    <div className="flex justify-center gap-4 mt-12">
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setDirection(index > currentIndex ? 1 : -1);
                                    setCurrentIndex(index);
                                }}
                                className="group relative p-2 focus:outline-none"
                                aria-label={`Go to page ${index + 1}`}
                            >
                                <div className={cn(
                                    "h-1.5 transition-all duration-500 rounded-full",
                                    index === currentIndex
                                        ? "w-10 bg-primary"
                                        : "w-4 bg-primary/20 group-hover:bg-primary/40"
                                )} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DestinationSlider;
