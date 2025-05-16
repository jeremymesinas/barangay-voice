
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kfrjzutpdbffwhejqshm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtmcmp6dXRwZGJmZndoZWpxc2htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxOTcyOTEsImV4cCI6MjA2MDc3MzI5MX0.mEI6muSCuplnHMpyetNzunovhnf0T9FesKkC3Apdgt8';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtmcmp6dXRwZGJmZndoZWpxc2htIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTE5NzI5MSwiZXhwIjoyMDYwNzczMjkxfQ.mdQPhCkTe00_f4WpdoG-KpgOuhat5-AbHryry8c-AXo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

//for user registration
export async function registerUser({ email, password, firstName, middleName, lastName, phoneNumber }) {
  // 1. Sign up with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return { error: authError.message };
  }

  const auth_id = authData.user?.id;
  if (!auth_id) {
    return { error: 'Failed to retrieve auth ID after sign up' };
  }

  // 2. Generate 4-digit OTP
  const otp_code = Math.floor(1000 + Math.random() * 9000).toString();
  const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 mins

  // 3. Insert user profile and OTP
  const { error: profileError } = await supabaseAdmin.from('users').insert({
    auth_id,
    first_name: firstName,
    middle_name: middleName,
    last_name: lastName,
    phone_number: phoneNumber,
  });

  if (profileError) {
    return { error: profileError.message };
  }

  const { error: otpError } = await supabaseAdmin.from('registration_otps').insert({
    auth_id,
    otp_code,
    expires_at,
  });

  if (otpError) {
    return { error: otpError.message };
  }

  return { success: true, otp_code };
}


export async function loginUser({ email, password }) {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    return { error: authError.message };
  }

  // Fetch user profile data
  const { data: profileData, error: profileError } = await supabase
    .from('users')
    .select('first_name, last_name')
    .eq('auth_id', authData.user.id)
    .single();

  if (profileError) {
    return { error: profileError.message };
  }

  return {
    success: true,
    user: {
      ...authData.user,
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      role: profileData.role
    }
  };
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { error: error.message };
  }
  return { success: true };
}

export async function submitConcern({
  concern_header,
  concern_category,
  concern_content,
  address,
  importance_level,
  user_id,
  imageUri
}) {
  try {
    // Validate required fields
    if (!concern_header || !concern_category || !concern_content || !user_id) {
      throw new Error('Missing required fields');
    }

    // Process image upload if provided
    let imageUri = null;
    if (imageUri) {
      try {
        const fileExt = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `concern_${Date.now()}.${fileExt}`;
        const filePath = `user_${user_id}/${fileName}`;

        const response = await fetch(imageUri);
        const blob = await response.blob();

        const { data, error } = await supabase
          .storage
          .from('concern-images')
          .upload(filePath, blob, {
            contentType: blob.type,
            upsert: false
          });

        if (error) {
          console.error('Storage upload error:', error);
          throw new Error(`Image upload failed: ${error.message}`);
        }

        const { data: { publicUrl } } = supabase
          .storage
          .from('concern-images')
          .getPublicUrl(filePath);

        imageUri = publicUrl;
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        // Continue without image if upload fails
      }
    }

    // Insert concern data
    const { data, error } = await supabase
      .from('concerns')
      .insert([{
        concern_header,
        concern_category,
        concern_content,
        address: address || null,
        importance_level,
        user_id,
        imageUri: imageUri,
        status: 'pending'
      }])
      .select();

    if (error) throw error;

    return { data: data[0], error: null };

  } catch (error) {
    console.error('Submission error:', error);
    return {
      data: null,
      error: {
        message: error.message,
        code: error.code || 'SUBMISSION_ERROR'
      }
    };
  }
}

