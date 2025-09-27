import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ThemeProvider } from './components/providers/ThemeProvider';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Favorites } from './pages/Favorites';
import { HostDashboard } from './pages/HostDashboard';
import { CreateProduct } from './pages/CreateProduct';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Navbar />
            
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/host/dashboard" element={<HostDashboard />} />
                <Route path="/host/create-product" element={<CreateProduct />} />
              </Routes>
            </main>

            <Footer />
            <Toaster />
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;