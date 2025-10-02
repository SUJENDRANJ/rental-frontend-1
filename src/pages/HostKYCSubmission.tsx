import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { VideoRecorder } from '../components/ui/video-recorder';
import { DocumentUpload } from '../components/ui/document-upload';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import {
  CheckCircle,
  AlertCircle,
  Video,
  FileText,
  Phone,
  Shield,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
  getKYCSubmission,
  createKYCSubmission,
  uploadKYCVideo,
  uploadKYCDocument,
  resetKYCForResubmission,
  type KYCSubmission
} from '../services/kycService';
import { useToast } from '../hooks/use-toast';

type KYCStep = 'phone' | 'video' | 'document' | 'review';

export default function HostKYCSubmission() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState<KYCStep>('phone');
  const [loading, setLoading] = useState(false);
  const [existingKYC, setExistingKYC] = useState<KYCSubmission | null>(null);
  const [isResubmission, setIsResubmission] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [documentType, setDocumentType] = useState<'aadhar' | 'pan' | 'passport' | 'license'>('aadhar');
  const [documentUploaded, setDocumentUploaded] = useState(false);

  const [uploadedVideoUrl, setUploadedVideoUrl] = useState('');
  const [uploadedVideoPublicId, setUploadedVideoPublicId] = useState('');
  const [uploadedDocUrl, setUploadedDocUrl] = useState('');
  const [uploadedDocPublicId, setUploadedDocPublicId] = useState('');

  useEffect(() => {
    checkExistingKYC();
  }, []);

  const checkExistingKYC = async () => {
    try {
      const kyc = await getKYCSubmission();
      if (kyc) {
        setExistingKYC(kyc);
        if (kyc.status === 'rejected') {
          setIsResubmission(true);
        }
      }
    } catch (error) {
      console.error('Error checking KYC:', error);
    }
  };

  const handleResubmit = async () => {
    try {
      setLoading(true);
      await resetKYCForResubmission();
      setExistingKYC(null);
      setIsResubmission(false);
      toast({
        title: 'Ready for Resubmission',
        description: 'You can now submit your KYC documents again.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to reset KYC',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid 10-digit phone number',
        variant: 'destructive',
      });
      return;
    }
    setCurrentStep('video');
  };

  const handleVideoRecorded = async (blob: Blob) => {
    try {
      setLoading(true);
      setVideoBlob(blob);

      const result = await uploadKYCVideo(blob, 'temp-user');
      setUploadedVideoUrl(result.url);
      setUploadedVideoPublicId(result.publicId);
      setVideoUploaded(true);

      toast({
        title: 'Video Uploaded',
        description: 'Your verification video has been uploaded successfully.',
      });

      setCurrentStep('document');
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Failed to upload video',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (file: File) => {
    try {
      const result = await uploadKYCDocument(file, 'temp-user', documentType);
      setUploadedDocUrl(result.url);
      setUploadedDocPublicId(result.publicId);
      setDocumentUploaded(true);

      toast({
        title: 'Document Uploaded',
        description: 'Your ID document has been uploaded successfully.',
      });

      setCurrentStep('review');
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Failed to upload document',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleSubmitKYC = async () => {
    try {
      setLoading(true);

      await createKYCSubmission({
        phoneNumber,
        videoUrl: uploadedVideoUrl,
        videoPublicId: uploadedVideoPublicId,
        documentType,
        documentUrl: uploadedDocUrl,
        documentPublicId: uploadedDocPublicId,
      });

      toast({
        title: 'KYC Submitted Successfully',
        description: 'Your verification is under review. You will be notified once approved.',
      });

      setTimeout(() => {
        navigate('/host/profile');
      }, 2000);
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: error instanceof Error ? error.message : 'Failed to submit KYC',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (existingKYC && !isResubmission) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-3xl mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>KYC Status</CardTitle>
              <CardDescription>Your verification status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Current Status</p>
                  <p className="text-sm text-muted-foreground">
                    Submitted on {existingKYC.submitted_at ? new Date(existingKYC.submitted_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <Badge
                  variant={
                    existingKYC.status === 'approved' ? 'default' :
                    existingKYC.status === 'rejected' ? 'destructive' :
                    existingKYC.status === 'under_review' ? 'secondary' :
                    'outline'
                  }
                >
                  {existingKYC.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>

              {existingKYC.status === 'pending' && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Your KYC verification is pending review. We will notify you once it's processed.
                  </AlertDescription>
                </Alert>
              )}

              {existingKYC.status === 'under_review' && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Your KYC is currently under review by our team. This usually takes 24-48 hours.
                  </AlertDescription>
                </Alert>
              )}

              {existingKYC.status === 'approved' && (
                <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-600">
                    Your KYC has been approved! You can now list products as a host.
                  </AlertDescription>
                </Alert>
              )}

              {existingKYC.status === 'rejected' && (
                <div className="space-y-4">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Your KYC was rejected. Reason: {existingKYC.rejection_reason || 'Not specified'}
                    </AlertDescription>
                  </Alert>
                  <Button onClick={handleResubmit} disabled={loading}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Resubmit KYC
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Host Verification</h1>
          <p className="text-muted-foreground">
            Complete your KYC to start listing products on RentHub
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-8">
          {[
            { step: 'phone', label: 'Phone', icon: Phone },
            { step: 'video', label: 'Video', icon: Video },
            { step: 'document', label: 'ID', icon: FileText },
            { step: 'review', label: 'Review', icon: Shield },
          ].map(({ step, label, icon: Icon }, index) => {
            const stepOrder = ['phone', 'video', 'document', 'review'];
            const isActive = currentStep === step;
            const isCompleted = stepOrder.indexOf(currentStep) > stepOrder.indexOf(step);

            return (
              <div
                key={step}
                className={`flex items-center gap-2 p-3 rounded-lg border ${
                  isActive ? 'border-primary bg-primary/5' :
                  isCompleted ? 'border-green-500 bg-green-50 dark:bg-green-950' :
                  'border-border'
                }`}
              >
                <Icon className={`w-4 h-4 ${
                  isActive ? 'text-primary' :
                  isCompleted ? 'text-green-600' :
                  'text-muted-foreground'
                }`} />
                <span className={`text-sm font-medium ${
                  isActive ? 'text-primary' :
                  isCompleted ? 'text-green-600' :
                  'text-muted-foreground'
                }`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {currentStep === 'phone' && (
          <Card>
            <CardHeader>
              <CardTitle>Phone Verification</CardTitle>
              <CardDescription>Enter your phone number for verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  maxLength={10}
                />
                <p className="text-xs text-muted-foreground">
                  We'll use this number to verify your identity
                </p>
              </div>
              <Button onClick={handlePhoneSubmit} className="w-full">
                Continue to Video Recording
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === 'video' && (
          <Card>
            <CardHeader>
              <CardTitle>Record Verification Video</CardTitle>
              <CardDescription>
                Record a 10-second video of yourself for identity verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <Video className="h-4 w-4" />
                <AlertDescription>
                  Look directly at the camera and clearly say your full name. Make sure you're in a well-lit area.
                </AlertDescription>
              </Alert>
              <VideoRecorder
                onVideoRecorded={handleVideoRecorded}
                maxDuration={10}
              />
            </CardContent>
          </Card>
        )}

        {currentStep === 'document' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select ID Type</CardTitle>
                <CardDescription>Choose the government ID you want to upload</CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={documentType}
                  onValueChange={(value: any) => setDocumentType(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aadhar">Aadhaar Card</SelectItem>
                    <SelectItem value="pan">PAN Card</SelectItem>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="license">Driving License</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <DocumentUpload
              documentType={documentType}
              onUpload={handleDocumentUpload}
              description="Upload a clear photo of your government-issued ID"
            />
          </div>
        )}

        {currentStep === 'review' && (
          <Card>
            <CardHeader>
              <CardTitle>Review & Submit</CardTitle>
              <CardDescription>Please review your information before submitting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Phone Number</p>
                      <p className="text-sm text-muted-foreground">{phoneNumber}</p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Video className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Verification Video</p>
                      <p className="text-sm text-muted-foreground">10-second video recorded</p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Government ID</p>
                      <p className="text-sm text-muted-foreground">
                        {documentType.replace('_', ' ').toUpperCase()} uploaded
                      </p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>

              <Separator />

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  By submitting, you confirm that all information provided is accurate and you consent to identity verification.
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleSubmitKYC}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Submit for Verification
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
