import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { useAppDispatch } from '../hooks';
import { loginSuccess } from '../store/slices/authSlice';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Mock admin login - in real app, this would be an API call
    if (formData.email === 'admin@renthub.com' && formData.password === 'admin123') {
      dispatch(loginSuccess({
        id: 'admin',
        name: 'Admin User',
        email: 'admin@renthub.com',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
        role: 'renter' // Using renter role but email check determines admin access
      }));
      
      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard.",
      });
      
      navigate('/admin/dashboard');
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid admin credentials.",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-md p-6">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
            <p className="text-muted-foreground">
              Access the RentHub admin dashboard
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="admin@renthub.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter admin password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  'Sign In as Admin'
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Demo credentials: admin@renthub.com / admin123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};