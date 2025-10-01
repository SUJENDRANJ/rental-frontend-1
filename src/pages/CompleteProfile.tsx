import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, Phone, Shield, CircleCheck as CheckCircle, Upload, FileText, Video, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { useToast } from '../hooks/use-toast';
import { useAppSelector, useAppDispatch } from '../hooks';
import { loginSuccess } from '../store/slices/authSlice';

export const CompleteProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    phone: '',
    otp: '',
    phoneVerified: false,
    identityVerified: false,
    addressVerified: false,
    bankVerified: false,
    videoRecorded: false,
    idUploaded: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleDateOfBirthNext = () => {
    if (!formData.dateOfBirth) {
      toast({
        title: "Date Required",
        description: "Please enter your date of birth.",
        variant: "destructive",
      });
      return;
    }

    const age = calculateAge(formData.dateOfBirth);
    if (age < 18) {
      toast({
        title: "Age Requirement",
        description: "You must be 18 or older to become a host.",
        variant: "destructive",
      });
      return;
    }

    setCurrentStep(2);
  };

  const handleSendOTP = () => {
    if (!formData.phone) {
      toast({
        title: "Phone Required",
        description: "Please enter your phone number.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "OTP Sent",
      description: "Verification code sent to your phone number.",
    });
    setCurrentStep(3);
  };

  const handleVerifyOTP = () => {
    if (!formData.otp || formData.otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }
    
    setFormData(prev => ({ ...prev, phoneVerified: true }));
    toast({
      title: "Phone Verified",
      description: "Your phone number has been verified successfully.",
    });
    setCurrentStep(4);
  };

  const handleCompleteProfile = () => {
    if (user) {
      dispatch(loginSuccess({
        ...user,
        role: 'host'
      }));
    }

    toast({
      title: "Profile Completed",
      description: "Welcome to RentHub! You can now start hosting items.",
    });
    
    navigate('/host/dashboard');
  };

  const getStepProgress = () => {
    return (currentStep / 4) * 100;
  };

  if (!isAuthenticated) {
    return (
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Login Required</h1>
          <p className="text-muted-foreground">
            Please sign in to complete your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <h1 className="text-3xl font-bold mb-2">Complete Your Host Profile</h1>
        <p className="text-muted-foreground">
          Complete these steps to start hosting on RentHub
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm text-muted-foreground">{Math.round(getStepProgress())}%</span>
        </div>
        <Progress value={getStepProgress()} className="w-full" />
      </div>

      {/* Step 1: Date of Birth */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Date of Birth Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              You must be 18 or older to become a host on our platform.
            </p>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <Button onClick={handleDateOfBirthNext} className="w-full">
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Phone Number */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Phone Number
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We'll send you a verification code to confirm your phone number.
            </p>
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
            <Button onClick={handleSendOTP} className="w-full">
              Send Verification Code
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3: OTP Verification */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Enter Verification Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We've sent a 6-digit code to {formData.phone}
            </p>
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                value={formData.otp}
                onChange={(e) => handleInputChange('otp', e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleVerifyOTP} className="flex-1">
                Verify Code
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                Change Number
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Verification Options */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Profile Setup Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Your basic profile is now complete. You can start hosting immediately, or complete additional verification steps to increase trust with renters.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Phone Verification</h4>
                    <Badge variant="default">Completed</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your phone number has been verified
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Identity Verification</h4>
                    <Badge variant="secondary">Optional</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upload ID and record video for higher trust
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleCompleteProfile} className="flex-1">
                  Start Hosting Now
                </Button>
                <Button variant="outline" onClick={() => navigate('/host/kyc')} className="flex-1">
                  Complete Full Verification
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};