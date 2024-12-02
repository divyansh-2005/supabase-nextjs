// hooks/useUserSession.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {createClient} from '@/../../utils/supabase/client'; // Import your Supabase client

let cachedSession = null; // Cache session for persistence
let authListenerInitialized = false; // Prevent multiple listeners

const useUserSession = () => {
    const supabase = createClient(); // Create a Supabase client
  const [session, setSession] = useState(cachedSession);
  const [loading, setLoading] = useState(!cachedSession);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      if (!cachedSession) {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error fetching session:', error.message);
        } else {
          cachedSession = data.session;
          setSession(cachedSession);
        }
        setLoading(false);
      }
    };

    fetchSession();

    // Initialize auth state listener if not already done
    if (!authListenerInitialized) {
      authListenerInitialized = true;

      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          cachedSession = session;
          setSession(session);

          // Redirect user on sign out
          if (event === 'SIGNED_OUT') {
            router.push('/login');
          }
        }
      );

      // Cleanup listener on component unmount
      return () => {
        authListener?.subscription?.unsubscribe();
        authListenerInitialized = false;
      };
    }
  }, [router]);

  return { session, loading };
};

export default useUserSession;
