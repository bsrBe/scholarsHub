// Static data for Scholars Hub

export const services = [
  {
    id: 1,
    title: "Document Review & Eligibility Check",
    description: "Expert evaluation of your academic credentials and eligibility assessment for international universities.",
    icon: "FileCheck",
  },
  {
    id: 2,
    title: "Language Test Preparation",
    description: "Comprehensive guidance for IELTS, TOEFL, and other language proficiency tests.",
    icon: "Languages",
  },
  {
    id: 3,
    title: "University Admission Support",
    description: "End-to-end assistance with university selection, application, and admission process.",
    icon: "GraduationCap",
  },
  {
    id: 4,
    title: "Visa Guidance",
    description: "Complete support for visa applications, documentation, and interview preparation.",
    icon: "FileText",
  },
  {
    id: 5,
    title: "Accommodation Arrangement",
    description: "Help finding safe and affordable housing options near your university.",
    icon: "Home",
  },
  {
    id: 6,
    title: "Flight & Travel Support",
    description: "Assistance with flight bookings, travel arrangements, and pre-departure logistics.",
    icon: "Plane",
  },
  {
    id: 7,
    title: "Pre-Departure Orientation",
    description: "Comprehensive briefing on culture, academics, and living abroad before you travel.",
    icon: "Compass",
  },
  {
    id: 8,
    title: "Post-Arrival Support",
    description: "Continued guidance after arrival, including university enrollment and settling in.",
    icon: "HeadphonesIcon",
  },
];

export const destinations = [
  {
    id: "uk",
    name: "United Kingdom",
    flag: "🇬🇧",
    tagline: "World-class education and cultural diversity",
    description: "Home to prestigious institutions like Oxford and Cambridge, the UK offers world-renowned education with diverse programs.",
  },
  {
    id: "usa",
    name: "United States",
    flag: "🇺🇸",
    tagline: "Innovation hub with endless opportunities",
    description: "With Ivy League universities and cutting-edge research, the USA is the top destination for academic excellence.",
  },
  {
    id: "canada",
    name: "Canada",
    flag: "🇨🇦",
    tagline: "Safe, inclusive, and high-quality education",
    description: "Canada offers welcoming immigration policies, top universities, and an excellent quality of life.",
  },
  {
    id: "australia",
    name: "Australia",
    flag: "🇦🇺",
    tagline: "Vibrant lifestyle and globally recognized degrees",
    description: "Known for its stunning landscapes and quality education, Australia is a favorite among international students.",
  },
  {
    id: "germany",
    name: "Germany",
    flag: "🇩🇪",
    tagline: "Affordable education with strong engineering focus",
    description: "Germany offers tuition-free education at public universities with world-class programs in engineering and sciences.",
  },
  {
    id: "france",
    name: "France",
    flag: "🇫🇷",
    tagline: "Rich culture and renowned business schools",
    description: "France is known for its art, culture, and prestigious business and culinary programs.",
  },
];

