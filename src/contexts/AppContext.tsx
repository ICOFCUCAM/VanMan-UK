import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getDriverByUserId } from '@/services/drivers';
import type { UserProfile, Driver, UserRole } from '@/types';

interface AppContextType {
  user: UserProfile | null;
  driver: Driver | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppContextType>({
  user: null,
  driver: null,
  role: null,
  isAuthenticated: false,
  isLoading: true,
  sidebarOpen: false,
  toggleSidebar: () => {},
  signOut: async () => {},
});

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loadUserData = async (userId: string, email: string) => {
    setIsLoading(true);
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const userProfile: UserProfile = profile ?? {
        id: userId,
        email,
        full_name: email,
        phone: null,
        is_student: false,
        is_admin: false,
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser(userProfile);

      if (userProfile.is_admin) {
        setDriver(null);
        setRole('admin');
      } else {
        const { data: driverRecord } = await getDriverByUserId(userId);
        if (driverRecord) {
          setDriver(driverRecord);
          setRole('driver');
        } else {
          setDriver(null);
          setRole('customer');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setDriver(null);
    setRole(null);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserData(session.user.id, session.user.email!);
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        loadUserData(session.user.id, session.user.email!);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setDriver(null);
        setRole(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AppContext.Provider value={{
      user,
      driver,
      role,
      isAuthenticated: !!user,
      isLoading,
      sidebarOpen,
      toggleSidebar: () => setSidebarOpen(p => !p),
      signOut: handleSignOut,
    }}>
      {children}
    </AppContext.Provider>
  );
};
