import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Phone, Video, FileText, CircleCheck as CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { useAppSelector, useAppDispatch } from '../hooks';
import { loginSuccess } from '../store/slices/authSlice';

export const HostKYC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: '',
    otp: '',
    idType: '',
    idNumber: '',
    videoRecorded: false,
    idUploaded: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    setStep(2);
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
    
    toast({
      title: "Phone Verified",
      description: "Your phone number has been verified successfully.",
    });
    setStep(3);
  };

  const handleVideoRecord = () => {
    // Mock video recording
    setFormData(prev => ({ ...prev, videoRecorded: true }));
    toast({
      title: "Video Recorded",
      description: "Live video has been recorded successfully.",
    });
  };

  const handleIdUpload = () => {
    // Mock ID upload
    setFormData(prev => ({ ...prev, idUploaded: true }));
    toast({
      title: "ID Uploaded",
      description: "Government ID has been uploaded successfully.",
    });
  };

  const handleSubmitKYC = () => {
    if (!formData.videoRecorded || !formData.idUploaded) {
      toast({
        title: "Incomplete KYC",
        description: "Please complete all verification steps.",
        variant: "destructive",
      });
      return;
    }

    // Update user role to host
    if (user) {
      dispatch(loginSuccess({
        ...user,
        role: 'host'
      }));
    }

    toast({
      title: "KYC Submitted",
      description: "Your KYC has been submitted for manual review. You'll be notified within 24-48 hours.",
    });
    
    navigate('/host/dashboard');
  };

  if (!isAuthenticated) {
    return (
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Login Required</h1>
          <p className="text-muted-foreground">
            Please sign in to complete KYC verification.
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
        
        <h1 className="text-3xl font-bold mb-2">Host KYC Verification</h1>
        <p className="text-muted-foreground">
          Complete your verification to become a trusted host
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              1
            </div>
            <span className="ml-2 text-sm font-medium">Phone Verification</span>
          </div>
          <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              2
            </div>
            <span className="ml-2 text-sm font-medium">OTP Verification</span>
          </div>
          <div className={`flex items-center ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              3
            </div>
            <span className="ml-2 text-sm font-medium">Identity Verification</span>
          </div>
        </div>
      </div>

      {/* Step 1: Phone Number */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Phone Number Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
              Send OTP
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: OTP Verification */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Enter Verification Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
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
                Verify OTP
              </Button>
              <Button variant="outline" onClick={() => setStep(1)}>
                Change Number
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Identity Verification */}
      {step === 3 && (
        <div className="space-y-6">
          {/* Live Video Recording */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Live Video Verification
                {formData.videoRecorded && <Badge variant="default" className="ml-2">Completed</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Record a short video of yourself for identity verification. Make sure you're in good lighting and clearly visible.
              </p>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Record Live Video</h3>
                <p className="text-muted-foreground mb-4">
                  Click to start recording a 10-second video
                </p>
                <Button onClick={handleVideoRecord} disabled={formData.videoRecorded}>
                  {formData.videoRecorded ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Video Recorded
                    </>
                  ) : (
                    'Start Recording'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Government ID Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Government ID Upload
                {formData.idUploaded && <Badge variant="default" className="ml-2">Completed</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Upload a clear photo of your government-issued ID (Driver's License, Passport, or National ID).
              </p>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Upload Government ID</h3>
                <p className="text-muted-foreground mb-4">
                  Supported formats: JPG, PNG, PDF. Max size: 5MB
                </p>
                <Button onClick={handleIdUpload} disabled={formData.idUploaded}>
                  {formData.idUploaded ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      ID Uploaded
                    </>
                  ) : (
                    'Upload ID'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Submit KYC */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmitKYC} 
              size="lg"
              disabled={!formData.videoRecorded || !formData.idUploaded}
            >
              Submit for Review
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};