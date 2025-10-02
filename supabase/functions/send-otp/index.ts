import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SendOTPRequest {
  phoneNumber: string;
  userId: string;
}

interface MSG91Response {
  type: string;
  message: string;
  request_id?: string;
}

async function sendOTPViaMSG91(phoneNumber: string): Promise<{ success: boolean; requestId?: string; message: string; provider: string }> {
  const msg91AuthKey = Deno.env.get('MSG91_AUTH_KEY');
  const msg91TemplateId = Deno.env.get('MSG91_TEMPLATE_ID');

  if (!msg91AuthKey || !msg91TemplateId) {
    throw new Error('MSG91 credentials not configured');
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const phoneWithoutPlus = phoneNumber.replace('+', '');

  try {
    const response = await fetch('https://control.msg91.com/api/v5/otp', {
      method: 'POST',
      headers: {
        'authkey': msg91AuthKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        template_id: msg91TemplateId,
        mobile: phoneWithoutPlus,
        otp: otp,
        otp_expiry: 5
      })
    });

    const data: MSG91Response = await response.json();

    if (response.ok && data.type === 'success') {
      return {
        success: true,
        requestId: data.request_id,
        message: 'OTP sent successfully via MSG91',
        provider: 'msg91'
      };
    } else {
      throw new Error(data.message || 'Failed to send OTP via MSG91');
    }
  } catch (error) {
    console.error('MSG91 Error:', error);
    throw error;
  }
}

async function sendOTPViaTwilio(phoneNumber: string): Promise<{ success: boolean; requestId?: string; message: string; provider: string }> {
  const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const twilioServiceSid = Deno.env.get('TWILIO_VERIFY_SERVICE_SID');

  if (!twilioAccountSid || !twilioAuthToken || !twilioServiceSid) {
    throw new Error('Twilio credentials not configured');
  }

  try {
    const response = await fetch(
      `https://verify.twilio.com/v2/Services/${twilioServiceSid}/Verifications`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${twilioAccountSid}:${twilioAuthToken}`),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          To: phoneNumber,
          Channel: 'sms'
        })
      }
    );

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        requestId: data.sid,
        message: 'OTP sent successfully via Twilio',
        provider: 'twilio'
      };
    } else {
      throw new Error(data.message || 'Failed to send OTP via Twilio');
    }
  } catch (error) {
    console.error('Twilio Error:', error);
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
    const { phoneNumber, userId }: SendOTPRequest = await req.json();

    if (!phoneNumber || !userId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Phone number and user ID are required'
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

    let result;
    let usedProvider = 'none';

    try {
      result = await sendOTPViaMSG91(phoneNumber);
      usedProvider = 'msg91';
    } catch (msg91Error) {
      console.error('MSG91 failed, falling back to Twilio:', msg91Error);

      try {
        result = await sendOTPViaTwilio(phoneNumber);
        usedProvider = 'twilio';
      } catch (twilioError) {
        console.error('Twilio also failed:', twilioError);
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Failed to send OTP. Both SMS providers are unavailable.'
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
        message: `OTP sent successfully via ${usedProvider}`,
        requestId: result.requestId,
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
    console.error('Send OTP error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred while sending OTP'
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
