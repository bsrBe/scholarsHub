import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { ChatProvider } from "./contexts/ChatContext";
import ScrollToTop from "./components/ScrollToTop";
//sta
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Destinations = lazy(() => import("./pages/Destinations"));
const DestinationDetail = lazy(() => import("./pages/DestinationDetail"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const BookConsultation = lazy(() => import("./pages/BookConsultation"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Contact = lazy(() => import("./pages/Contact"));
const ContactPartners = lazy(() => import("./pages/ContactPartners"));

const FAQ = lazy(() => import("./pages/FAQ"));
const NotFound = lazy(() => import("./pages/NotFound"));
const FormResponses = lazy(() => import("./pages/FormResponses"));
const MeetingPage = lazy(() => import("./pages/MeetingPage"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));

const PartnershipRequestsPage = lazy(() => import("./pages/admin/PartnershipRequestsPage"));
const AuthLayout = lazy(() => import("./layouts/AuthLayout"));
const Login = lazy(() => import("./pages/auth/Login").then(module => ({ default: module.Login })));
const Register = lazy(() => import("./pages/auth/Register").then(module => ({ default: module.Register })));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const EmailConfirmation = lazy(() => import("./pages/auth/EmailConfirmation"));
const Profile = lazy(() => import("./pages/Profile"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const UsersPage = lazy(() => import("./pages/admin/UsersPage"));
const MeetingsPage = lazy(() => import("./pages/admin/MeetingsPage"));

const TaskApplicationsPage = lazy(() => import("./pages/admin/TaskApplicationsPage"));
const FAQsPage = lazy(() => import("./pages/admin/FAQsPage"));
const ArticlesPage = lazy(() => import("./pages/admin/ArticlesPage"));
const ChatManagement = lazy(() => import("./pages/admin/ChatManagement"));
const TestimonialPage = lazy(() => import("./pages/admin/TestimonialPage"));

const queryClient = new QueryClient();

const PageFallback = () => (
  <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
    Loading...
  </div>
);

const AppRoutes = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      <div className="flex-1">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/:country" element={<DestinationDetail />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/book-consultation" element={<BookConsultation />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/contact/partners" element={<ContactPartners />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/meetings" element={<MeetingPage />} />
            {/* Auth Routes */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password" element={<ResetPassword />} />
              <Route path="confirm-email" element={<EmailConfirmation />} />
            </Route>

            {/* Redirect old routes to new auth routes */}
            <Route path="/login" element={<Navigate to="/auth/login" replace />} />
            <Route path="/register" element={<Navigate to="/auth/register" replace />} />
            <Route path="/forgot-password" element={<Navigate to="/auth/forgot-password" replace />} />

            {/* Protected Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/change-password"
              element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-applications"
              element={
                <ProtectedRoute>
                  <FormResponses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="meetings" element={<MeetingsPage />} />
              <Route path="users" element={<UsersPage />} />

              <Route path="task-applications" element={<TaskApplicationsPage />} />
              <Route path="partnerships" element={<PartnershipRequestsPage />} />
              <Route path="chat" element={<ChatManagement />} />
              <Route path="faqs" element={<FAQsPage />} />
              <Route path="articles" element={<ArticlesPage />} />
              <Route path="testimonials" element={<TestimonialPage />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ChatProvider>
            <AppRoutes />
          </ChatProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
