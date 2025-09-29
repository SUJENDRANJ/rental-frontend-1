import React, { useState } from 'react';
import { Search, User, ShoppingCart, Menu, X, Calendar, Heart, Settings, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '../ui/theme-toggle';
import { RoleSwitcher } from '../ui/role-switcher';
import { Badge } from '../ui/badge';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { setSearchTerm } from '../../store/slices/productsSlice';
import { useDebounce } from '../../hooks/useDebounce';
import { loginSuccess, logout } from '../../store/slices/authSlice';

interface NavbarProps {
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

export const Navbar = ({ searchTerm: propSearchTerm, onSearchChange }: NavbarProps) => {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
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
  const handleLogin = () => {
    // Mock login - in real app, this would be an API call
    dispatch(loginSuccess({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
      role: 'renter'
    }));
    setIsAccountOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const AccountModal = () => (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Account Access</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <Input id="email" type="email" placeholder="Enter your email" />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <Input id="password" type="password" placeholder="Enter your password" />
        </div>
        <div className="flex gap-2">
          <Button className="flex-1" onClick={handleLogin}>Sign In</Button>
          <Button variant="outline" className="flex-1">Sign Up</Button>
        </div>
      </div>
    </DialogContent>
  );

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
            <Button variant="outline" className="w-full justify-start" onClick={() => setIsAccountOpen(true)}>
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </SheetContent>
  );

  return (
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
              <Dialog open={isAccountOpen} onOpenChange={setIsAccountOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    <User className="h-4 w-4 mr-2" />
                    Account
                  </Button>
                </DialogTrigger>
                <AccountModal />
              </Dialog>
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
  );
};