import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface VerifyOTPRequest {
  phoneNumber: string;
  otp: string;
  userId: string;
}

interface MSG91VerifyResponse {
  type: string;
  message: string;
}

async function verifyOTPViaMSG91(phoneNumber: string, otp: string): Promise<boolean> {
  const msg91AuthKey = Deno.env.get('MSG91_AUTH_KEY');

  if (!msg91AuthKey) {
    throw new Error('MSG91 credentials not configured');
  }

  const phoneWithoutPlus = phoneNumber.replace('+', '');

  try {
    const response = await fetch('https://control.msg91.com/api/v5/otp/verify', {
      method: 'POST',
      headers: {
        'authkey': msg91AuthKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mobile: phoneWithoutPlus,
        otp: otp
      })
    });

    const data: MSG91VerifyResponse = await response.json();

    return response.ok && data.type === 'success';
  } catch (error) {
    console.error('MSG91 Verify Error:', error);
    throw error;
  }
}

async function verifyOTPViaTwilio(phoneNumber: string, otp: string): Promise<boolean> {
  const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const twilioServiceSid = Deno.env.get('TWILIO_VERIFY_SERVICE_SID');

  if (!twilioAccountSid || !twilioAuthToken || !twilioServiceSid) {
    throw new Error('Twilio credentials not configured');
  }

  try {
    const response = await fetch(
      `https://verify.twilio.com/v2/Services/${twilioServiceSid}/VerificationCheck`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${twilioAccountSid}:${twilioAuthToken}`),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          To: phoneNumber,
          Code: otp
        })
      }
    );

    const data = await response.json();

    return response.ok && data.status === 'approved';
  } catch (error) {
    console.error('Twilio Verify Error:', error);
    throw error;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { phoneNumber, otp, userId }: VerifyOTPRequest = await req.json();

    if (!phoneNumber || !otp || !userId) {
      return new Response(
        JSON.stringify({
          success: false,
          verified: false,
          message: 'Phone number, OTP, and user ID are required'
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (!/^\+91[6-9]\d{9}$/.test(phoneNumber)) {
      return new Response(
        JSON.stringify({
          success: false,
          verified: false,
          message: 'Invalid Indian phone number format'
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return new Response(
        JSON.stringify({
          success: false,
          verified: false,
          message: 'OTP must be 6 digits'
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    let verified = false;
    let usedProvider = 'none';

    try {
      verified = await verifyOTPViaMSG91(phoneNumber, otp);
      usedProvider = 'msg91';
    } catch (msg91Error) {
      console.error('MSG91 verification failed, trying Twilio:', msg91Error);

      try {
        verified = await verifyOTPViaTwilio(phoneNumber, otp);
        usedProvider = 'twilio';
      } catch (twilioError) {
        console.error('Twilio verification also failed:', twilioError);
        return new Response(
          JSON.stringify({
            success: false,
            verified: false,
            message: 'Failed to verify OTP. Both SMS providers are unavailable.'
          }),
          {
            status: 500,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        verified,
        message: verified ? 'Phone number verified successfully' : 'Invalid or expired OTP',
        provider: usedProvider
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Verify OTP error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        verified: false,
        message: error instanceof Error ? error.message : 'An error occurred while verifying OTP'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
