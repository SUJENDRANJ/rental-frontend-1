import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useAppDispatch } from './useAppDispatch';
import { loginSuccess, logout } from '../store/slices/authSlice';

export const useSupabase = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          await handleUserSession(session.user);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      }
      
      setLoading(false);
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (event === 'SIGNED_IN' && session?.user) {
            await handleUserSession(session.user);
          } else if (event === 'SIGNED_OUT') {
            dispatch(logout());
          }
        } catch (error) {
          console.error('Error handling auth state change:', error);
        }
        setLoading(false);
      }
    );

    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  const handleUserSession = async (user: User) => {
    try {
      // Get user profile from database
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        // If profile doesn't exist, it might be a new user
        if (error.code === 'PGRST116') {
          // Profile not found, user might be newly created
          console.log('Profile not found, user might be newly created');
          dispatch(loginSuccess({
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            avatar: user.user_metadata?.avatar_url,
            role: 'renter', // Default role
          }));
        } else {
          console.error('Error fetching profile:', error);
        }
        return;
      }

      if (profile) {
        dispatch(loginSuccess({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar_url || undefined,
          role: profile.role,
          kycStatus: profile.kyc_status,
        }));
      }
    } catch (error) {
      console.error('Error handling user session:', error);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    loading,
    signUp,
    signIn,
    signOut,
  };
};