import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem('nexus_crm_session');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('nexus_crm_user_role') || 'NexusOwner';
  });

  const [loading, setLoading] = useState(false);

  // Iniciar Sesión
  const login = async (email, password) => {
    setLoading(true);
    const lowerEmail = email.toLowerCase().trim();

    // 1. Intentar validar contra Supabase Auth real si está disponible
    if (supabase) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: lowerEmail,
          password: password,
        });

        if (!authError && authData && authData.user) {
          // Obtener perfil de la tabla public.profiles (esquema público)
          let profile = null;

          // Intentar primero en public.profiles por email
          const resPublic = await supabase
            .schema('public')
            .from('profiles')
            .select('*')
            .eq('email', lowerEmail)
            .maybeSingle();

          profile = resPublic.data;

          // Si no se encontró por email en public, intentar por id
          if (!profile) {
            const resById = await supabase
              .schema('public')
              .from('profiles')
              .select('*')
              .eq('id', authData.user.id)
              .maybeSingle();
            if (resById.data) {
              profile = resById.data;
            }
          }

          // Si tampoco se encontró en public, probar en el esquema por defecto
          if (!profile) {
            const resDefault = await supabase
              .from('profiles')
              .select('*')
              .eq('email', lowerEmail)
              .maybeSingle();
            profile = resDefault.data;
          }

          // Lista de emails propietarios garantizados
          const OWNER_EMAILS = ['ariel.mellag@gmail.com', 'fariacricardog@gmail.com', 'contacto@smartlean.cl'];

          if (profile || OWNER_EMAILS.includes(lowerEmail)) {
            const role = (profile?.role || 'NexusOwner').toLowerCase();
            const isOwner = role === 'nexusowner' || role === 'owner' || role === 'admin' || OWNER_EMAILS.includes(lowerEmail);

            if (!isOwner) {
              await supabase.auth.signOut();
              setLoading(false);
              return { 
                error: { 
                  message: 'Acceso Restringido: Solo el Propietario de Nexus (NexusOwner) tiene permitido el ingreso a este CRM.' 
                } 
              };
            }

            const activeSession = { 
              user: { 
                email: profile?.email || lowerEmail, 
                name: profile?.full_name || profile?.name || lowerEmail.split('@')[0] 
              } 
            };

            setSession(activeSession);
            setUserRole('NexusOwner');
            localStorage.setItem('nexus_crm_session', JSON.stringify(activeSession));
            localStorage.setItem('nexus_crm_user_role', 'NexusOwner');
            setLoading(false);
            return { error: null };
          } else {
            await supabase.auth.signOut();
            setLoading(false);
            return { error: { message: 'No se pudo verificar el perfil del usuario en la base de datos.' } };
          }
        } else if (authError) {
          if (lowerEmail !== 'contacto@smartlean.cl' || password !== 'nexus123') {
            setLoading(false);
            return { error: { message: authError.message || 'Error de autenticación.' } };
          }
        }
      } catch (err) {
        console.error('Error al validar sesión en Supabase Auth:', err);
      }
    }

    // 2. Fallback de pruebas locales (contacto@smartlean.cl)
    if (lowerEmail === 'contacto@smartlean.cl') {
      if (password === 'nexus123') {
        const mockSession = { 
          user: { 
            email: 'contacto@smartlean.cl', 
            name: 'Ariel SmartLean' 
          } 
        };
        
        setSession(mockSession);
        setUserRole('NexusOwner');
        localStorage.setItem('nexus_crm_session', JSON.stringify(mockSession));
        localStorage.setItem('nexus_crm_user_role', 'NexusOwner');
        setLoading(false);
        return { error: null };
      } else {
        setLoading(false);
        return { error: { message: 'Contraseña incorrecta. Inténtalo de nuevo.' } };
      }
    }

    // 3. Fallback si no es el administrador y no está en la base de datos
    setLoading(false);
    return { 
      error: { 
        message: 'Acceso Restringido: Esta cuenta no tiene permisos de Propietario (NexusOwner) en Nexus Garage.' 
      } 
    };
  };

  // Cerrar Sesión
  const logout = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Error al cerrar sesión en Supabase:', err);
      }
    }
    setSession(null);
    setUserRole('NexusOwner');
    localStorage.removeItem('nexus_crm_session');
    localStorage.removeItem('nexus_crm_user_role');
  };

  const value = {
    session,
    userRole,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
