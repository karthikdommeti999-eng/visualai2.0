import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for saved user in localStorage on load
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email && password) {
                    const fakeUser = { name: "Karthik User", email };
                    setUser(fakeUser);
                    localStorage.setItem('user', JSON.stringify(fakeUser));
                    resolve(fakeUser);
                } else {
                    reject(new Error("Invalid credentials"));
                }
            }, 50);
        });
    };

    const signup = async (name, email, password) => {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email && password) {
                    const fakeUser = { name, email, notifications: true }; // Default notifications on
                    setUser(fakeUser);
                    localStorage.setItem('user', JSON.stringify(fakeUser));
                    resolve(fakeUser);
                } else {
                    reject(new Error("Failed to sign up"));
                }
            }, 50);
        });
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
            localStorage.setItem('user', JSON.stringify(googleUser));
            return googleUser;
        } catch (error) {
            console.error("Google Login Error", error);
            throw new Error("Failed to authenticate with Google");
        }
    };

    const socialLogin = async (provider) => {
        // Simulate Google/Facebook Login (Fallback or for other providers)
        return new Promise((resolve) => {
            setTimeout(() => {
                const fakeUser = {
                    name: provider === 'google' ? "Google User" : "Facebook User",
                    email: `${provider}@example.com`,
                    notifications: true
                };
                setUser(fakeUser);
                localStorage.setItem('user', JSON.stringify(fakeUser));
                resolve(fakeUser);
            }, 50);
        });
    };

    const toggleNotifications = (enabled) => {
        if (user) {
            const updatedUser = { ...user, notifications: enabled };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    };

    const logout = () => {
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
