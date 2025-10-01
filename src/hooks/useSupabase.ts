import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useAppDispatch } from './useAppDispatch';
import { loginSuccess, logout, updateSessionExpiry } from '../store/slices/authSlice';

export const useSupabase = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      if (!mounted) return;
      setLoading(true);

      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session?.user) {
          await handleUserSession(session.user);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        (async () => {
          try {
            if (event === 'SIGNED_IN' && session?.user) {
              await handleUserSession(session.user);
            } else if (event === 'SIGNED_OUT') {
              dispatch(logout());
            }
          } catch (error) {
            console.error('Error handling auth state change:', error);
          }
        })();
      }
    );

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [dispatch]);

  const handleUserSession = async (user: User) => {
    try {
      // Calculate session expiry (30 days from now)
      const sessionExpiry = new Date();
      sessionExpiry.setDate(sessionExpiry.getDate() + 30);

      const defaultUserData = {
        id: user.id,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        avatar: user.user_metadata?.avatar_url,
        role: 'renter' as const,
        sessionExpiry: sessionExpiry.toISOString(),
      };

      // Add timeout to profile fetch (5 seconds)
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 5000);
      });

      try {
        const { data: profile, error } = await Promise.race([
          profilePromise,
          timeoutPromise,
        ]) as { data: any; error: any };

        if (error) {
          // If profile doesn't exist or table doesn't exist, use default data
          console.log('Profile fetch error:', error.code || error.message);
          dispatch(loginSuccess(defaultUserData));
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
            sessionExpiry: sessionExpiry.toISOString(),
          }));
        } else {
          dispatch(loginSuccess(defaultUserData));
        }
      } catch (timeoutError) {
        // Timeout or profile fetch failed, use default data
        console.log('Profile fetch timed out or failed, using default data');
        dispatch(loginSuccess(defaultUserData));
      }
    } catch (error) {
      console.error('Error handling user session:', error);
      // Fallback to basic user info if database operations fail
      const sessionExpiry = new Date();
      sessionExpiry.setDate(sessionExpiry.getDate() + 30);

      dispatch(loginSuccess({
        id: user.id,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        avatar: user.user_metadata?.avatar_url,
        role: 'renter',
        sessionExpiry: sessionExpiry.toISOString(),
      }));
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
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Set session to persist for 30 days
    if (data.session) {
      await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });
    }
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