export const countryDetails: Record<string, {
  whyStudy: string[];
  educationSystem: string;
  requirements: string[];
  intakes: string[];
  studyLevels: string[];
  estimatedCost: { tuition: string; living: string };
  topUniversities: string[];
}> = {
  uk: {
    whyStudy: [
      "Home to Oxford, Cambridge, and Imperial College",
      "Shorter degree duration (3 years for bachelor's, 1 year for master's)",
      "Rich history and cultural diversity",
      "Post-study work opportunities",
    ],
    educationSystem: "The UK education system emphasizes independent learning and critical thinking with a wide range of courses.",
    requirements: [
      "IELTS 6.0-7.0 or equivalent",
      "Academic transcripts",
      "Statement of purpose",
      "Letters of recommendation",
    ],
    intakes: ["September/October (Main)", "January/February (Limited)"],
    studyLevels: ["Bachelor's Degree", "Master's Degree", "PhD"],
    estimatedCost: {
      tuition: "£10,000 - £30,000 per year",
      living: "£12,000 - £15,000 per year",
    },
    topUniversities: ["University of Oxford", "University of Cambridge", "Imperial College London", "UCL", "LSE"],
  },
  usa: {
    whyStudy: [
      "World's top-ranked universities (Harvard, MIT, Stanford)",
      "Flexible curriculum and diverse programs",
      "Strong research and innovation culture",
      "Optional Practical Training (OPT) for work experience",
    ],
    educationSystem: "US universities offer a liberal arts approach with major/minor flexibility and credit-based learning.",
    requirements: [
      "TOEFL 80+ or IELTS 6.5+",
      "SAT/ACT for undergrad, GRE/GMAT for grad",
      "Academic transcripts",
      "Essays and recommendation letters",
    ],
    intakes: ["Fall (August/September - Main)", "Spring (January)", "Summer (May - Limited)"],
    studyLevels: ["Bachelor's Degree", "Master's Degree", "PhD"],
    estimatedCost: {
      tuition: "$20,000 - $60,000 per year",
      living: "$10,000 - $18,000 per year",
    },
    topUniversities: ["Harvard University", "MIT", "Stanford University", "Yale University", "Princeton University"],
  },
  canada: {
    whyStudy: [
      "High quality of life and safe environment",
      "Post-graduation work permit (PGWP) up to 3 years",
      "Pathway to permanent residency",
      "Affordable compared to US and UK",
    ],
    educationSystem: "Canadian education focuses on research and practical skills with co-op programs in many institutions.",
    requirements: [
      "IELTS 6.5+ or TOEFL 90+",
      "Academic transcripts",
      "Statement of purpose",
      "Proof of funds",
    ],
    intakes: ["September (Main)", "January (Secondary)", "May (Limited)"],
    studyLevels: ["Bachelor's Degree", "Master's Degree", "PhD", "Diploma Programs"],
    estimatedCost: {
      tuition: "CAD 15,000 - 35,000 per year",
      living: "CAD 10,000 - 15,000 per year",
    },
    topUniversities: ["University of Toronto", "UBC", "McGill University", "University of Waterloo", "McMaster University"],
  },
  australia: {
    whyStudy: [
      "World-class education in a sunny climate",
      "Post-study work rights (2-4 years)",
      "Multicultural and student-friendly environment",
      "Strong focus on research and innovation",
    ],
    educationSystem: "Australian universities emphasize practical learning with strong industry connections.",
    requirements: [
      "IELTS 6.5+ or equivalent",
      "Academic transcripts",
      "Statement of purpose",
      "Proof of financial capacity",
    ],
    intakes: ["February (Main)", "July (Secondary)"],
    studyLevels: ["Bachelor's Degree", "Master's Degree", "PhD"],
    estimatedCost: {
      tuition: "AUD 20,000 - 45,000 per year",
      living: "AUD 21,000 - 26,000 per year",
    },
    topUniversities: ["University of Melbourne", "ANU", "University of Sydney", "UNSW", "UQ"],
  },
  germany: {
    whyStudy: [
      "Low or no tuition fees at public universities",
      "Strong engineering and technical programs",
      "Post-study work visa for 18 months",
      "Central location in Europe",
    ],
    educationSystem: "German universities offer rigorous academic programs with a focus on research and applied sciences.",
    requirements: [
      "IELTS 6.0+ or German proficiency (for German-taught programs)",
      "Academic transcripts",
      "Blocked account (€11,208 per year)",
      "Motivation letter",
    ],
    intakes: ["Winter Semester (September/October)", "Summer Semester (March/April)"],
    studyLevels: ["Bachelor's Degree", "Master's Degree", "PhD"],
    estimatedCost: {
      tuition: "€0 - €3,000 per year (public universities)",
      living: "€850 - €1,200 per month",
    },
    topUniversities: ["TU Munich", "LMU Munich", "Heidelberg University", "RWTH Aachen", "Free University of Berlin"],
  },
  france: {
    whyStudy: [
      "Affordable tuition at public universities",
      "World-renowned art, culture, and cuisine",
      "Strong business and engineering schools",
      "Central location for European travel",
    ],
    educationSystem: "French education combines theoretical knowledge with practical applications, especially in business schools.",
    requirements: [
      "French proficiency (DELF/DALF) or IELTS for English programs",
      "Academic transcripts",
      "Campus France application",
      "Motivation letter and CV",
    ],
    intakes: ["Fall (September)", "Spring (January/February - Limited)"],
    studyLevels: ["Bachelor's Degree", "Master's Degree", "PhD", "Grande École Programs"],
    estimatedCost: {
      tuition: "€170 - €650 per year (public) / €3,000 - €20,000 (private)",
      living: "€800 - €1,200 per month",
    },
    topUniversities: ["Sorbonne University", "École Polytechnique", "HEC Paris", "Sciences Po", "ENS Paris"],
  },
};

