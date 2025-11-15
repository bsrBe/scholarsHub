import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft, Download, CheckCircle, XCircle } from 'lucide-react';
import { formService, FormStatus } from '@/services/formService';

const responseSchema = z.object({
  status: z.enum(['pending', 'in_review', 'approved', 'rejected']),
  response: z.string().min(1, 'Response is required'),
});

type ResponseFormValues = z.infer<typeof responseSchema>;

const FormDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const formQuery = useQuery({
    queryKey: ['admin-form', id],
    queryFn: () => formService.getForm(id!),
    enabled: Boolean(id),
  });

  const responseForm = useForm<ResponseFormValues>({
    resolver: zodResolver(responseSchema),
    defaultValues: {
      status: 'pending',
      response: '',
    },
  });

  useEffect(() => {
    if (formQuery.data) {
      responseForm.reset({
        status: formQuery.data.status,
        response: formQuery.data.admin_response || '',
      });
    }
  }, [formQuery.data, responseForm]);

  const respondMutation = useMutation({
    mutationFn: (values: ResponseFormValues) =>
      formService.respondToForm(id!, {
        status: values.status as FormStatus,
        response: values.response,
      }),
    onSuccess: () => {
      toast({
        title: 'Response saved',
        description: 'The applicant has been notified.',
      });
      queryClient.invalidateQueries({ queryKey: ['admin-form', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-forms'] });
      queryClient.invalidateQueries({ queryKey: ['admin-overview'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-forms'] });
    },
    onError: () => {
      toast({
        title: 'Update failed',
        description: 'Unable to update the application. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleRespond = (values: ResponseFormValues) => {
    respondMutation.mutate(values);
  };

  const handleDownload = async () => {
    if (!id) return;
    try {
      const response = await formService.downloadDocument(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `application_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: 'Download failed',
        description: 'Unable to download the document. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (formQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!formQuery.data || !id) {
    return (
      <div className="container mx-auto p-4 py-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Form not found</h2>
          <p className="text-muted-foreground">The requested application could not be located.</p>
          <Button onClick={() => navigate('/admin/forms')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to forms
          </Button>
        </div>
      </div>
    );
  }

  const form = formQuery.data;

  const timelineStatusColor =
    form.status === 'approved'
      ? 'text-green-600'
      : form.status === 'rejected'
        ? 'text-red-600'
        : 'text-blue-600';

  return (
    <div className="container mx-auto p-4 py-8 space-y-6">
      <Button variant="ghost" onClick={() => navigate('/admin/forms')} className="mb-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to forms
      </Button>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Applicant information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Full name</p>
                  <p className="font-medium">{form.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{form.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{form.phone_number || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telegram</p>
                  <p className="font-medium">{form.telegram_user_name || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Educational status</p>
                  <p className="font-medium">{form.educational_status || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Destination country</p>
                  <p className="font-medium">{form.destination_country || '—'}</p>
                </div>
              </div>
              {form.additional_information && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Additional information</p>
                  <p>{form.additional_information}</p>
                </div>
              )}
              {form.client_document && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Uploaded document</p>
                  <Button variant="outline" onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download document
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Update status</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...responseForm}>
                <form onSubmit={responseForm.handleSubmit(handleRespond)} className="space-y-4">
                  <FormField
                    control={responseForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_review">In review</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={responseForm.control}
                    name="response"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Response for applicant</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter the message that will be sent to the applicant"
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={respondMutation.isPending}>
                    {respondMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending response...
                      </>
                    ) : (
                      'Save response'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="h-full w-0.5 bg-muted mt-2" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Application submitted</p>
                    <p className="text-sm text-muted-foreground">
                      {dayjs(form.createdAt).format('MMM D, YYYY')}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Submission received via ScholarsHub intake form.
                  </p>
                </div>
              </div>

              {form.status !== 'pending' && (
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center bg-blue-100`}>
                      {form.status === 'rejected' ? (
                        <XCircle className="h-4 w-4 text-red-600" />
                      ) : (
                        <CheckCircle className={`h-4 w-4 ${timelineStatusColor}`} />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">
                        {form.status === 'approved'
                          ? 'Application approved'
                          : form.status === 'rejected'
                            ? 'Application rejected'
                            : 'Status updated'}
                      </p>
                      {form.reviewed_at && (
                        <p className="text-sm text-muted-foreground">
                          {dayjs(form.reviewed_at).format('MMM D, YYYY')}
                        </p>
                      )}
                    </div>
                    {form.admin_response && (
                      <p className="text-sm text-muted-foreground italic">
                        {form.admin_response}
                      </p>
                    )}
                    {form.reviewed_by && (
                      <p className="text-xs text-muted-foreground">
                        Reviewed by {form.reviewed_by.name} ({form.reviewed_by.email})
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FormDetail;

