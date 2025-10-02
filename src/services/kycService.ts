import { supabase } from '../lib/supabase';
import { CloudinaryService } from './cloudinaryService';

export interface KYCSubmission {
  id?: string;
  user_id?: string;
  phone_number: string;
  phone_verified: boolean;
  video_url?: string;
  video_public_id?: string;
  government_id_type: 'aadhar' | 'pan' | 'license' | 'passport';
  government_id_url?: string;
  government_id_public_id?: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  rejection_reason?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  submitted_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface KYCWithProfile extends KYCSubmission {
  profile?: {
    id: string;
    email: string;
    full_name: string;
    avatar_url?: string;
  };
}

export const uploadKYCVideo = async (videoBlob: Blob, userId: string): Promise<{ url: string; publicId: string }> => {
  try {
    const result = await CloudinaryService.uploadKYCVideo(videoBlob, userId);
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Error uploading KYC video:', error);
    throw new Error('Failed to upload video. Please try again.');
  }
};

export const uploadKYCDocument = async (file: File, userId: string, documentType: 'aadhar' | 'pan' | 'license' | 'passport'): Promise<{ url: string; publicId: string }> => {
  try {
    const result = await CloudinaryService.uploadKYCDocument(file, userId, documentType);
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Error uploading KYC document:', error);
    throw new Error('Failed to upload document. Please try again.');
  }
};

export const createKYCSubmission = async (data: {
  phoneNumber: string;
  videoUrl: string;
  videoPublicId: string;
  documentType: string;
  documentUrl: string;
  documentPublicId: string;
}): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('kyc_verifications')
    .upsert({
      user_id: user.id,
      phone_number: data.phoneNumber,
      video_url: data.videoUrl,
      video_public_id: data.videoPublicId,
      government_id_type: data.documentType,
      government_id_url: data.documentUrl,
      government_id_public_id: data.documentPublicId,
      status: 'pending',
      submitted_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Error creating KYC submission:', error);
    throw new Error('Failed to submit KYC. Please try again.');
  }
};

export const getKYCSubmission = async (): Promise<KYCSubmission | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('kyc_verifications')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching KYC submission:', error);
    throw new Error('Failed to fetch KYC status');
  }

  return data;
};

export const getAllKYCSubmissions = async (status?: string): Promise<KYCWithProfile[]> => {
  let query = supabase
    .from('kyc_verifications')
    .select(`
      *,
      profile:profiles!kyc_verifications_user_id_fkey (
        id,
        email,
        full_name,
        avatar_url
      )
    `)
    .order('submitted_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching all KYC submissions:', error);
    throw new Error('Failed to fetch KYC submissions');
  }

  return data || [];
};

export const approveKYC = async (kycId: string, adminId: string): Promise<void> => {
  const { error } = await supabase.rpc('process_kyc_approval', {
    p_kyc_id: kycId,
    p_admin_id: adminId,
    p_approved: true,
  });

  if (error) {
    console.error('Error approving KYC:', error);
    throw new Error('Failed to approve KYC');
  }
};

export const rejectKYC = async (kycId: string, adminId: string, reason: string): Promise<void> => {
  const { error } = await supabase.rpc('process_kyc_approval', {
    p_kyc_id: kycId,
    p_admin_id: adminId,
    p_approved: false,
    p_rejection_reason: reason,
  });

  if (error) {
    console.error('Error rejecting KYC:', error);
    throw new Error('Failed to reject KYC');
  }
};

export const resetKYCForResubmission = async (): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase.rpc('reset_kyc_for_resubmission', {
    p_user_id: user.id,
  });

  if (error) {
    console.error('Error resetting KYC:', error);
    throw new Error('Failed to reset KYC for resubmission');
  }
};

export const deleteKYCMedia = async (publicId: string, resourceType: 'image' | 'video' = 'image'): Promise<void> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-cloudinary-media`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicId, resourceType }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete media');
    }
  } catch (error) {
    console.error('Error deleting KYC media:', error);
    throw new Error('Failed to delete media');
  }
};
