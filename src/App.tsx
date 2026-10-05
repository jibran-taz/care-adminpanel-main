import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AuthProvider } from "./context/auth";
import NotFound from "./pages/NotFound";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Settings from "./pages/Settings";
import Authlogin from "./pages/auth";
import Dashboard from "./pages/dashboard/Dashboard";
import Users from "./pages/users";
import ViewUser from "./pages/users/view-user";
import ProtectedRoute from "./routes/protected-route";
import CreateUser from "./pages/users/create-user";
import JobListing from "./pages/job-listing";
import ViewJobListing from "./pages/job-listing/view-listing";
import DashboardBooking from "./pages/bookings/dashboard";
import AllBookings from "./pages/bookings/all-bookings";
import BookingDetail from "./pages/bookings/booking-detail";
import ReviewDashboard from "./pages/reviews/dashboard";
import AllReviews from "./pages/reviews/all-review";
import ReviewDetail from "./pages/reviews/review-detail";
import DashboardMessages from "./pages/messages/dashboard";
import TransactionHistory from "./pages/transactions";
import AddPlanSubscription from "./pages/subscription/add-plan-subscripton";
import GetAllSubscription from "./pages/subscription/all-subscription";
import EditPlanSubscription from "./pages/subscription/edit-subscription";
import ViewPlanDetail from "./pages/subscription/view-detail";
import BookingsAnalytics from "./pages/dashboard/booking";
import RevenueAnalytics from "./pages/dashboard/revenue";
import ProviderAnalytics from "./pages/dashboard/provider";
import ReviewAnalytics from "./pages/dashboard/review";
import GetAllSettings from "./pages/Settings/get-all-settings";
import SlidersSettings from "./pages/Settings/sliders";
import CreateSlider from "./pages/Settings/sliders/create-slider";
import EditSlider from "./pages/Settings/sliders/edit-slider";
import ViewSlider from "./pages/Settings/sliders/view-slider";
import AnnouncementsList from "./pages/Settings/announsment";
import CreateAnnouncement from "./pages/Settings/announsment/create-announcements";
import EditAnnouncement from "./pages/Settings/announsment/edit-announcement";
import ViewAnnouncement from "./pages/Settings/announsment/view-announscement";
import PublicRoute from "./routes/public-route";
import SEOManager from "./pages/seo";
import GetAllPagesListing from "./pages/st-pages";
import CreateEditPage from "./pages/st-pages/create-page";
import AllJobs from "./pages/jobs";
import Payouts from "./pages/payouts";
import Notifications from "./pages/notifications";
import EnquiryListing from "./pages/enquiry";
import EnquiryDetails from "./pages/enquiry/enquiry-detail";
import Categories from "./pages/categories";
import Withdrawals from "./pages/withdrawals";
import W9Form from "./pages/w9-form";
import W9Deteail from "./pages/w9-form/detail";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster position="top-center" reverseOrder={true} />
        <BrowserRouter>
          <Routes>
            {/* Public Route - Login */}
            {/* <Route path="/" element={<Authlogin />} /> */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Authlogin />
                </PublicRoute>
              }
            />
            {/* Protected Routes - All dashboard routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route
                path="users"
                element={
                  <ProtectedRoute>
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route
                path="analytics/bookings"
                element={
                  <ProtectedRoute>
                    <BookingsAnalytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="analytics/provider"
                element={
                  <ProtectedRoute>
                    <ProviderAnalytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="analytics/review"
                element={
                  <ProtectedRoute>
                    <ReviewAnalytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="analytics/revenue"
                element={
                  <ProtectedRoute>
                    <RevenueAnalytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="create-user"
                element={
                  <ProtectedRoute>
                    <CreateUser />
                  </ProtectedRoute>
                }
              />
              <Route
                path="users/:id"
                element={
                  <ProtectedRoute>
                    <ViewUser />
                  </ProtectedRoute>
                }
              />
              <Route
                path="job-listing"
                element={
                  <ProtectedRoute>
                    <JobListing />
                  </ProtectedRoute>
                }
              />
              <Route
                path="job-listing/:id"
                element={
                  <ProtectedRoute>
                    <ViewJobListing />
                  </ProtectedRoute>
                }
              />
              {/* Bookings */}
              <Route
                path="bookings"
                element={
                  <ProtectedRoute>
                    <DashboardBooking />
                  </ProtectedRoute>
                }
              />
              <Route
                path="my-bookings"
                element={
                  <ProtectedRoute>
                    <AllBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="booking/:id"
                element={
                  <ProtectedRoute>
                    <BookingDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="reviews"
                element={
                  <ProtectedRoute>
                    <ReviewDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="reviews/:id"
                element={
                  <ProtectedRoute>
                    <ReviewDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="reviews-all"
                element={
                  <ProtectedRoute>
                    <AllReviews />
                  </ProtectedRoute>
                }
              />
              <Route
                path="messages"
                element={
                  <ProtectedRoute>
                    <DashboardMessages />
                  </ProtectedRoute>
                }
              />
              <Route
                path="transactions"
                element={
                  <ProtectedRoute>
                    <TransactionHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="subscription/add-plan-subscription"
                element={
                  <ProtectedRoute>
                    <AddPlanSubscription />
                  </ProtectedRoute>
                }
              />
              <Route
                path="subscription/all-subscription"
                element={
                  <ProtectedRoute>
                    <GetAllSubscription />
                  </ProtectedRoute>
                }
              />
              <Route
                path="subscription/view-plan/:planId"
                element={
                  <ProtectedRoute>
                    <ViewPlanDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="subscription/edit-subscription/:id"
                element={
                  <ProtectedRoute>
                    <EditPlanSubscription />
                  </ProtectedRoute>
                }
              />
              <Route
                path="subscription/edit-subscription/:id"
                element={
                  <ProtectedRoute>
                    <EditPlanSubscription />
                  </ProtectedRoute>
                }
              />
              <Route
                path="get-all-settings"
                element={
                  <ProtectedRoute>
                    <GetAllSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="sliders"
                element={
                  <ProtectedRoute>
                    <SlidersSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="create-slider"
                element={
                  <ProtectedRoute>
                    <CreateSlider />
                  </ProtectedRoute>
                }
              />
              <Route
                path="edit-slider/:id"
                element={
                  <ProtectedRoute>
                    <EditSlider />
                  </ProtectedRoute>
                }
              />
              <Route
                path="view-slider/:id"
                element={
                  <ProtectedRoute>
                    <ViewSlider />
                  </ProtectedRoute>
                }
              />
              <Route
                path="get-all-announcements"
                element={
                  <ProtectedRoute>
                    <AnnouncementsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/create-announcements"
                element={
                  <ProtectedRoute>
                    <CreateAnnouncement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/edit-announcements/:id"
                element={
                  <ProtectedRoute>
                    <EditAnnouncement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/view-announcements/:id"
                element={
                  <ProtectedRoute>
                    <ViewAnnouncement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/get-seo"
                element={
                  <ProtectedRoute>
                    <SEOManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="get-all-pages"
                element={
                  <ProtectedRoute>
                    <GetAllPagesListing />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/pages/create"
                element={
                  <ProtectedRoute>
                    <CreateEditPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/pages/edit/:id"
                element={
                  <ProtectedRoute>
                    <CreateEditPage />
                  </ProtectedRoute>
                }
              />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="settings" element={<Settings />} />
              <Route path="jobs" element={<AllJobs />} />
              <Route path="payouts" element={<Payouts />} />
              <Route path="withdrawals" element={<Withdrawals />} />
              <Route path="categories" element={<Categories />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="enquiries" element={<EnquiryListing />} />
              <Route path="enquiries/:id" element={<EnquiryDetails />} />
              <Route path="w9-form" element={<W9Form />} />
              <Route path="w9-form/:id" element={<W9Deteail />} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
