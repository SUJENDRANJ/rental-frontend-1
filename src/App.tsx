import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/providers/ThemeProvider';
import { Navbar } from './components/layout/Navbar';
import { HostNavbar } from './components/layout/HostNavbar';
import { AdminNavbar } from './components/layout/AdminNavbar';
import { Footer } from './components/layout/Footer';
import { Chatbot } from './components/ui/chatbot';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Favorites } from './pages/Favorites';
import { Notifications } from './pages/Notifications';
import { Profile } from './pages/Profile';
import { HostProfile } from './pages/HostProfile';
import { HostDashboard } from './pages/HostDashboard';
import { HostKYC } from './pages/HostKYC';
import { CreateProduct } from './pages/CreateProduct';
import { CompleteProfile } from './pages/CompleteProfile';
import { HostAnalytics } from './pages/HostAnalytics';
import { MyRentals } from './pages/MyRentals';
import { Payment } from './pages/Payment';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { Toaster } from '@/components/ui/toaster';
import { useAppSelector } from './hooks';

function App() {
  const { user } = useAppSelector((state) => state.auth);
  const isHost = user?.role === 'host';
  const isAdmin = user?.email === 'admin@renthub.com';

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-background">
          {isAdmin ? <AdminNavbar /> : isHost ? <HostNavbar /> : <Navbar />}
          
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/my-rentals" element={<MyRentals />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/host/profile" element={<HostProfile />} />
              <Route path="/host/complete-profile" element={<CompleteProfile />} />
              <Route path="/host/dashboard" element={<HostDashboard />} />
              <Route path="/host/analytics" element={<HostAnalytics />} />
              <Route path="/host/kyc" element={<HostKYC />} />
              <Route path="/host/create-product" element={<CreateProduct />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </main>

          <Footer />
          <Chatbot />
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;