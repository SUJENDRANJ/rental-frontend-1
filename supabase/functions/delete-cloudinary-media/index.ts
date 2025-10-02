import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const CLOUDINARY_CLOUD_NAME = Deno.env.get('CLOUDINARY_CLOUD_NAME');
const CLOUDINARY_API_KEY = Deno.env.get('CLOUDINARY_API_KEY');
const CLOUDINARY_API_SECRET = Deno.env.get('CLOUDINARY_API_SECRET');

interface DeleteRequest {
  publicIds: string[];
  resourceType?: 'image' | 'video' | 'raw';
}

interface DeleteResponse {
  success: boolean;
  deleted: string[];
  errors: Array<{ publicId: string; error: string }>;
}

async function deleteFromCloudinary(
  publicId: string,
  resourceType: string = 'image'
): Promise<{ success: boolean; error?: string }> {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;

    const encoder = new TextEncoder();
    const data = encoder.encode(stringToSign);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const formData = new URLSearchParams();
    formData.append('public_id', publicId);
    formData.append('timestamp', timestamp.toString());
    formData.append('api_key', CLOUDINARY_API_KEY!);
    formData.append('signature', signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/destroy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      }
    );

    const result = await response.json();

    if (result.result === 'ok' || result.result === 'not found') {
      return { success: true };
    }

    return { success: false, error: result.error?.message || 'Unknown error' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary credentials not configured');
    }

    const { publicIds, resourceType = 'image' }: DeleteRequest = await req.json();

    if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
      throw new Error('publicIds array is required');
    }

    const deleted: string[] = [];
    const errors: Array<{ publicId: string; error: string }> = [];

    for (const publicId of publicIds) {
      const result = await deleteFromCloudinary(publicId, resourceType);

      if (result.success) {
        deleted.push(publicId);
      } else {
        errors.push({ publicId, error: result.error || 'Unknown error' });
      }
    }

    const response: DeleteResponse = {
      success: errors.length === 0,
      deleted,
      errors,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
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
});