export const processSteps = [
  {
    step: 1,
    title: "Create Your Profile",
    description: "Sign up and fill in your academic background, interests, and study preferences.",
    icon: "UserPlus",
  },
  {
    step: 2,
    title: "Choose Destination",
    description: "Select your preferred countries and receive tailored university recommendations.",
    icon: "MapPin",
  },
  {
    step: 3,
    title: "Upload Documents",
    description: "Submit your transcripts, test scores, and other required documents securely.",
    icon: "Upload",
  },
  {
    step: 4,
    title: "Expert Counseling",
    description: "Our counselors review your profile and guide you through the application process.",
    icon: "MessageSquare",
  },
  {
    step: 5,
    title: "Apply to Universities",
    description: "We help prepare and submit applications to your chosen universities.",
    icon: "Send",
  },
  {
    step: 6,
    title: "Visa & Travel",
    description: "Get support with visa applications, accommodation, and travel arrangements.",
    icon: "Plane",
  },
];

export const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    country: "UK",
    university: "University of Oxford",
    message: "Scholars Hub made my dream of studying at Oxford a reality. The support was incredible from start to finish!",
    rating: 5,
  },
  {
    id: 2,
    name: "Ahmed Hassan",
    country: "Canada",
    university: "University of Toronto",
    message: "I was worried about the visa process, but the team at Scholars Hub guided me every step of the way. Now I'm studying in Toronto!",
    rating: 5,
  },
  {
    id: 3,
    name: "Priya Sharma",
    country: "Australia",
    university: "University of Melbourne",
    message: "The counselors were knowledgeable and patient. They helped me choose the perfect program in Australia.",
    rating: 5,
  },
  {
    id: 4,
    name: "Michael Chen",
    country: "USA",
    university: "Stanford University",
    message: "Getting into Stanford seemed impossible, but Scholars Hub believed in me and helped craft an amazing application.",
    rating: 5,
  },
];

export const blogPosts = [
  {
    id: 1,
    slug: "top-10-universities-for-international-students",
    title: "Top 10 Universities for International Students in 2025",
    excerpt: "Discover the best universities worldwide that welcome and support international students with excellent programs and facilities.",
    date: "2025-01-15",
    category: "University Rankings",
  },
  {
    id: 2,
    slug: "ielts-preparation-tips",
    title: "IELTS Preparation: 10 Tips to Score 7+",
    excerpt: "Master the IELTS exam with our proven strategies and tips to achieve a high band score for your study abroad applications.",
    date: "2025-01-10",
    category: "Test Preparation",
  },
  {
    id: 3,
    slug: "student-visa-guide",
    title: "Complete Guide to Student Visa Applications",
    excerpt: "Navigate the student visa process with confidence using our comprehensive guide covering all major study destinations.",
    date: "2025-01-05",
    category: "Visa & Immigration",
  },
];