// Helper function for image upload
async function handleImageUpload(imageUri, userId) {
  if (!imageUri) return null;

  try {
    // Verify storage bucket exists
    const { error: bucketError } = await supabase
      .storage
      .listBuckets();

    if (bucketError) throw bucketError;

    // Prepare file metadata
    const fileExt = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `concern_${Date.now()}.${fileExt}`;
    const filePath = `user_${userId}/${fileName}`;

    // Convert image to blob
    const response = await fetch(imageUri);
    if (!response.ok) throw new Error('Failed to fetch image');

    const blob = await response.blob();

    // Upload with proper content type
    const { error: uploadError } = await supabase
      .storage
      .from('concern-images')
      .upload(filePath, blob, {
        contentType: blob.type,
        upsert: false,
        cacheControl: '3600'
      });

    if (uploadError) throw uploadError;

    // Get public URL with cache busting
    const { data: { publicUrl } } = supabase
      .storage
      .from('concern-images')
      .getPublicUrl(filePath, {
        download: false
      });

    return publicUrl;
  } catch (error) {
    console.error('Image upload failed:', error);
    // Re-throw with more context
    throw new Error(`Image upload failed: ${error.message}`);
  }
}

export const fetchUserConcerns = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('concerns')
      .select('id, concern_header, concern_content, created_at, status')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching concerns:', error);
    return [];
  }
};

export const fetchAnnouncements = async () => {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('announcement_header, announcement_content, created_at')
      .order('created_at', { ascending: false }); // Newest first

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }
};

export const createEmergencyCall = async (userId, location, address) => {
  const { data, error } = await supabase
    .from('emergency_calls')
    .insert([{
      caller_id: userId,
      caller_location: location,
      caller_address: address,
      status: 'active'
    }])
    .select()
    .single();

  return { data, error };
};

export const sendCallMessage = async (callId, senderId, message) => {
  const { data, error } = await supabase
    .from('emergency_messages')
    .insert([{
      call_id: callId,
      sender_id: senderId,
      message_text: message
    }])
    .select();

  return { data, error };
};

// Both: Get call messages
export const getCallMessages = async (callId) => {
  const { data, error } = await supabase
    .from('emergency_messages')
    .select(`
      *,
      sender:sender_id (name)
    `)
    .eq('call_id', callId)
    .order('created_at', { ascending: true });

  return { data, error };
};

// Cancel emergency call
export const cancelEmergencyCall = async (callId) => {
  try {
    const { error } = await supabase
      .from('emergency_calls')
      .delete()
      .eq('id', callId);

    return { error };
  } catch (error) {
    return { error: error.message };
  }
};

// Get active call for current user
export const getActiveUserCall = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('emergency_calls')
      .select('*')
      .eq('caller_id', userId)
      .eq('status', 'active')
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const sendEmergencyMessage = async (userId, message, location) => {
  try {
    const { data, error } = await supabase
      .from('emergency_messages')
      .insert([{
        user_id: userId,
        message: message,
        latitude: location.latitude,
        longitude: location.longitude,
        location_address: location.address,
        status: 'pending'
      }])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error sending emergency:', error);
    throw error;
  }
};

// 2. Get User's Emergency History
export const getEmergencyHistory = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('emergency_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching history:', error);
    throw error;
  }
};

// 3. Admin/Responder Actions
export const getPendingEmergencies = async () => {
  try {
    const { data, error } = await supabase
      .from('emergency_messages')
      .select(`
        id,
        message,
        latitude,
        longitude,
        location_address,
        created_at,
        user:user_id (id, phone)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching emergencies:', error);
    throw error;
  }
};

export const updateEmergencyStatus = async (messageId, status, responderId = null) => {
  try {
    const updates = {
      status,
      responded_at: new Date().toISOString(),
      ...(responderId && { responder_id: responderId })
    };

    const { data, error } = await supabase
      .from('emergency_messages')
      .update(updates)
      .eq('id', messageId)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating status:', error);
    throw error;
  }
};

// 4. User Profile Actions
export const updateEmergencyContact = async (userId, contactNumber) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        emergency_contact: contactNumber
      })
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating contact:', error);
    throw error;
  }
};

// 5. Real-time Subscriptions
export const subscribeToEmergencies = (callback) => {
  return supabase
    .channel('emergency_updates')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'emergency_messages',
        filter: 'status=eq.pending'
      },
      (payload) => callback(payload.new)
    )
    .subscribe();
};

// Helper: Format location for display
export const formatLocation = (emergency) => {
  return {
    coords: {
      latitude: emergency.latitude,
      longitude: emergency.longitude
    },
    address: emergency.location_address || 'Address unavailable',
    timestamp: new Date(emergency.created_at).getTime()
  };
};