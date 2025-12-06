import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { taskApplicationService, ApplicantType } from "@/services/taskApplicationService";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, Image as ImageIcon, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const baseSchema = z.object({
  applicant_type: z.enum(['undergraduate', 'masters', 'phd']),
  passport: z.instanceof(FileList).refine((files) => files.length > 0, "Passport is required"),
  national_identity_card: z.instanceof(FileList).optional(),
  highschool_certificates: z.instanceof(FileList).refine((files) => files.length > 0, "High school certificates are required"),
  transcripts: z.instanceof(FileList).refine((files) => files.length > 0, "Transcripts are required"),
  recommendation_letter_1: z.instanceof(FileList).optional(),
  recommendation_letter_2: z.instanceof(FileList).optional(),
  student_cv_resume: z.instanceof(FileList).optional(),
  statement_of_purpose: z.instanceof(FileList).optional(),
  birth_certificate: z.instanceof(FileList).optional(),
  english_proficiency: z.instanceof(FileList).optional(),
});

const mastersSchema = baseSchema.extend({
  recommendation_letter_3: z.instanceof(FileList).optional(),
  bachelors_degree_certificate: z.instanceof(FileList).refine((files) => files.length > 0, "Bachelor's degree certificate is required"),
  bachelors_degree_transcript: z.instanceof(FileList).refine((files) => files.length > 0, "Bachelor's degree transcript is required"),
  diploma: z.instanceof(FileList).optional(),
});

const phdSchema = mastersSchema.extend({
  thesis: z.instanceof(FileList).refine((files) => files.length > 0, "Thesis is required"),
});

type FormData = z.infer<typeof baseSchema> & {
  recommendation_letter_3?: FileList;
  bachelors_degree_certificate?: FileList;
  bachelors_degree_transcript?: FileList;
  diploma?: FileList;
  thesis?: FileList;
};

