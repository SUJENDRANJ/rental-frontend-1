import React, { useState } from 'react';
import { Search, User, ShoppingCart, Menu, X, Calendar, Heart, Settings, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '../ui/theme-toggle';
import { RoleSwitcher } from '../ui/role-switcher';
import { Badge } from '../ui/badge';
import { AuthModal } from '../auth/AuthModal';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { setSearchTerm } from '../../store/slices/productsSlice';
import { useDebounce } from '../../hooks/useDebounce';
import { logout } from '../../store/slices/authSlice';
import { useSupabase } from '../../hooks/useSupabase';

interface NavbarProps {
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

export const Navbar = ({ searchTerm: propSearchTerm, onSearchChange }: NavbarProps) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { signOut } = useSupabase();
  
  const { searchTerm: storeSearchTerm } = useAppSelector((state) => state.products);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { rentals } = useAppSelector((state) => state.rental);
  const [localSearchTerm, setLocalSearchTerm] = useState(propSearchTerm ?? storeSearchTerm);
  const debouncedSearchTerm = useDebounce(localSearchTerm, 300);
  
  const searchTerm = propSearchTerm ?? storeSearchTerm;
  
  // Update search when debounced value changes
  React.useEffect(() => {
    if (onSearchChange) {
      onSearchChange(debouncedSearchTerm);
    } else {
      dispatch(setSearchTerm(debouncedSearchTerm));
      if (debouncedSearchTerm.trim()) {
        navigate('/products');
      }
    }
  }, [debouncedSearchTerm, onSearchChange, dispatch, navigate]);

  const handleSearchChange = (term: string) => {
    setLocalSearchTerm(term);
  };

  const handleSearchClick = () => {
    navigate('/products');
  };

  const handleLogout = async () => {
    await signOut();
    dispatch(logout());
    navigate('/');
  };

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const MobileMenu = () => (
    <SheetContent side="left" className="w-80">
      <div className="space-y-6 mt-8">
        <div className="space-y-2">
          <h3 className="font-medium">Categories</h3>
          <nav className="space-y-1">
            {['Electronics', 'Wearables', 'Photography', 'Gaming', 'Lifestyle'].map((category) => (
              <Link key={category} to="/products" className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-accent">
                {category}
              </Link>
            ))}
          </nav>
        </div>
        <div className="space-y-2">
          <h3 className="font-medium">Account</h3>
          {isAuthenticated ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 px-3 py-2">
                <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full" />
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              <RoleSwitcher />
            </div>
          ) : (
            <Button variant="outline" className="w-full justify-start" onClick={() => openAuthModal('login')}>
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </SheetContent>
  );

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <MobileMenu />
            </Sheet>
          </div>

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              RentHub
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">Home</Link>
            <Link to="/products" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Browse</Link>
            {user?.role === 'host' ? (
              <Link to="/host/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Dashboard</Link>
            ) : (
              <Link to="/favorites" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Favorites</Link>
            )}
            <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Categories</a>
            <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">How it Works</a>
            <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Support</a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 ml-auto">
            <RoleSwitcher />
            
            <Button variant="ghost" size="sm" onClick={handleSearchClick}>
              <Search className="h-4 w-4" />
            </Button>
            
            {isAuthenticated && (
              <Link to="/notifications">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                    3
                  </Badge>
                </Button>
              </Link>
            )}
            
            {isAuthenticated && user?.role === 'renter' && (
              <Link to="/favorites">
                <Button variant="ghost" size="sm" className="relative">
                  <Heart className="h-4 w-4" />
                  {/* You can add a badge here for favorite count */}
                </Button>
              </Link>
            )}
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full" />
                    <span className="hidden sm:inline text-sm font-medium">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-rentals" className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      My Rentals
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => openAuthModal('login')}>
                  Sign In
                </Button>
                <Button size="sm" onClick={() => openAuthModal('signup')}>
                  Sign Up
                </Button>
              </div>
            )}

            {isAuthenticated && (
              <Link to="/my-rentals">
                <Button variant="ghost" size="sm" className="relative">
                  <Calendar className="h-4 w-4" />
                  {rentals.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {rentals.length}
                    </span>
                  )}
                </Button>
              </Link>
            )}
            
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
    
    <AuthModal
      isOpen={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
      defaultMode={authMode}
    />
    </>
  );
};