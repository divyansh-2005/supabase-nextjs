'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '../../../utils/supabase/client';

// Create context for session
const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [user, setUser] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    fetchUser();

    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null); // Update user state
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase]);

  return (
    <SessionContext.Provider value={user}>
      {children}
    </SessionContext.Provider>
  );
}

// Export a hook to use session
export const useSession = () => {
  return useContext(SessionContext);
};
