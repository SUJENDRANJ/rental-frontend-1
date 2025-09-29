import { useState } from 'react';
import { Search, User, Menu, Bell, Settings, Shield, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '../ui/theme-toggle';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { logout } from '../../store/slices/authSlice';

export const AdminNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  const MobileMenu = () => (
    <SheetContent side="left" className="w-80">
      <div className="space-y-6 mt-8">
        <div className="space-y-2">
          <h3 className="font-medium">Admin Menu</h3>
          <nav className="space-y-1">
            <Link to="/admin/dashboard" className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-accent">
              Dashboard
            </Link>
            <Link to="/admin/dashboard" className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-accent">
              Users
            </Link>
            <Link to="/admin/dashboard" className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-accent">
              Products
            </Link>
            <Link to="/admin/dashboard" className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-accent">
              Analytics
            </Link>
          </nav>
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
            <Link to="/admin/dashboard" className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              <Shield className="h-6 w-6 inline mr-2 text-red-600" />
              RentHub Admin
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/admin/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
              Dashboard
            </Link>
            <Link to="/admin/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Users
            </Link>
            <Link to="/admin/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Products
            </Link>
            <Link to="/admin/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Analytics
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search admin panel..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/products')}>
              <Search className="h-4 w-4" />
            </Button>
            
            <Link to="/notifications">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                  3
                </Badge>
              </Button>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full" />
                  <span className="hidden sm:inline text-sm font-medium">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};