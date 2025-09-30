import { useState } from 'react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Camera, Upload, Save, Shield, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Clock, FileText, Video } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useToast } from '../hooks/use-toast';
import { useAppSelector, useAppDispatch } from '../hooks';
import { loginSuccess } from '../store/slices/authSlice';

export const HostProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street',
    city: 'New York',
    country: 'USA',
    bio: 'Experienced host with a passion for sharing quality items with the community.',
    avatar: user?.avatar || '',
    businessName: 'Premium Rentals Co.',
    businessType: 'Individual',
    taxId: '***-**-1234'
  });

  // Check if profile is complete
  const isProfileComplete = useMemo(() => {
    const requiredFields = [
      formData.name,
      formData.email,
      formData.phone,
      formData.address,
      formData.bio,
      formData.businessName
    ];
    return requiredFields.every(field => field.trim().length > 0);
  }, [formData]);

  const [kycStatus] = useState({
    phoneVerified: true,
    identityVerified: true,
    addressVerified: false,
    bankVerified: true,
    overallStatus: 'approved' as 'pending' | 'approved' | 'rejected'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (user) {
      dispatch(loginSuccess({
        ...user,
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar
      }));
      
      toast({
        title: "Profile Updated",
        description: "Your host profile has been updated successfully.",
      });
    }
  };

  const getKycStatusIcon = (verified: boolean) => {
    return verified ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <Clock className="h-4 w-4 text-yellow-500" />
    );
  };

  const getKycStatusText = (verified: boolean) => {
    return verified ? 'Verified' : 'Pending';
  };

  const calculateProfileCompletion = () => {
    const fields = [
      formData.name,
      formData.email,
      formData.phone,
      formData.address,
      formData.bio,
      formData.businessName
    ];
    const completed = fields.filter(field => field.trim().length > 0).length;
    return Math.round((completed / fields.length) * 100);
  };

  if (!isAuthenticated || user?.role !== 'host') {
    return (
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Host Access Required</h1>
          <p className="text-muted-foreground">
            Please sign in as a host to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/host/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Host Profile</h1>
            <p className="text-muted-foreground">
              Manage your host account and verification status
            </p>
          </div>
          <Badge variant={kycStatus.overallStatus === 'approved' ? 'default' : 'secondary'}>
            <Shield className="h-3 w-3 mr-1" />
            {kycStatus.overallStatus === 'approved' ? 'Verified Host' : 'Pending Verification'}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="business">Business Info</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Profile Completion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Profile Completion
                <span className="text-sm font-normal">{calculateProfileCompletion()}%</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={calculateProfileCompletion()} className="w-full" />
              <p className="text-sm text-muted-foreground mt-2">
                Complete your profile to increase trust with renters
              </p>
              {calculateProfileCompletion() < 100 && (
                <Button
                  size="sm"
                  onClick={() => navigate('/host/complete-profile')}
                >
                  Continue Your Profile
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Profile Picture */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Profile Picture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={formData.avatar} />
                  <AvatarFallback>{formData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Photo
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG or GIF. Max size 2MB. Professional photos increase bookings by 40%.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Host Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell renters about yourself and your hosting experience"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  A good bio helps renters trust you. Mention your experience, interests, and what makes you a great host.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Street address"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="City"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-6">
          {/* KYC Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Verification Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {kycStatus.overallStatus === 'approved' ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Your account is fully verified! You can now host items on our platform.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Complete your verification to start hosting items and build trust with renters.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Verification Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Verification
                  </div>
                  {getKycStatusIcon(kycStatus.phoneVerified)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Verify your phone number to enable secure communication
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant={kycStatus.phoneVerified ? 'default' : 'secondary'}>
                    {getKycStatusText(kycStatus.phoneVerified)}
                  </Badge>
                  {!kycStatus.phoneVerified && (
                    <Button size="sm" variant="outline">
                      Verify Phone
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Identity Verification
                  </div>
                  {getKycStatusIcon(kycStatus.identityVerified)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Government ID and live video verification completed
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant={kycStatus.identityVerified ? 'default' : 'secondary'}>
                    {getKycStatusText(kycStatus.identityVerified)}
                  </Badge>
                  {!kycStatus.identityVerified && (
                    <Button size="sm" variant="outline">
                      Upload ID & Video
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address Verification
                  </div>
                  {getKycStatusIcon(kycStatus.addressVerified)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Verify your address with a utility bill or bank statement
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant={kycStatus.addressVerified ? 'default' : 'secondary'}>
                    {getKycStatusText(kycStatus.addressVerified)}
                  </Badge>
                  {!kycStatus.addressVerified && (
                    <Button size="sm" variant="outline">
                      Upload Document
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Bank Verification
                  </div>
                  {getKycStatusIcon(kycStatus.bankVerified)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Link your bank account for secure payments
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant={kycStatus.bankVerified ? 'default' : 'secondary'}>
                    {getKycStatusText(kycStatus.bankVerified)}
                  </Badge>
                  {!kycStatus.bankVerified && (
                    <Button size="sm" variant="outline">
                      Link Bank Account
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    placeholder="Enter business name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Input
                    id="businessType"
                    value={formData.businessType}
                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                    placeholder="Individual, LLC, Corporation, etc."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID (Optional)</Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) => handleInputChange('taxId', e.target.value)}
                  placeholder="Tax identification number"
                />
                <p className="text-xs text-muted-foreground">
                  Required for tax reporting if you earn over $600 per year
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive booking updates and messages</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">SMS Notifications</h4>
                    <p className="text-sm text-muted-foreground">Get urgent notifications via text</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Privacy Settings</h4>
                    <p className="text-sm text-muted-foreground">Control what information is visible</p>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};