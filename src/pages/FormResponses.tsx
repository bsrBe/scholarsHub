import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Loader2, FileText, CheckCircle, XCircle, Clock, Download, ClipboardList, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formService, UserForm } from '@/services/formService';
import { taskApplicationService, TaskApplication } from '@/services/taskApplicationService';
import { useState } from 'react';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
    case 'rejected':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
    case 'in_review':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Review</Badge>;
    default:
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'rejected':
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Clock className="h-5 w-5 text-yellow-500" />;
  }
};

const TaskApplicationCard = ({ application }: { application: TaskApplication }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [additionalPdfs, setAdditionalPdfs] = useState<FileList | null>(null);
  const [additionalImages, setAdditionalImages] = useState<FileList | null>(null);

  const { data: fullApplication } = useQuery({
    queryKey: ['task-application', application._id],
    queryFn: () => taskApplicationService.getTaskApplication(application._id),
    initialData: application,
  });

  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) => taskApplicationService.uploadAdditionalDocuments(application._id, formData),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Additional documents uploaded successfully!",
      });
      setIsModalOpen(false);
      setAdditionalPdfs(null);
      setAdditionalImages(null);
      queryClient.invalidateQueries({ queryKey: ['task-application', application._id] });
      queryClient.invalidateQueries({ queryKey: ['user-task-applications'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to upload documents",
        variant: "destructive",
      });
    },
  });

  const handleUpload = () => {
    if ((!additionalPdfs || additionalPdfs.length === 0) && (!additionalImages || additionalImages.length === 0)) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();

    if (additionalPdfs) {
      for (let i = 0; i < Math.min(additionalPdfs.length, 4); i++) {
        formData.append('additional_documents_pdf', additionalPdfs[i]);
      }
    }

    if (additionalImages) {
      for (let i = 0; i < Math.min(additionalImages.length, 4); i++) {
        formData.append('additional_documents_images', additionalImages[i]);
      }
    }

    uploadMutation.mutate(formData);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg capitalize">
              {application.applicant_type} Application
            </CardTitle>
            <div className="flex items-center mt-1 space-x-2 text-sm text-muted-foreground">
              <span>Applied on {format(new Date(application.createdAt), 'MMM d, yyyy')}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(application.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {application.status !== 'pending' && application.admin_response && (
            <div className="p-4 bg-muted/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">
                  {getStatusIcon(application.status)}
                </div>
                <div>
                  <h4 className="font-medium mb-1">
                    {application.status === 'approved'
                      ? 'Application Approved'
                      : application.status === 'rejected'
                        ? 'Application Update'
                        : 'Application Update'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {application.admin_response}
                  </p>
                  {application.reviewed_at && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Updated on {format(new Date(application.reviewed_at), 'MMM d, yyyy')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Upload Additional Documents
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Additional Documents</DialogTitle>
                <DialogDescription>
                  Upload up to 4 PDFs and 4 images as additional supporting documents.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Additional PDFs (Max 4)</Label>
                  <Input
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={(e) => setAdditionalPdfs(e.target.files)}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-muted-foreground">Select up to 4 PDF files.</p>
                </div>

                <div className="space-y-2">
                  <Label>Additional Images (Max 4)</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setAdditionalImages(e.target.files)}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-muted-foreground">Select up to 4 image files.</p>
                </div>

                <Button
                  onClick={handleUpload}
                  disabled={uploadMutation.isPending}
                  className="w-full"
                >
                  {uploadMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Upload Documents'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

        </div>
      </CardContent>
    </Card>
  );
};

const FormResponses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [headerUploadOpen, setHeaderUploadOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string>("");
  const [headerPdfs, setHeaderPdfs] = useState<FileList | null>(null);
  const [headerImages, setHeaderImages] = useState<FileList | null>(null);

  const {
    data: forms,
    isLoading: formsLoading,
    error: formsError,
  } = useQuery<UserForm[]>({
    queryKey: ['user-forms'],
    queryFn: () => formService.getMyForms(),
    enabled: !!user,
  });

  const {
    data: taskApplications,
    isLoading: tasksLoading,
    error: tasksError,
  } = useQuery<TaskApplication[]>({
    queryKey: ['user-task-applications'],
    queryFn: () => taskApplicationService.getMyTaskApplications(),
    enabled: !!user,
  });

  const isLoading = formsLoading || tasksLoading;
  const error = formsError || tasksError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load applications. Please try again later.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const hasForms = forms && forms.length > 0;
  const hasTaskApplications = taskApplications && taskApplications.length > 0;
  const hasAnyApplications = hasForms || hasTaskApplications;

  return (
    <div className="container mx-auto p-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Applications</h1>
            <p className="text-muted-foreground mt-2">
              Track the status of your study abroad applications and task submissions
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/tasks">
              <Button>
                <ClipboardList className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </Link>
            {hasTaskApplications && (
              <Button onClick={() => setHeaderUploadOpen(true)} variant="default">
                <Upload className="mr-2 h-4 w-4" />
                Upload Documents
              </Button>
            )}
          </div>
        </div>

        {!hasAnyApplications ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No applications found</h3>
              <p className="text-muted-foreground mb-4">
                You haven't submitted any applications yet.
              </p>
              <div className="flex gap-2 justify-center">
                <Link to="/tasks">
                  <Button>Submit Task Application</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="forms" className="w-full">
            <TabsList>
              <TabsTrigger value="forms">
                Task Applications
              </TabsTrigger>
              <TabsTrigger value="tasks">
                submitted Applications ({taskApplications?.length || 0})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="forms" className="space-y-4 mt-4">
              {!hasForms ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No study applications</h3>
                    <Link to="/tasks">
                      <Button>Start New Application</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                forms.map((form) => (
                  <Card key={form._id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {form.destination_country || 'Destination pending'}
                          </CardTitle>
                          <div className="flex items-center mt-1 space-x-2 text-sm text-muted-foreground">
                            <span>{form.educational_status || 'Education status not provided'}</span>
                            <span>•</span>
                            <span>Applied on {format(new Date(form.createdAt), 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(form.status)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid gap-3 sm:grid-cols-2 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium text-foreground">Contact email</span>
                          <div>{form.email}</div>
                        </div>
                        <div>
                          <span className="font-medium text-foreground">Phone number</span>
                          <div>{form.phone_number || '—'}</div>
                        </div>
                        <div>
                          <span className="font-medium text-foreground">Telegram</span>
                          <div>{form.telegram_user_name || '—'}</div>
                        </div>
                        <div>
                          <span className="font-medium text-foreground">Submitted</span>
                          <div>{format(new Date(form.createdAt), 'MMM d, yyyy h:mm a')}</div>
                        </div>
                      </div>

                      {form.additional_information && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-foreground mb-1">Additional information</p>
                          <p className="text-sm text-muted-foreground">{form.additional_information}</p>
                        </div>
                      )}

                      {form.client_document && (
                        <div className="mt-4">
                          <Button asChild variant="outline" size="sm">
                            <a href={form.client_document} target="_blank" rel="noopener noreferrer">
                              <Download className="mr-2 h-4 w-4" />
                              View uploaded document
                            </a>
                          </Button>
                        </div>
                      )}

                      {form.status !== 'pending' && form.admin_response && (
                        <div className="mt-4 p-4 bg-muted/20 rounded-lg">
                          <div className="flex items-start space-x-3">
                            <div className="mt-0.5">
                              {getStatusIcon(form.status)}
                            </div>
                            <div>
                              <h4 className="font-medium mb-1">
                                {form.status === 'approved'
                                  ? 'Application Approved'
                                  : form.status === 'rejected'
                                    ? 'Application Update'
                                    : 'Application Update'}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {form.admin_response}
                              </p>
                              {form.reviewed_at && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  Updated on {format(new Date(form.reviewed_at), 'MMM d, yyyy')}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
            <TabsContent value="tasks" className="space-y-4 mt-4">
              {!hasTaskApplications ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No task applications</h3>
                    <Link to="/tasks">
                      <Button>Submit Task Application</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                taskApplications.map((application) => (
                  <TaskApplicationCard key={application._id} application={application} />
                ))
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* Header Upload Modal */}
        <Dialog open={headerUploadOpen} onOpenChange={setHeaderUploadOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Additional Documents</DialogTitle>
              <DialogDescription>
                Select an application and upload up to 4 PDFs and 4 images.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Select Application</Label>
                <select
                  value={selectedAppId}
                  onChange={(e) => setSelectedAppId(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Choose an application...</option>
                  {taskApplications?.map((app) => (
                    <option key={app._id} value={app._id}>
                      {app.applicant_type.charAt(0).toUpperCase() + app.applicant_type.slice(1)} Application - {format(new Date(app.createdAt), 'MMM d, yyyy')}
                    </option>
                  ))}
                </select>
              </div>

              {selectedAppId && (
                <>
                  <div className="space-y-2">
                    <Label>Additional PDFs (Max 4)</Label>
                    <Input
                      type="file"
                      accept=".pdf"
                      multiple
                      onChange={(e) => setHeaderPdfs(e.target.files)}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-muted-foreground">Select up to 4 PDF files.</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Additional Images (Max 4)</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setHeaderImages(e.target.files)}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-muted-foreground">Select up to 4 image files.</p>
                  </div>

                  <Button
                    onClick={async () => {
                      if ((!headerPdfs || headerPdfs.length === 0) && (!headerImages || headerImages.length === 0)) {
                        toast({
                          title: "No files selected",
                          description: "Please select at least one file to upload",
                          variant: "destructive",
                        });
                        return;
                      }

                      const formData = new FormData();

                      if (headerPdfs) {
                        for (let i = 0; i < Math.min(headerPdfs.length, 4); i++) {
                          formData.append('additional_documents_pdf', headerPdfs[i]);
                        }
                      }

                      if (headerImages) {
                        for (let i = 0; i < Math.min(headerImages.length, 4); i++) {
                          formData.append('additional_documents_images', headerImages[i]);
                        }
                      }

                      try {
                        await taskApplicationService.uploadAdditionalDocuments(selectedAppId, formData);
                        toast({
                          title: "Success",
                          description: "Additional documents uploaded successfully!",
                        });
                        setHeaderUploadOpen(false);
                        setSelectedAppId("");
                        setHeaderPdfs(null);
                        setHeaderImages(null);
                        queryClient.invalidateQueries({ queryKey: ['user-task-applications'] });
                      } catch (error: any) {
                        toast({
                          title: "Error",
                          description: error.response?.data?.error || "Failed to upload documents",
                          variant: "destructive",
                        });
                      }
                    }}
                    className="w-full"
                  >
                    Upload Documents
                  </Button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default FormResponses;
