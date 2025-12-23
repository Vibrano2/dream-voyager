import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopBar from './components/layout/TopBar';
import Footer from './components/layout/Footer';
import ChatWidget from './components/common/ChatWidget';
import ScrollToTop from './components/common/ScrollToTop';
import { AuthProvider } from './features/auth/context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

// Pages
import Home from './pages/Home';
import Login from './features/auth/pages/Login';
import Signup from './features/auth/pages/Signup';
import Dashboard from './pages/Dashboard';
import Destinations from './pages/Destinations';
import Packages from './pages/Packages';
import Services from './pages/Services';
import About from './pages/About';
import Flights from './pages/Flights';
import Hotels from './pages/Hotels';
import Visa from './pages/Visa';
import StudyVisa from './pages/StudyVisa';
import Honeymoon from './pages/Honeymoon';
import Corporate from './pages/Corporate';
import MyBookings from './features/bookings/pages/MyBookings';
import Payment from './pages/Payment';
import PaymentCallback from './pages/PaymentCallback';
import BookingConfirmation from './features/bookings/pages/BookingConfirmation';
import Book from './features/bookings/pages/Book';
import AdminLayout from './features/admin/layouts/AdminLayout';
import AdminLogin from './features/admin/pages/AdminLogin';
import AdminDashboard from './features/admin/pages/Dashboard';
import AdminBookings from './features/admin/pages/Bookings';
import AdminPackages from './features/admin/pages/Packages';
import AdminUsers from './features/admin/pages/Users';
import AdminSettings from './features/admin/pages/Settings';
import Support from './pages/Support';
import Privacy from './pages/legal/Privacy';
import Terms from './pages/legal/Terms';
import Cookies from './pages/legal/Cookies';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen bg-brand-skyblue flex flex-col">
            <TopBar />
            <main className="flex-1 bg-white">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/payment/:bookingId" element={<Payment />} />
                <Route path="/payment/callback" element={<PaymentCallback />} />
                <Route path="/booking/confirm/:bookingId" element={<BookingConfirmation />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="bookings" element={<AdminBookings />} />
                  <Route path="packages" element={<AdminPackages />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                <Route path="/destinations" element={<Destinations />} />
                <Route path="/packages" element={<Packages />} />
                <Route path="/services" element={<Services />} />
                <Route path="/flights" element={<Flights />} />
                <Route path="/visa" element={<Visa />} />
                <Route path="/study-visa" element={<StudyVisa />} />
                <Route path="/hotels" element={<Hotels />} />
                <Route path="/honeymoon" element={<Honeymoon />} />
                <Route path="/corporate" element={<Corporate />} />
                <Route path="/corporate" element={<Corporate />} />
                <Route path="/about" element={<About />} />
                <Route path="/book" element={<Book />} />
                <Route path="/support" element={<Support />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/cookies" element={<Cookies />} />
              </Routes>
            </main>
            <Footer />
            <ChatWidget />
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
