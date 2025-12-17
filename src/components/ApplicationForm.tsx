import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Send, Upload } from "lucide-react";
import { destinations } from "@/lib/constants";
import useAuth from "@/hooks/useAuth";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  telegramUsername: z.string().min(2, "Telegram username is required").max(50),
  currentAcademicStatus: z.string().min(2, "Please specify your current academic status").max(200),
  destinationCountry: z.string().min(1, "Please select a destination country"),
  studyLevel: z.string().min(1, "Please select your intended study level"),
  phoneNumber: z.string().optional(),
  documents: z.instanceof(FileList).optional(),
  additionalInfo: z.string().max(1000).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ApplicationFormProps {
  preSelectedCountry?: string;
}

const ApplicationForm = ({ preSelectedCountry }: ApplicationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      telegramUsername: "",
      currentAcademicStatus: "",
      destinationCountry: preSelectedCountry || "",
      studyLevel: "",
      phoneNumber: "",
      documents: undefined,
      additionalInfo: "",
    },
  });

  useEffect(() => {
    if (preSelectedCountry) {
      form.setValue("destinationCountry", preSelectedCountry);
    }
  }, [preSelectedCountry, form]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      if (!user) {
        const message = 'Please log in to submit your application.';
        toast.error(message);
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Application submitted:", data);
      toast.success("Application submitted successfully! We'll contact you soon.");
      form.reset();
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="telegramUsername"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telegram Username</FormLabel>
              <FormControl>
                <Input placeholder="@username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currentAcademicStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Academic Status</FormLabel>
              <FormControl>
                <Input placeholder="e.g., High School Graduate, Bachelor's Student" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="destinationCountry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination Country</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {destinations.map((dest) => (
                    <SelectItem key={dest.id} value={dest.name}>
                      <div className="flex items-center gap-2">
                        <img
                          src={dest.flagUrl}
                          alt={dest.name}
                          className="w-6 h-4 object-cover rounded shadow-sm"
                        />
                        <span>{dest.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="studyLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Intended Study Level</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select study level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                  <SelectItem value="master">Master's Degree (MSc)</SelectItem>
                  <SelectItem value="phd">PhD / Doctorate</SelectItem>
                  <SelectItem value="work">Work Visa</SelectItem>
                  <SelectItem value="language">Language Course</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="documents"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Upload Documents</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    multiple
                    onChange={(e) => onChange(e.target.files)}
                    {...field}
                    className="cursor-pointer"
                  />
                  <Upload className="text-muted-foreground" size={20} />
                </div>
              </FormControl>
              <p className="text-sm text-muted-foreground">
                Accepted formats: PDF, DOC, DOCX, JPG, PNG
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="additionalInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Information</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us more about your study abroad goals..."
                  className="min-h-32 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" variant="hero" size="lg" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Submitting..." : "Submit Application"}
          <Send size={20} />
        </Button>
      </form>
    </Form>
  );
};

export default ApplicationForm;
