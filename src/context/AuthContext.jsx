import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for active session on load
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser({
                    ...session.user,
                    name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
                    notifications: session.user.user_metadata?.notifications ?? true
                });
            }
            setLoading(false);
        };

        checkUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setUser({
                    ...session.user,
                    name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
                    notifications: session.user.user_metadata?.notifications ?? true
                });
            } else {
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        return data.user;
    };

    const signup = async (name, email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                    notifications: true
                }
            }
        });

        if (error) throw error;
        return data.user;
    };

    const handleGoogleLogin = (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);
            const googleUser = {
                name: decoded.name,
                email: decoded.email,
                avatar: decoded.picture,
                notifications: true,
                provider: 'google'
            };
            setUser(googleUser);
            // Note: For real Google Auth with Supabase, you would typically use supabase.auth.signInWithOAuth
            // But if you are using the manual Google button, you can track them locally or link them.
            localStorage.setItem('user', JSON.stringify(googleUser));
            return googleUser;
        } catch (error) {
            console.error("Google Login Error", error);
            throw new Error("Failed to authenticate with Google");
        }
    };

    const socialLogin = async (provider) => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider,
        });
        if (error) throw error;
        return data;
    };

    const toggleNotifications = async (enabled) => {
        if (user) {
            const { error } = await supabase.auth.updateUser({
                data: { notifications: enabled }
            });
            if (!error) {
                setUser(prev => ({ ...prev, notifications: enabled }));
            }
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, socialLogin, handleGoogleLogin, toggleNotifications, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
