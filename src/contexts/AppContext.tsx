import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getDriverByUserId } from '@/services/drivers';
import type { UserProfile, Driver, UserRole, AuthState } from '@/types';

interface AppContextType extends AuthState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  signOut: () => Promise<void>;
}

const defaultAppContext: AppContextType = {
  user: null,
  driver: null,
  role: null,
  isAuthenticated: false,
  isLoading: true,
  sidebarOpen: false,
  toggleSidebar: () => {},
  signOut: async () => {},
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const loadUserData = async (userId: string, email: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profile) {
      setUser(profile as UserProfile);
    } else {
      setUser({ id: userId, email, full_name: email, phone: null, is_student: false, avatar_url: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    }

    const { data: driverRecord } = await getDriverByUserId(userId);
    if (driverRecord) {
      setDriver(driverRecord);
      setRole('driver');
    } else {
      setDriver(null);
      setRole('customer');
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
        loadUserData(session.user.id, session.user.email!).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserData(session.user.id, session.user.email!);
      } else {
        setUser(null);
        setDriver(null);
        setRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        driver,
        role,
        isAuthenticated: !!user,
        isLoading,
        sidebarOpen,
        toggleSidebar,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
