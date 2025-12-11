// Static data for Scholars Hub
import type { IconName } from "./iconMap";

type Service = {
  id: number;
  title: string;
  description: string;
  icon: IconName;
};

export const services: Service[] = [
  {
    id: 1,
    title: "Document Review & Eligibility Check",
    description: "Expert evaluation of your academic credentials and eligibility assessment for international universities.",
    icon: "FileCheck",
  },
  {
    id: 2,
    title: "Language Test Preparation",
    description: "Comprehensive guidance for IELTS, TOEFL,Duolingo and other language proficiency tests.",
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
    flagUrl: "/flags/uk.svg",
    tagline: "World-class education and cultural diversity",
    description: "Home to prestigious institutions like Oxford and Cambridge, the UK offers world-renowned education with diverse programs.",
  },
  {
    id: "usa",
    name: "United States",
    flagUrl: "/flags/us.svg",
    tagline: "Innovation hub with endless opportunities",
    description: "With Ivy League universities and cutting-edge research, the USA is the top destination for academic excellence.",
  },
  {
    id: "canada",
    name: "Canada",
    flagUrl: "/flags/canada.svg",
    tagline: "Safe, inclusive, and high-quality education",
    description: "Canada offers welcoming immigration policies, top universities, and an excellent quality of life.",
  },
  {
    id: "australia",
    name: "Australia",
    flagUrl: "/flags/australia.svg",
    tagline: "Vibrant lifestyle and globally recognized degrees",
    description: "Known for its stunning landscapes and quality education, Australia is a favorite among international students.",
  },
  {
    id: "germany",
    name: "Germany",
    flagUrl: "/flags/germany.svg",
    tagline: "Affordable education with strong engineering focus",
    description: "Germany offers tuition-free education at public universities with world-class programs in engineering and sciences.",
  },
  {
    id: "france",
    name: "France",
    flagUrl: "/flags/france.svg",
    tagline: "Rich culture and renowned business schools",
    description: "France is known for its art, culture, and prestigious business and culinary programs.",
  },
  {
    id: "Italy",
    name: "Italy",
    flagUrl: "/flags/italy.svg",
    tagline: "Rich heritage and affordable education",
    description: "Italy combines world-class education with rich cultural heritage and affordable tuition at public universities.",
  },
  {
    id: "Ireland",
    name: "Ireland",
    flagUrl: "/flags/ireland.svg",
    tagline: "Tech hub with strong industry connections",
    description: "Ireland offers excellent education with strong focus on technology and great post-study work opportunities.",
  },
  {
    id: "Cyprus",
    name: "Cyprus",
    flagUrl: "/flags/cyprus.svg",
    tagline: "Mediterranean paradise with affordable education",
    description: "Cyprus provides a safe, welcoming environment with modern universities and affordable living costs.",
  },
  {
    id: "Finland",
    name: "Finland",
    flagUrl: "/flags/finland.svg",
    tagline: "Innovation-focused education system",
    description: "Finland offers world-leading education with emphasis on innovation, critical thinking, and student-centered learning.",
  },
  {
    id: "Turkey",
    name: "Turkey",
    flagUrl: "/flags/turkey.svg",
    tagline: "Crossroads of cultures with affordable education",
    description: "Turkey offers cost-effective education blending European standards with rich cultural history.",
  },
  {
    id: "Spain",
    name: "Spain",
    flagUrl: "/flags/spain.svg",
    tagline: "Vibrant culture and affordable living",
    description: "Spain offers high-quality programs across many fields with a warm climate and rich cultural heritage.",
  },
  {
    id: "NewZealand",
    name: "New Zealand",
    flagUrl: "/flags/newzeland.svg",
    tagline: "Stunning landscapes with world-class education",
    description: "New Zealand delivers research-driven education with high academic standards and stunning natural beauty.",
  },
  {
    id: "Malta",
    name: "Malta",
    flagUrl: "/flags/malta.svg",
    tagline: "Mediterranean lifestyle with English education",
    description: "Malta offers modern, English-speaking education with affordable tuition and a welcoming Mediterranean lifestyle.",
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
    educationSystem: "The United Kingdom delivers a high-quality, globally respected education experience with efficient degree structures that save students time and money. UK universities combine academic rigor with real-world relevance, offering strong industry connections, practical learning, and excellent employment outcomes. International students benefit from a safe, multicultural environment and the opportunity to work during and after their studies through the Graduate Route. With its rich cultural heritage, world-class teaching, and supportive student services, the UK remains a top choice for learners seeking a fast, focused, and career-driven international education.  ",
    requirements: [
     "IELTS 6.0+",
     "TOEFL 80+ or equivalent",
     "Academic transcripts",
     "Statement of purpose",
     "Letters of recommendation",
     "Scholarships are available",
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
      "Merit and need based Scholarships are available",
    ],
    educationSystem: "The United States offers a world-leading education system built on innovation, flexibility, and global recognition. Students gain access to top-ranked universities, modern research facilities, and industry-driven programs designed to prepare them for high-impact careers. With opportunities to customize courses, participate in cutting-edge research, and gain practical experience through internships and OPT, the U.S. provides a powerful platform for personal, academic, and professional growth. Its diverse campuses, advanced technology ecosystem, and unmatched career opportunities make it a premier destination for ambitious international students.",
    requirements: [
      "TOEFL 80+ or IELTS 5.5+",
      "Duolingo 95+ or Medium of Instruction Letter",
      "Academic transcripts",
      "Essays and recommendation letters (Optional)",
    ],
    intakes: ["Fall (August/September - Main)", "Spring (January)", "Summer (May - Limited)"],
    studyLevels: ["Bachelor's Degree", "Master's Degree", "PhD" ,"Pathway programs"],
    estimatedCost: {
      tuition: "$10,000 - $60,000 per year",
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
      "Merit and need based Scholarships are available",
    ],
    educationSystem: "Canada offers a highly respected, student-friendly education system known for academic excellence, modern research facilities, and a strong focus on practical, career-ready learning. International students benefit from a safe and welcoming multicultural environment, affordable tuition compared to other major destinations, and flexible programs that balance theory with real industry experience. With opportunities to work during studies, gain post-graduation work permits, and even explore long-term immigration pathways, Canada provides a clear route from quality education to meaningful career growth. It’s a destination that combines world-class learning, supportive communities, and strong professional opportunities  making it a top choice for students seeking a brighter future.",
    requirements: [
      "TOEFL 80+ or IELTS 5.5+",
      "Duolingo 95+ or Medium of Instruction Letter",
      "Academic transcripts",
      "Essays and recommendation letters",
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
      "Scholarships are available"
    ],
    educationSystem: "Australia provides a globally respected education system known for its high academic standards, innovative teaching methods, and strong focus on employability. Universities offer practical, industry-connected programs and access to world-class research facilities across fields like technology, health sciences, and business. International students benefit from a safe, inclusive society, excellent living standards, and generous work opportunities during and after their studies through the Post-Study Work Visa. With its stunning landscapes, multicultural campuses, and strong career pathways, Australia remains a top choice for students seeking a balanced and future-focused international education.",
    requirements: [
      "IELTS 6.0+ or TOEFL 80+",
      "Academic transcripts",
      "Statement of purpose", 
    ],
    intakes: ["February (Main)", "July (Secondary)"],
    studyLevels: ["Bachelor's Degree", "Master's Degree", "PhD"],
    estimatedCost: {
      tuition: "AUD 15,000 - 35,000 per year",
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
      "Full and Half Scholarships are available",
    ],
    educationSystem: "Germany is renowned for its academically strong and research-oriented education system, with many public universities offering low or even zero tuition fees. Students gain access to cutting-edge facilities, innovative engineering and technology programs, and strong industry ties especially in automotive, manufacturing, and STEM fields. The country’s practical, skills-focused approach helps students transition smoothly into the workforce, supported by generous post-study work opportunities. With a high standard of living, vibrant culture, and globally recognized degrees, Germany is an ideal destination for students seeking quality education at a highly affordable cost.",
    requirements: [
      "IELTS 6.0+",
      "Academic transcripts",
      "Blocked account (€11,208 per year)",
      "Statement of Purpose",
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
      "Scholarships are available",
      "Central location for European travel",
    ],
    educationSystem: "France offers a prestigious and culturally rich education experience, combining world-class universities, elite “Grandes Écoles,” and highly affordable tuition costs. Students benefit from strong academic programs across arts, engineering, business, and science, supported by advanced research institutions and influential industry partnerships. The country’s emphasis on creativity, critical thinking, and innovation prepares graduates for global careers. With generous scholarships, a high standard of living, and exceptional cultural diversity, France provides an inspiring environment for international students seeking both academic excellence and personal growth.",
    requirements: [
      "TOEFL 80+",
      "IELTS 6.0+ or equivalent",
      "Academic transcripts",
      "Motivation letter and CV",
    ],
    intakes: ["Fall (September)", "Spring (January/February - Limited)"],
    studyLevels: ["Bachelor's Degree", "Master's Degree", "PhD", "Grande École Programs"],
    estimatedCost: {
      tuition: "€7,200 - €15,200 per year",
      living: "€600 - €800 per month",
    },
    topUniversities: ["Paris Sorbonne University", "École Polytechnique", "HEC Paris", "Sciences Po", "ENS Paris"],
  },
  Italy: {
    whyStudy: [
      "Affordable tuition",
      "Full Scholarships are available",
      "Excellent Work Opportunities",
      "Central location for European travel",
    ],
    educationSystem: "Italy combines rich cultural heritage with a reputable academic tradition, offering internationally recognized degrees in fields such as arts, design, engineering, business, and medicine. Many universities provide affordable tuition and Full scholarship opportunities, making high-quality education accessible to international students. The learning environment emphasizes both theoretical foundations and real-world application, supported by modern facilities and experienced faculty. With its warm lifestyle, historic cities, and welcoming student communities, Italy offers an inspiring and enriching environment to study, grow, and explore new opportunities.",
    requirements: [
      "TOEFL 80+, Duolingo 100+ or MOI letter for masters applicant",
      "IELTS 6.0+ or equivalent",
      "Academic transcripts",
    ],
    intakes: ["Fall (September)"],
    studyLevels: ["Bachelor's Degree", "Master's Degree", "PhD"],
    estimatedCost: {
      tuition: "€0 - €2000 per month",
      living: "€900 - €3500 per year",
    },
    topUniversities: ["University of Bologna", "University of Padua", "University of Rome", "University of Florence", "University of Naples"],
  },
  Ireland: {
    whyStudy: [
      "Affordable tuition",
      "High-quality education",
      "Post-study work options",
      "Scholarships are available",
    ],
    educationSystem: "Ireland offers a high-quality education system rooted in innovation, technology, and strong industry collaboration, especially in IT, pharmaceuticals, and finance. Its universities emphasize practical learning, research excellence, and skill development, helping students stand out in competitive job markets. International students enjoy a friendly, English-speaking environment and access to work opportunities both during studies and after graduation through Ireland’s flexible post-study visa options. With its vibrant culture, modern campuses, and rapidly growing economy, Ireland provides a supportive and future-ready destination for global learners.",
    requirements: [
      "TOEFL 80+",
      "IELTS 6.5+ or equivalent",
      "Academic transcripts",
      "Motivation letter and CV",
    ],
    intakes: ["Fall (September)", "Spring (January/February - Limited)"],
    studyLevels: ["Bachelor's Degree", "Master's Degree", "PhD"],
    estimatedCost: {
      tuition: "€7,200 - €15,200 per year",
      living: "€700 - €1,200 per month",
    },
    topUniversities: ["University of Dublin", "University of Cork", "University of Limerick", "University of Galway", "University of Waterford"],
  },
  Cyprus: {
    whyStudy: [
      "Affordable tuition at public universities",
      "Safe and multi-cultural environment",
      "Strong business and engineering schools",
      "Great weather with opportunities for part-time work",
      "50% - 80% Scholarships are available",
    ],
    educationSystem: "Cyprus provides a safe, welcoming, and student-friendly environment with modern universities offering internationally recognized degrees, especially in business, tourism, IT, and health sciences. The education system focuses on interactive learning, small class sizes, and strong academic support, ensuring students get personalized attention. Affordable tuition fees, generous scholarships, and opportunities to work during studies make Cyprus an appealing option for students seeking quality education at a manageable cost. Combined with its warm climate, multicultural atmosphere, and relaxed lifestyle, Cyprus is an excellent destination for international students.",
    requirements: [
      "TOEFL 80+", "Duolingo 95+ or MOI letter",
      "IELTS 6.5+ or equivalent",
      "Academic transcripts",
      "Motivation letter and CV (Opitional)",
    ],
    intakes: ["Fall (September)", "Spring (January/February - Limited)"],
    studyLevels: ["Bachelor's Degree", "Master's Degree", "PhD"],
    estimatedCost: {
      tuition: "4000$-10,000$ per year",
      living: "350$-600$ per month",
    },
    topUniversities: ["Cyprus International University", "European University Cyprus","Girne American University", "The Eastern Mediterranean University"],
  },
  Finland: {
    whyStudy: [
      "world-class, research-focused education",
      "strong post-study work opportunities",
      "Happiest Country with high living standards",
    ],
    educationSystem: "Finland is known for its world-leading education system, emphasizing innovation, critical thinking, and student-centered learning. Universities offer cutting-edge programs in technology, engineering, sustainability, and design, backed by strong research environments and close industry collaboration. Students enjoy a high standard of living, safe communities, and modern campuses equipped with advanced facilities. English-taught programs, scholarship opportunities, and pathways to stay and work after graduation make Finland a top destination for students seeking a forward-thinking, high-quality, and future-ready education experience.",
    requirements: [
      "TOEFL 80+",
      "IELTS 6.5+ or equivalent",
      "Academic transcripts",
      "Motivation letter and CV",
      "Scholarships are available",
    ],
    intakes: ["Fall (September)"],
    studyLevels: ["Bachelor's Degree", "Master's Degree", "PhD"],
    estimatedCost: {
      tuition: "€5,000 - €15,200 per year",
      living: "€900 - €1000 per month",
    },
    topUniversities: ["University of Helsinki", "Aalto University",
"University of Turku"],
  },
  Turkey: {
    whyStudy: [
      "Affordable tuition",
      "High-quality education",
      "Diverse cultural experiences",
      "Scholarships are available",
    ],
    educationSystem: "Turkey offers a cost-effective and rapidly modernizing education system that blends European academic standards with rich cultural history. Universities provide a wide range of English-taught programs, strong engineering and medical faculties, and affordable tuition and living costs. International students enjoy a welcoming environment, modern campuses, and access to vibrant city life in destinations like Istanbul, Ankara, and Izmir. With growing research activity, strategic global location, and improving post-study opportunities, Turkey is an attractive destination for students seeking high value and diverse academic experiences.",
    requirements: [
      "TOEFL 80+",
      "IELTS 6.5+ or equivalent",
      "Academic transcripts",
      "Motivation letter and CV (Optional)",
    ],
    intakes: ["Fall (September)", "Spring (January/February - Limited)"],
    studyLevels: ["Bachelor's Degree", "Master's Degree", "PhD"],
    estimatedCost: {
      tuition: "€2,000 - €5,000 per year",
      living: "€400 - €650 per month",
    },
    topUniversities: ["Middle East Technical University", "Bogazici University",
"Istanbul Technical University", "Istanbul University", "Istanbul University of Science and Technology"]
  },
  Spain: {
    whyStudy: [
      "Affordable education",
      "High-Quality Education",
      "Great Climate",
      "Strategic location for European travel",
      "Scholarships are available", 
    ],
    educationSystem: "Spain offers a vibrant, affordable, and academically strong education system that attracts students from around the world. Its universities provide high-quality programs across fields like business, engineering, arts, hospitality, and health sciences, with many degrees available in English. Students benefit from a warm climate, rich cultural heritage, and an active social environment, creating a balanced and enjoyable study experience. With reasonable tuition fees, scholarship opportunities, and a growing focus on innovation and research, Spain is an excellent destination for students seeking quality education paired with an enriching lifestyle.",
    requirements: [
      "TOEFL 80+",
      "IELTS 6.5+ or equivalent",
      "Academic transcripts",
      "Motivation letter and CV",
    ],
    intakes: ["Fall (September)"],
    studyLevels: ["Bachelor's Degree", "Master's Degree", "PhD"],
    estimatedCost: {
      tuition: "Public universities 3000$ private upto 20,000$",
      living: "€700 - €1,300 per month",
    },
    topUniversities: ["Universidad Complutense de Madrid", "Universidad Autónomade Madrid", "Universidad de Barcelona", "Universidad de Sevilla", "Universidad de Valencia"],
  },
  NewZealand: {
    whyStudy: [
      "High-Quality education",
      "Excellent post-study work and residency pathways",
      "Strong business and engineering schools",
    ],
    educationSystem: "New Zealand delivers a world-class, research-driven education system known for its high academic standards, modern facilities, and emphasis on practical, industry-aligned learning. Students enjoy a safe, welcoming environment with stunning natural landscapes and a strong focus on student well being. Universities offer globally recognized degrees, small class sizes, and excellent support for international learners. With generous post-study work options and opportunities to gain real-world experience, New Zealand provides a clear pathway from high-quality education to promising career growth in a stable and friendly environment.",
    requirements: [
      "TOEFL 80+",
      "IELTS 6.5+ or equivalent",
      "Academic transcripts",
      "Motivation letter and CV",
    ],
    intakes: ["Fall (September)", "Spring (January/February - Limited)"],
    studyLevels: ["Bachelor's Degree", "Master's Degree", "PhD"],
    estimatedCost: {
      tuition: "27,000$ - 75,000$ per year",
      living: "12,000$ - 15,000$ per month",
    },
    topUniversities: ["University of Auckland", "University of Otago",
"University of Canterbury", "University of Waikato", "University of Massey"],
  },
  Malta: {
    whyStudy: [
      "Affordable tuition",
      "World-renowned art, culture, and cuisine",
      "Strong business and engineering schools",
      "Central location for European travel",
      "Excellent work opportunities for international students",
    ],
    educationSystem: "Malta offers a modern, English-speaking education system with internationally recognized universities, affordable tuition, and a welcoming Mediterranean lifestyle. Students benefit from high-quality programs in areas like business, IT, tourism, maritime studies, and healthcare, supported by small class sizes and strong academic guidance. The country provides a safe environment, a vibrant cultural scene, and excellent weather year-round, making it easy for students to balance studies and daily life. With growing opportunities for part-time work, practical learning, and career development, Malta is an attractive destination for students seeking quality education in a relaxed yet future-focused setting.",
    requirements: [
      "TOEFL 80+", "Duolingo 100+",
      "IELTS 6.0+ or equivalent",
      "Academic transcripts",
      "Motivation letter and CV",
    ],
    intakes: ["Fall (September)"],
    studyLevels: ["Bachelor's Degree", "Master's Degree", "PhD"],
    estimatedCost: {
      tuition: "€4,000 - €8,000 per year",
      living: "€500 - €800 per month",
    },
    topUniversities: ["GBSB Global Business School", "The University of Malta", "Malta College of Arts, Science and Technology"],
  },
  
};

type ProcessStepData = {
  step: number;
  title: string;
  description: string;
  icon: IconName;
};

export const processSteps: ProcessStepData[] = [
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
