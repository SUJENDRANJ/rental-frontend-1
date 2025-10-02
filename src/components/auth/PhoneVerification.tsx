import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader as Loader2, Phone, ShieldCheck, CircleAlert as AlertCircle } from 'lucide-react';
import { OTPService } from '../../services/otpService';
import { validateIndianPhoneNumber, formatPhoneForDisplay } from '../../utils/phoneValidation';

interface PhoneVerificationProps {
  onVerificationComplete?: (phoneNumber: string) => void;
  onCancel?: () => void;
}

export function PhoneVerification({ onVerificationComplete, onCancel }: PhoneVerificationProps) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [remainingAttempts, setRemainingAttempts] = useState(3);

  useEffect(() => {
    if (step === 'otp' && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [step, resendTimer]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validation = validateIndianPhoneNumber(phoneNumber);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid phone number');
      return;
    }

    setLoading(true);

    try {
      const rateLimitStatus = await OTPService.checkRateLimit(validation.formatted!);

      if (!rateLimitStatus.canSend) {
        setError(rateLimitStatus.message || 'Too many attempts. Please try again later.');
        setLoading(false);
        return;
      }

      setRemainingAttempts(rateLimitStatus.remainingAttempts - 1);

      const result = await OTPService.sendOTP(validation.formatted!);

      if (result.success) {
        setSuccess('OTP sent successfully. Please check your phone.');
        setStep('otp');
        setResendTimer(60);
        setCanResend(false);
      } else {
        setError(result.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!/^\d{6}$/.test(otp)) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const validation = validateIndianPhoneNumber(phoneNumber);
      if (!validation.isValid) {
        setError('Invalid phone number');
        setLoading(false);
        return;
      }

      const result = await OTPService.verifyOTP(validation.formatted!, otp);

      if (result.success && result.verified) {
        setSuccess('Phone number verified successfully!');
        setTimeout(() => {
          onVerificationComplete?.(validation.formatted!);
        }, 1500);
      } else {
        setError(result.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during verification.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const validation = validateIndianPhoneNumber(phoneNumber);
      if (!validation.isValid) {
        setError('Invalid phone number');
        setLoading(false);
        return;
      }

      const result = await OTPService.sendOTP(validation.formatted!);

      if (result.success) {
        setSuccess('OTP resent successfully');
        setResendTimer(60);
        setCanResend(false);
        setOtp('');
      } else {
        setError(result.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePhone = () => {
    setStep('phone');
    setOtp('');
    setError(null);
    setSuccess(null);
    setCanResend(false);
    setResendTimer(60);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          {step === 'phone' ? (
            <Phone className="h-5 w-5 text-blue-600" />
          ) : (
            <ShieldCheck className="h-5 w-5 text-green-600" />
          )}
          <CardTitle>
            {step === 'phone' ? 'Verify Phone Number' : 'Enter OTP'}
          </CardTitle>
        </div>
        <CardDescription>
          {step === 'phone'
            ? 'Enter your Indian mobile number to receive an OTP'
            : `Enter the 6-digit OTP sent to ${formatPhoneForDisplay(phoneNumber)}`}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 text-green-900 border-green-200">
            <ShieldCheck className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {remainingAttempts < 3 && step === 'phone' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You have {remainingAttempts} OTP request{remainingAttempts !== 1 ? 's' : ''} remaining this hour
            </AlertDescription>
          </Alert>
        )}

        {step === 'phone' ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <div className="flex items-center px-3 border rounded-md bg-gray-50">
                  <span className="text-sm font-medium">+91</span>
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="9876543210"
                  value={phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 10) {
                      setPhoneNumber(value);
                    }
                  }}
                  maxLength={10}
                  required
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-500">
                Enter your 10-digit mobile number
              </p>
            </div>

            <div className="flex gap-2">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={loading || phoneNumber.length !== 10}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send OTP'
                )}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleOTPSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">One-Time Password</Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 6) {
                    setOtp(value);
                  }
                }}
                maxLength={6}
                required
                disabled={loading}
                className="text-center text-2xl tracking-widest"
              />
              <p className="text-xs text-gray-500">
                OTP expires in 5 minutes
              </p>
            </div>

            <div className="space-y-2">
              <Button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </Button>

              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResendOTP}
                  disabled={loading || !canResend}
                  className="w-full"
                >
                  {canResend ? (
                    'Resend OTP'
                  ) : (
                    `Resend OTP in ${resendTimer}s`
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleChangePhone}
                  disabled={loading}
                  className="w-full"
                >
                  Change Phone Number
                </Button>
              </div>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
