# MSG91 Phone Verification Setup Guide

This guide explains how to set up MSG91 for Indian phone number verification with OTP functionality in your application.

## Features

- OTP generation and validation for Indian phone numbers (+91)
- 5-minute OTP expiry
- Rate limiting: 3 OTP requests per phone per hour
- Automatic fallback to Twilio if MSG91 fails
- Phone verification UI workflow with resend functionality
- Secure OTP tracking in Supabase database

## Prerequisites

1. A MSG91 account ([Sign up here](https://msg91.com/))
2. A Supabase project with authentication enabled

## MSG91 Configuration

### Step 1: Create MSG91 Account

1. Visit [MSG91 website](https://msg91.com/)
2. Sign up for a new account
3. Complete the verification process
4. Navigate to your dashboard

### Step 2: Get API Credentials

1. Go to **API** section in MSG91 dashboard
2. Copy your **Auth Key**
3. Create an OTP template:
   - Go to **OTP** → **Templates**
   - Click **Create Template**
   - Set template name (e.g., "Phone Verification")
   - Add message content: "Your verification OTP is ##OTP##. Valid for 5 minutes."
   - Submit for approval
   - Copy the **Template ID** once approved

### Step 3: Configure Environment Variables

Add the following to your Supabase Edge Function secrets:

```bash
# MSG91 Configuration (Primary)
MSG91_AUTH_KEY=your_msg91_auth_key_here
MSG91_TEMPLATE_ID=your_msg91_template_id_here

# Twilio Configuration (Fallback - Optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_VERIFY_SERVICE_SID=your_twilio_verify_service_sid
```

## Database Setup

### Step 1: Apply Migration

Run the migration to create required tables:

```sql
-- This creates:
-- 1. otp_attempts table - tracks all OTP generation/validation attempts
-- 2. phone_verification_status table - stores verified phone numbers
-- 3. Adds phone_number, phone_verified fields to profiles table
```

The migration file is ready at:
`supabase/migrations/add_phone_verification_and_otp_tracking.sql`

### Step 2: Deploy Edge Functions

Deploy the OTP edge functions:

1. **send-otp**: Generates and sends OTP via MSG91
2. **verify-otp**: Validates OTP and updates verification status

Functions are located at:
- `supabase/functions/send-otp/index.ts`
- `supabase/functions/verify-otp/index.ts`

## Usage

### In Your Application

The phone verification is integrated into the Profile page. Users can:

1. Click "Verify" button next to phone number field
2. Enter their 10-digit Indian mobile number
3. Receive OTP via SMS
4. Enter the 6-digit OTP
5. Get verified status with badge

### Programmatic Usage

```typescript
import { OTPService } from './services/otpService';

// Check rate limit status
const rateLimit = await OTPService.checkRateLimit('+919876543210');

// Send OTP
const result = await OTPService.sendOTP('+919876543210');

// Verify OTP
const verification = await OTPService.verifyOTP('+919876543210', '123456');

// Check verification status
const status = await OTPService.getVerificationStatus(userId);
```

## Rate Limiting

The system implements the following rate limits:

- **3 OTP requests per hour** per phone number
- **60-second cooldown** between OTP requests
- Rate limit counter resets after 1 hour
- Clear error messages when limits are exceeded

## Security Features

1. **Phone Number Validation**: Only Indian phone numbers (+91) accepted
2. **OTP Expiry**: OTPs expire after 5 minutes
3. **Attempt Tracking**: All attempts logged with IP and user agent
4. **RLS Policies**: Users can only access their own verification records
5. **Encrypted Storage**: OTP codes stored securely in database
6. **Fallback Provider**: Automatic failover to Twilio if MSG91 is down

## Testing

### Test Phone Numbers (MSG91 Sandbox)

MSG91 provides test numbers for development:

- Test Number: Use your registered number
- OTP will be sent to registered mobile during testing

### Local Testing

1. Ensure database is connected
2. Set up environment variables
3. Deploy edge functions
4. Test the flow in Profile page

## Troubleshooting

### OTP Not Received

- Verify MSG91 Auth Key is correct
- Check if template is approved
- Ensure phone number format is correct (+919876543210)
- Check MSG91 dashboard for delivery status

### Rate Limit Issues

- Check `phone_verification_status` table for rate limit counters
- Rate limits reset after 1 hour automatically
- Clear old records if needed

### Edge Function Errors

- Check function logs in Supabase dashboard
- Verify environment variables are set
- Ensure CORS headers are properly configured

## API Reference

### OTPService Methods

#### `sendOTP(phoneNumber: string): Promise<OTPResponse>`
Sends OTP to the specified phone number.

#### `verifyOTP(phoneNumber: string, otp: string): Promise<OTPVerificationResult>`
Verifies the OTP code.

#### `checkRateLimit(phoneNumber: string): Promise<RateLimitStatus>`
Checks if user can request another OTP.

#### `getVerificationStatus(userId: string): Promise<VerificationStatus>`
Gets the current verification status for a user.

## Support

For MSG91 specific issues:
- MSG91 Documentation: https://docs.msg91.com/
- MSG91 Support: support@msg91.com

For application issues:
- Check Supabase logs
- Review edge function logs
- Check browser console for errors