const Tasks = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicantType, setApplicantType] = useState<ApplicantType | "">("");

  const getSchema = () => {
    if (applicantType === "phd") return phdSchema;
    if (applicantType === "masters") return mastersSchema;
    return baseSchema;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(getSchema()),
    mode: "onChange",
  });

  const watchedApplicantType = watch("applicant_type");

  const handleApplicantTypeChange = (value: ApplicantType) => {
    setApplicantType(value);
    setValue("applicant_type", value);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const payload: any = {
        applicant_type: data.applicant_type,
        passport: data.passport[0],
        highschool_certificates: data.highschool_certificates[0],
        transcripts: data.transcripts[0],
      };

      // Add optional base documents if provided
      if (data.recommendation_letter_1?.[0]) {
        payload.recommendation_letter_1 = data.recommendation_letter_1[0];
      }
      if (data.recommendation_letter_2?.[0]) {
        payload.recommendation_letter_2 = data.recommendation_letter_2[0];
      }
      if (data.student_cv_resume?.[0]) {
        payload.student_cv_resume = data.student_cv_resume[0];
      }
      if (data.statement_of_purpose?.[0]) {
        payload.statement_of_purpose = data.statement_of_purpose[0];
      }
      if (data.birth_certificate?.[0]) {
        payload.birth_certificate = data.birth_certificate[0];
      }

      if (data.national_identity_card?.[0]) {
        payload.national_identity_card = data.national_identity_card[0];
      }
      if (data.english_proficiency?.[0]) {
        payload.english_proficiency = data.english_proficiency[0];
      }

      if (data.applicant_type === "masters" || data.applicant_type === "phd") {
        payload.recommendation_letter_3 = data.recommendation_letter_3?.[0];
        payload.bachelors_degree_certificate = data.bachelors_degree_certificate?.[0];
        payload.bachelors_degree_transcript = data.bachelors_degree_transcript?.[0];
        if (data.diploma?.[0]) {
          payload.diploma = data.diploma[0];
        }
      }

      if (data.applicant_type === "phd") {
        payload.thesis = data.thesis?.[0];
      }

      await taskApplicationService.createTaskApplication(payload);
      toast({
        title: "Success",
        description: "Task application submitted successfully!",
      });
      navigate("/my-applications");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to submit application",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const FileUploadField = ({
    name,
    label,
    required = false,
    accept = ".pdf,.doc,.docx,.png,.jpg,.jpeg",
    description,
  }: {
    name: keyof FormData;
    label: string;
    required?: boolean;
    accept?: string;
    description?: string;
  }) => {
    const isImage = name.includes("passport") || name.includes("birth_certificate") || name.includes("national_identity_card");
    const error = errors[name as keyof typeof errors];

    return (
      <div className="space-y-2">
        <Label htmlFor={name}>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        <div className="flex items-center gap-4">
          <Input
            id={name}
            type="file"
            accept={isImage ? "image/*" : accept}
            {...register(name as any)}
            className="cursor-pointer"
          />
          {isImage ? (
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
          ) : (
            <FileText className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        {error && (
          <p className="text-sm text-destructive">{error.message as string}</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden py-20 bg-secondary text-secondary-foreground">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            📋 Document Submission
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Task Applications
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Upload all required documents for your application. Please ensure all files are clear and legible.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-8 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Application Documents</CardTitle>
              <CardDescription>
                Select your applicant type and upload the required documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="applicant_type">
                    Applicant Type <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={applicantType}
                    onValueChange={(value) => handleApplicantTypeChange(value as ApplicantType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select applicant type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="undergraduate">Undergraduate</SelectItem>
                      <SelectItem value="masters">Masters</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.applicant_type && (
                    <p className="text-sm text-destructive">{errors.applicant_type.message}</p>
                  )}
                </div>

                {applicantType && (
                  <>
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {applicantType === "undergraduate" && "Please upload all required documents for undergraduate applicants."}
                        {applicantType === "masters" && "Please upload all required documents for masters applicants, including bachelor's degree documents."}
                        {applicantType === "phd" && "Please upload all required documents for PhD applicants, including bachelor's degree documents and thesis."}
                      </AlertDescription>
                    </Alert>

                    <div className="grid gap-6 md:grid-cols-2">
                      <FileUploadField
                        name="passport"
                        label="Passport"
                        required
                        accept="image/*"
                        description="Image file"
                      />
                      <FileUploadField
                        name="national_identity_card"
                        label="National Identity Card"
                        accept="image/*"
                        description="Image file (optional)"
                      />
                      <FileUploadField
                        name="highschool_certificates"
                        label="High School Certificates"
                        required
                        description="PDF file"
                      />
                      <FileUploadField
                        name="transcripts"
                        label="Transcripts"
                        required
                        description="PDF file"
                      />
                      <FileUploadField
                        name="recommendation_letter_1"
                        label="Recommendation Letter 1"
                        description="PDF file (optional)"
                      />
                      <FileUploadField
                        name="recommendation_letter_2"
                        label="Recommendation Letter 2"
                        description="PDF file (optional)"
                      />
                      <FileUploadField
                        name="student_cv_resume"
                        label="Student CV/Resume"
                        description="PDF file (optional)"
                      />
                      <FileUploadField
                        name="statement_of_purpose"
                        label="Statement of Purpose"
                        description="PDF file (optional)"
                      />
                      <FileUploadField
                        name="birth_certificate"
                        label="Birth Certificate"
                        accept="image/*"
                        description="Image file (optional)"
                      />
                      <FileUploadField
                        name="english_proficiency"
                        label="English Proficiency (IELTS/DUOLINGO/MOI)"
                        description="PDF file (optional but recommended)"
                      />

                      {(applicantType === "masters" || applicantType === "phd") && (
                        <>
                          <FileUploadField
                            name="recommendation_letter_3"
                            label="Recommendation Letter 3"
                            description="PDF file (optional)"
                          />
                          <FileUploadField
                            name="bachelors_degree_certificate"
                            label="Bachelor's Degree Certificate"
                            required
                            description="PDF file"
                          />
                          <FileUploadField
                            name="bachelors_degree_transcript"
                            label="Bachelor's Degree Transcript"
                            required
                            description="PDF file"
                          />
                          <FileUploadField
                            name="diploma"
                            label="Diploma"
                            description="PDF file (optional)"
                          />
                        </>
                      )}

                      {applicantType === "phd" && (
                        <FileUploadField
                          name="thesis"
                          label="Thesis"
                          required
                          description="PDF file"
                        />
                      )}
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate(-1)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Tasks;

