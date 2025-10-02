import { supabase } from '../lib/supabase';
import { validateIndianPhoneNumber } from '../utils/phoneValidation';

export interface OTPResponse {
  success: boolean;
  message: string;
  requestId?: string;
  error?: string;
}

export interface OTPVerificationResult {
  success: boolean;
  message: string;
  verified?: boolean;
}

export interface RateLimitStatus {
  canSend: boolean;
  remainingAttempts: number;
  resetTime?: Date;
  message?: string;
}

const OTP_EXPIRY_MINUTES = 5;
const MAX_OTP_REQUESTS_PER_HOUR = 3;

export class OTPService {
  private static readonly EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

  static async checkRateLimit(phoneNumber: string): Promise<RateLimitStatus> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return {
          canSend: false,
          remainingAttempts: 0,
          message: 'User not authenticated'
        };
      }

      const { data, error } = await supabase
        .from('phone_verification_status')
        .select('otp_request_count, rate_limit_reset_at, last_otp_sent_at')
        .eq('user_id', user.user.id)
        .eq('phone_number', phoneNumber)
        .maybeSingle();

      if (error) {
        console.error('Rate limit check error:', error);
        return {
          canSend: true,
          remainingAttempts: MAX_OTP_REQUESTS_PER_HOUR
        };
      }

      if (!data) {
        return {
          canSend: true,
          remainingAttempts: MAX_OTP_REQUESTS_PER_HOUR
        };
      }

      const resetTime = new Date(data.rate_limit_reset_at);
      const now = new Date();

      if (now > resetTime) {
        return {
          canSend: true,
          remainingAttempts: MAX_OTP_REQUESTS_PER_HOUR
        };
      }

      const remainingAttempts = MAX_OTP_REQUESTS_PER_HOUR - data.otp_request_count;

      if (remainingAttempts <= 0) {
        return {
          canSend: false,
          remainingAttempts: 0,
          resetTime,
          message: `Rate limit exceeded. Try again after ${resetTime.toLocaleTimeString()}`
        };
      }

      if (data.last_otp_sent_at) {
        const lastSent = new Date(data.last_otp_sent_at);
        const secondsSinceLastSend = (now.getTime() - lastSent.getTime()) / 1000;

        if (secondsSinceLastSend < 60) {
          return {
            canSend: false,
            remainingAttempts,
            message: `Please wait ${Math.ceil(60 - secondsSinceLastSend)} seconds before requesting another OTP`
          };
        }
      }

      return {
        canSend: true,
        remainingAttempts
      };
    } catch (error) {
      console.error('Rate limit check failed:', error);
      return {
        canSend: true,
        remainingAttempts: MAX_OTP_REQUESTS_PER_HOUR
      };
    }
  }

  static async sendOTP(phoneNumber: string): Promise<OTPResponse> {
    try {
      const validation = validateIndianPhoneNumber(phoneNumber);
      if (!validation.isValid) {
        return {
          success: false,
          message: validation.error || 'Invalid phone number',
          error: validation.error
        };
      }

      const formattedPhone = validation.formatted!;

      const rateLimitStatus = await this.checkRateLimit(formattedPhone);
      if (!rateLimitStatus.canSend) {
        return {
          success: false,
          message: rateLimitStatus.message || 'Rate limit exceeded',
          error: 'RATE_LIMIT_EXCEEDED'
        };
      }

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return {
          success: false,
          message: 'User not authenticated',
          error: 'NOT_AUTHENTICATED'
        };
      }

      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: {
          phoneNumber: formattedPhone,
          userId: user.user.id
        }
      });

      if (error) {
        console.error('OTP send error:', error);
        return {
          success: false,
          message: 'Failed to send OTP. Please try again.',
          error: error.message
        };
      }

      if (data.success) {
        await this.updateRateLimit(formattedPhone, user.user.id);
      }

      return {
        success: data.success,
        message: data.message || 'OTP sent successfully',
        requestId: data.requestId
      };
    } catch (error) {
      console.error('Send OTP error:', error);
      return {
        success: false,
        message: 'An error occurred while sending OTP',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static async verifyOTP(phoneNumber: string, otp: string): Promise<OTPVerificationResult> {
    try {
      const validation = validateIndianPhoneNumber(phoneNumber);
      if (!validation.isValid) {
        return {
          success: false,
          message: validation.error || 'Invalid phone number'
        };
      }

      const formattedPhone = validation.formatted!;

      if (!/^\d{6}$/.test(otp)) {
        return {
          success: false,
          message: 'OTP must be 6 digits'
        };
      }

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return {
          success: false,
          message: 'User not authenticated'
        };
      }

      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: {
          phoneNumber: formattedPhone,
          otp,
          userId: user.user.id
        }
      });

      if (error) {
        console.error('OTP verification error:', error);
        return {
          success: false,
          message: 'Failed to verify OTP. Please try again.'
        };
      }

      if (data.verified) {
        await this.updatePhoneVerificationStatus(formattedPhone, user.user.id);
      }

      return {
        success: data.success,
        message: data.message || (data.verified ? 'Phone verified successfully' : 'Invalid OTP'),
        verified: data.verified
      };
    } catch (error) {
      console.error('Verify OTP error:', error);
      return {
        success: false,
        message: 'An error occurred while verifying OTP'
      };
    }
  }

  private static async updateRateLimit(phoneNumber: string, userId: string): Promise<void> {
    try {
      const { data: existing } = await supabase
        .from('phone_verification_status')
        .select('id, otp_request_count, rate_limit_reset_at')
        .eq('user_id', userId)
        .eq('phone_number', phoneNumber)
        .maybeSingle();

      const now = new Date();

      if (existing) {
        const resetTime = new Date(existing.rate_limit_reset_at);
        const newCount = now > resetTime ? 1 : existing.otp_request_count + 1;
        const newResetTime = now > resetTime ? new Date(now.getTime() + 3600000) : resetTime;

        await supabase
          .from('phone_verification_status')
          .update({
            otp_request_count: newCount,
            last_otp_sent_at: now.toISOString(),
            rate_limit_reset_at: newResetTime.toISOString()
          })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('phone_verification_status')
          .insert({
            user_id: userId,
            phone_number: phoneNumber,
            otp_request_count: 1,
            last_otp_sent_at: now.toISOString(),
            rate_limit_reset_at: new Date(now.getTime() + 3600000).toISOString()
          });
      }
    } catch (error) {
      console.error('Failed to update rate limit:', error);
    }
  }

  private static async updatePhoneVerificationStatus(phoneNumber: string, userId: string): Promise<void> {
    try {
      const now = new Date();

      const { error: statusError } = await supabase
        .from('phone_verification_status')
        .update({
          is_verified: true,
          verified_at: now.toISOString(),
          verification_method: 'msg91'
        })
        .eq('user_id', userId)
        .eq('phone_number', phoneNumber);

      if (statusError) {
        console.error('Failed to update verification status:', statusError);
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          phone_number: phoneNumber,
          phone_verified: true,
          phone_verified_at: now.toISOString()
        })
        .eq('id', userId);

      if (profileError) {
        console.error('Failed to update profile:', profileError);
      }
    } catch (error) {
      console.error('Failed to update phone verification status:', error);
    }
  }

  static async getVerificationStatus(userId: string): Promise<{
    isVerified: boolean;
    phoneNumber?: string;
    verifiedAt?: Date;
  }> {
    try {
      const { data, error } = await supabase
        .from('phone_verification_status')
        .select('is_verified, phone_number, verified_at')
        .eq('user_id', userId)
        .eq('is_verified', true)
        .maybeSingle();

      if (error || !data) {
        return { isVerified: false };
      }

      return {
        isVerified: data.is_verified,
        phoneNumber: data.phone_number,
        verifiedAt: data.verified_at ? new Date(data.verified_at) : undefined
      };
    } catch (error) {
      console.error('Failed to get verification status:', error);
      return { isVerified: false };
    }
  }
}
