import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  Building2,
  Users,
  GraduationCap,
  Briefcase,
  Target,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Globe,
  CheckCircle,
  Send,
  Loader2,
  Award,
  TrendingUp,
  Handshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, X } from "lucide-react";

const ContactPartners = () => {
  const [activeTab, setActiveTab] = useState('individual');
  const [individualForm, setIndividualForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    profession: "",
    expertise: [],
    message: "",
    country: "",
  });
  const [companyForm, setCompanyForm] = useState({
    organizationName: "",
    contactPerson: "",
    email: "",
    phone: "",
    organizationType: "",
    partnershipInterest: [],
    message: "",
    country: "",
    website: "",
    documents: [],
  });
  const [individualDocuments, setIndividualDocuments] = useState({
    passport: null,
    resume: null,
  });
  const [companyDocuments, setCompanyDocuments] = useState({
    businessLicense: null,
    companyProfile: null,
  });
  const [individualSubmitting, setIndividualSubmitting] = useState(false);
  const [companySubmitting, setCompanySubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const partnershipOptions = [
    { id: "university", label: "University Partnership" },
    { id: "recruitment", label: "Student Recruitment" },
    { id: "education", label: "Education Services" },
    { id: "technology", label: "Technology Integration" },
    { id: "marketing", label: "Marketing Collaboration" },
    { id: "other", label: "Other Opportunities" },
  ];

  const expertiseOptions = [
    { id: "education", label: "Education" },
    { id: "technology", label: "Technology" },
    { id: "marketing", label: "Marketing" },
    { id: "other", label: "Other" },
  ];
  const apiBaseURL = import.meta.env.VITE_API_BASE_URL;
  const handleIndividualChange = (e) => {
    const { name, value } = e.target;
    setIndividualForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExpertiseToggle = (id) => {
    setIndividualForm(prev => ({
      ...prev,
      expertise: prev.expertise.includes(id)
        ? prev.expertise.filter(item => item !== id)
        : [...prev.expertise, id]
    }));
  };

  const handlePartnershipToggle = (id) => {
    setCompanyForm(prev => ({
      ...prev,
      partnershipInterest: prev.partnershipInterest.includes(id)
        ? prev.partnershipInterest.filter(item => item !== id)
        : [...prev.partnershipInterest, id]
    }));
  };


  const handleIndividualSubmit = async (e) => {
    e.preventDefault();
    setIndividualSubmitting(true);

    const formData = new FormData();
    formData.append('type', 'individual');
    formData.append('fullName', individualForm.fullName);
    formData.append('email', individualForm.email);
    formData.append('phone', individualForm.phone);
    formData.append('profession', individualForm.profession);
    formData.append('country', individualForm.country);
    formData.append('message', individualForm.message);
    formData.append('expertise', JSON.stringify(individualForm.expertise));

    if (individualDocuments.passport) {
      formData.append('passport', individualDocuments.passport);
    }
    if (individualDocuments.resume) {
      formData.append('resume', individualDocuments.resume);
    }

    try {
      const response = await fetch(`${apiBaseURL}/api/partners-contact/submit-individual`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit form');
      }

      toast.success(data.message || 'Individual partnership inquiry submitted successfully!');
      setIsSubmitted(true);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(error.message || 'Failed to submit form. Please try again.');
    } finally {
      setIndividualSubmitting(false);
    }
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    setCompanySubmitting(true);

    const formData = new FormData();
    formData.append('type', 'company');
    formData.append('organizationName', companyForm.organizationName);
    formData.append('contactPerson', companyForm.contactPerson);
    formData.append('email', companyForm.email);
    formData.append('phone', companyForm.phone);
    formData.append('organizationType', companyForm.organizationType);
    formData.append('country', companyForm.country);
    formData.append('website', companyForm.website);
    formData.append('message', companyForm.message);
    formData.append('partnershipInterest', JSON.stringify(companyForm.partnershipInterest));

    if (companyDocuments.businessLicense) {
      formData.append('businessLicense', companyDocuments.businessLicense);
    }
    if (companyDocuments.companyProfile) {
      formData.append('companyProfile', companyDocuments.companyProfile);
    }

    try {
      const response = await fetch(`${apiBaseURL}/partners-contact/submit-company`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit form');
      }

      toast.success(data.message || 'Company partnership inquiry submitted successfully!');
      setIsSubmitted(true);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(error.message || 'Failed to submit form. Please try again.');
    } finally {
      setCompanySubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-background">
        <section className="section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-primary/5 rounded-2xl p-12 border border-primary/20">
              <CheckCircle className="mx-auto h-16 w-16 text-primary mb-6" />
              <h1 className="text-4xl font-bold mb-4">
                Thank You for Your Interest!
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Your partnership inquiry has been successfully submitted. Our team will review your information and get back to you within 2-3 business days.
              </p>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  In the meantime, feel free to explore our <Link to="/about" className="underline hover:text-primary">about page</Link> to learn more about ScholarsHub.
                </p>
                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    setIndividualForm({
                      fullName: '',
                      email: '',
                      phone: '',
                      profession: '',
                      country: '',
                      expertise: [],
                      message: '',
                    });
                    setCompanyForm({
                      organizationName: '',
                      contactPerson: '',
                      email: '',
                      phone: '',
                      organizationType: '',
                      country: '',
                      website: '',
                      partnershipInterest: [],
                      message: '',
                      documents: [],
                    });
                    setIndividualDocuments({ passport: null, resume: null });
                    setCompanyDocuments({ businessLicense: null, companyProfile: null });
                  }}
                  className="bg-primary hover:bg-primary/90"
                >
                  Submit Another Inquiry
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Partner with <span className="gradient-text">ScholarsHub</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Join us in transforming international education. Together, we can create
              amazing opportunities for students worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Partnership Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Partner with ScholarsHub?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the benefits of collaborating with a leading international education platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <Users className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Global Reach</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with students from over 50 countries seeking international education
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <TrendingUp className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Growth Opportunity</h3>
                <p className="text-sm text-muted-foreground">
                  Expand your institution's visibility and student enrollment globally
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <Handshake className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Long-term Partnership</h3>
                <p className="text-sm text-muted-foreground">
                  Build lasting relationships with reliable educational partners worldwide
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <Award className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Quality Assurance</h3>
                <p className="text-sm text-muted-foreground">
                  Join a network of verified and trusted educational institutions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Business Cooperation Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Business <span className="gradient-text">Cooperation</span>
              </h2>
              <p className="text-2xl text-primary font-semibold mb-8">Be a Part of Us</p>
            </div>

            <div className="bg-card rounded-2xl shadow-lg p-8 md:p-12 text-left space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Scholars Hub was founded in 2015 and has grown into a trusted study-abroad support platform connecting students with universities, colleges, and educational partners worldwide. As we continue to expand our global network and strengthen our international presence, we welcome collaborations that help students access quality education across 15+ countries.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                We invite qualified educational institutions, language schools, training centers, consultancy firms, and individual partners to join our network and work with us to guide students toward meaningful academic opportunities.
              </p>

              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="text-xl font-semibold mb-4 text-primary">How to Join Us</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary font-semibold text-sm">1</span>
                    </div>
                    <p className="text-muted-foreground">Simply fill out the online partnership form below.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary font-semibold text-sm">2</span>
                    </div>
                    <p className="text-muted-foreground">Our team will review your information and get back to you within 48 hours with the next steps.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
              <p className="text-muted-foreground">
                Fill out the form below and our partnership team will contact you soon
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Individual Form */}
              <Card className={`border-2 shadow-lg transition-all duration-300`}>
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Users className="h-5 w-5" />
                    Individual Partnership
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    For individual professionals, educators, and consultants
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleIndividualSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={individualForm.fullName}
                        onChange={handleIndividualChange}
                        placeholder="Your full name"
                        required
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={individualForm.email}
                        onChange={handleIndividualChange}
                        placeholder="your.email@example.com"
                        required
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={individualForm.phone}
                        onChange={handleIndividualChange}
                        placeholder="+1 (234) 567-890"
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profession">Profession *</Label>
                      <Select value={individualForm.profession} onValueChange={(value) => setIndividualForm(prev => ({ ...prev, profession: value }))}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select your profession" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="educator">Educator</SelectItem>
                          <SelectItem value="consultant">Consultant</SelectItem>
                          <SelectItem value="researcher">Researcher</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        name="country"
                        value={individualForm.country}
                        onChange={handleIndividualChange}
                        placeholder="Your country"
                        required
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Areas of Expertise *</Label>
                      <div className="space-y-2">
                        {[
                          { id: "education", label: "Education & Teaching" },
                          { id: "technology", label: "Technology & IT" },
                          { id: "marketing", label: "Marketing & Outreach" },
                          { id: "consulting", label: "Consulting & Advisory" },
                          { id: "research", label: "Research & Analysis" },
                          { id: "other", label: "Other" },
                        ].map((expertise) => (
                          <div key={expertise.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={expertise.id}
                              checked={individualForm.expertise.includes(expertise.id)}
                              onCheckedChange={() => handleExpertiseToggle(expertise.id)}
                            />
                            <Label htmlFor={expertise.id} className="text-sm">
                              {expertise.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Tell us about your partnership interests</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={individualForm.message}
                        onChange={handleIndividualChange}
                        placeholder="How would you like to partner with us?"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Passport / ID Card (Optional)</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <input
                          type="file"
                          id="individual-passport"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const files = Array.from(e.target.files);
                            setIndividualDocuments(prev => ({
                              ...prev,
                              passport: files[0] || null
                            }));
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor="individual-passport"
                          className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                        >
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">
                            Click to upload Passport/ID Card (PDF, JPG, PNG)
                          </span>
                        </label>
                      </div>
                      {individualDocuments.passport && (
                        <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm truncate">{individualDocuments.passport.name}</span>
                          <button
                            type="button"
                            onClick={() => setIndividualDocuments(prev => ({ ...prev, passport: null }))}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Resume / CV (Optional)</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <input
                          type="file"
                          id="individual-resume"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const files = Array.from(e.target.files);
                            setIndividualDocuments(prev => ({
                              ...prev,
                              resume: files[0] || null
                            }));
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor="individual-resume"
                          className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                        >
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">
                            Click to upload Resume/CV (PDF, DOC, DOCX)
                          </span>
                        </label>
                      </div>
                      {individualDocuments.resume && (
                        <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm truncate">{individualDocuments.resume.name}</span>
                          <button
                            type="button"
                            onClick={() => setIndividualDocuments(prev => ({ ...prev, resume: null }))}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={individualSubmitting || !individualForm.fullName || !individualForm.email || !individualForm.country || !individualForm.profession || individualForm.expertise.length === 0}
                      className="w-full h-10"
                    >
                      {individualSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Submit as Individual
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Company Form */}
              <Card className={`border-2 shadow-lg transition-all duration-300`}>
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Building2 className="h-5 w-5" />
                    Company Partnership
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    For organizations, institutions, and businesses
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleCompanySubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="organizationName">Organization Name *</Label>
                      <Input
                        id="organizationName"
                        name="organizationName"
                        value={companyForm.organizationName}
                        onChange={handleCompanyChange}
                        placeholder="Your organization's name"
                        required
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPerson">Contact Person *</Label>
                      <Input
                        id="contactPerson"
                        name="contactPerson"
                        value={companyForm.contactPerson}
                        onChange={handleCompanyChange}
                        placeholder="Name of contact person"
                        required
                        className="h-10"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={companyForm.email}
                          onChange={handleCompanyChange}
                          placeholder="contact@company.com"
                          required
                          className="h-10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={companyForm.phone}
                          onChange={handleCompanyChange}
                          placeholder="+1 (234) 567-890"
                          className="h-10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="organizationType">Organization Type *</Label>
                        <Select value={companyForm.organizationType} onValueChange={(value) => setCompanyForm(prev => ({ ...prev, organizationType: value }))}>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="university">University</SelectItem>
                            <SelectItem value="company">Company</SelectItem>
                            <SelectItem value="nonprofit">Non-Profit</SelectItem>
                            <SelectItem value="government">Government</SelectItem>
                            <SelectItem value="startup">Startup</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country">Country *</Label>
                        <Input
                          id="country"
                          name="country"
                          value={companyForm.country}
                          onChange={handleCompanyChange}
                          placeholder="Country"
                          required
                          className="h-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        name="website"
                        value={companyForm.website}
                        onChange={handleCompanyChange}
                        placeholder="https://www.yourwebsite.com"
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Partnership Interests *</Label>
                      <div className="space-y-2">
                        {[
                          { id: "university", label: "University Partnership" },
                          { id: "recruitment", label: "Student Recruitment" },
                          { id: "education", label: "Education Services" },
                          { id: "technology", label: "Technology Integration" },
                          { id: "marketing", label: "Marketing Collaboration" },
                          { id: "other", label: "Other Opportunities" },
                        ].map((interest) => (
                          <div key={interest.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={interest.id}
                              checked={companyForm.partnershipInterest.includes(interest.id)}
                              onCheckedChange={() => handlePartnershipToggle(interest.id)}
                            />
                            <Label htmlFor={interest.id} className="text-sm">
                              {interest.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Additional Information</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={companyForm.message}
                        onChange={handleCompanyChange}
                        placeholder="Tell us more about your partnership proposal"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Business License (Optional)</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <input
                          type="file"
                          id="company-license"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const files = Array.from(e.target.files);
                            setCompanyDocuments(prev => ({
                              ...prev,
                              businessLicense: files[0] || null
                            }));
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor="company-license"
                          className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                        >
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">
                            Click to upload Business License (PDF, JPG, PNG)
                          </span>
                        </label>
                      </div>
                      {companyDocuments.businessLicense && (
                        <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm truncate">{companyDocuments.businessLicense.name}</span>
                          <button
                            type="button"
                            onClick={() => setCompanyDocuments(prev => ({ ...prev, businessLicense: null }))}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Company Profile (Optional)</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <input
                          type="file"
                          id="company-profile"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const files = Array.from(e.target.files);
                            setCompanyDocuments(prev => ({
                              ...prev,
                              companyProfile: files[0] || null
                            }));
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor="company-profile"
                          className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                        >
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">
                            Click to upload Company Profile (PDF, DOC, DOCX)
                          </span>
                        </label>
                      </div>
                      {companyDocuments.companyProfile && (
                        <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm truncate">{companyDocuments.companyProfile.name}</span>
                          <button
                            type="button"
                            onClick={() => setCompanyDocuments(prev => ({ ...prev, companyProfile: null }))}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={companySubmitting || !companyForm.organizationName || !companyForm.contactPerson || !companyForm.email || !companyForm.country || !companyForm.organizationType || companyForm.partnershipInterest.length === 0}
                      className="w-full h-10"
                    >
                      {companySubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Submit as Company
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Other Ways to Connect</h2>
              <p className="text-muted-foreground">
                Reach out to our partnership team directly
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="text-center p-6 border-2 hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <Mail className="mx-auto h-12 w-12 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Email</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    For partnership inquiries
                  </p>
                  <a
                    href="mailto:partners@scholarshubglobal.com"
                    className="text-primary hover:underline font-medium"
                  >
                    partners@scholarshubglobal.com
                  </a>
                </CardContent>
              </Card>

              <Card className="text-center p-6 border-2 hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <Phone className="mx-auto h-12 w-12 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Phone</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Available 24/7
                  </p>
                  <a
                    href="tel:+251943948464"
                    className="text-primary hover:underline font-medium"
                  >
                    +251 94 394 8464
                  </a>
                </CardContent>
              </Card>
              {/* 
              <Card className="text-center p-6 border-2 hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <MapPin className="mx-auto h-12 w-12 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Office</h3>
                  <p className="text-sm text-muted-foreground">
                    Addis Ababa, Ethiopia
                  </p>
                </CardContent>
              </Card> */}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPartners;
