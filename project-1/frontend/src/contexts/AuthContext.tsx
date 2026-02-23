// React and Firebase imports for authentication
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider,
    signOut,
    onAuthStateChanged,
    updateProfile,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
    type User as FirebaseUser
} from "firebase/auth";
import { useLoginMutation, useRegisterMutation } from '../features/auth/authApi';

// Firebase Configuration using Environment Variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase service using the configuration above
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Supported authentication providers
export type AuthProviderType = 'google' | 'github' | 'email' | 'guest';

/**
 * Interface representing a normalized User object in the application.
 */
export interface User {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
    provider: AuthProviderType;
    role?: 'user' | 'admin' | 'guest';
    token?: string;
}

/**
 * Interface for the Authentication Context.
 */
interface AuthContextType {
    user: User | null;
    loading: boolean;
    loginWithEmail: (email: string, pass: string) => Promise<void>;
    signupWithEmail: (name: string, email: string, pass: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    loginWithGithub: () => Promise<void>;
    loginAsGuest: () => Promise<void>;
    logout: () => Promise<void>;
    updateProfileName: (name: string) => Promise<void>;
    changePassword: (oldPass: string, newPass: string) => Promise<void>;
}

// Create the context for authentication
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage key for guest sessions
const GUEST_USER_KEY = 'guest_user_session';

/**
 * AuthProvider: Manages the authentication state for the entire application.
 * Handles login, logout, account creation, and state persistence.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [loginMutation] = useLoginMutation();
    const [registerMutation] = useRegisterMutation();

    /**
     * mapUser: Normalizes a Firebase User object into our custom User format.
     */
    const mapUser = (fbUser: FirebaseUser, providerOverride?: AuthProviderType): User => {
        let provider: AuthProviderType = 'email';

        if (providerOverride) {
            provider = providerOverride;
        } else if (fbUser.providerData.length > 0) {
            const providerId = fbUser.providerData[0].providerId;
            if (providerId === 'google.com') provider = 'google';
            if (providerId === 'github.com') provider = 'github';
        }
        return {
            uid: fbUser.uid,
            displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
            email: fbUser.email,
            photoURL: fbUser.photoURL,
            provider: provider,
            role: fbUser.email === 'admin@talview.com' ? 'admin' : 'user'
        };
    };

    // Persistence for JWT and API headers
    useEffect(() => {
        // CRITICAL: Do not wipe localStorage while Firebase is still determining auth state
        if (loading) return;

        if (user?.token) {
            localStorage.setItem('jwt_token', user.token);
        } else {
            localStorage.removeItem('jwt_token');
        }

        if (user?.email) {
            localStorage.setItem('user_email', user.email);
        } else if (user?.provider === 'guest') {
            localStorage.setItem('user_email', 'guest@talview.com');
        } else {
            localStorage.removeItem('user_email');
        }
    }, [user, loading]);

    // Monitor Auth State changes from Firebase
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
            if (fbUser) {
                // Clear any guest session when real user logs in
                sessionStorage.removeItem(GUEST_USER_KEY);
                const baseUser = mapUser(fbUser);

                // On mount or state change, check if there's a stored token
                const storedToken = localStorage.getItem('jwt_token');
                if (storedToken) {
                    setUser({ ...baseUser, token: storedToken });
                } else {
                    setUser(baseUser);
                }
            } else {
                // Check if there's a guest session to maintain persistence for guests
                const guestData = sessionStorage.getItem(GUEST_USER_KEY);
                if (guestData) {
                    try {
                        const guestUser = JSON.parse(guestData);
                        setUser(guestUser);
                    } catch (e) {
                        sessionStorage.removeItem(GUEST_USER_KEY);
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            }
            setLoading(false);
        });
        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    /**
     * loginWithEmail: Logs in using Firebase authentication service and our backend.
     */
    const loginWithEmail = async (email: string, pass: string) => {
        // Clear guest session
        sessionStorage.removeItem(GUEST_USER_KEY);

        // 1. Firebase Login
        await signInWithEmailAndPassword(auth, email, pass);

        // 2. Backend Login (JWT)
        try {
            const result = await loginMutation({ email, password: pass }).unwrap();

            // 🔥 CRITICAL FIX: Synchronously save to localStorage immediately
            // This prevents onAuthStateChanged from reading null before React state flushes
            localStorage.setItem('jwt_token', result.token);

            setUser(prev => prev ? { ...prev, token: result.token, role: result.user.role } : null);
        } catch (err) {
            console.error('Backend sync failed:', err);
        }
    };

    /**
     * signupWithEmail: Creates a new account in Firebase and our backend.
     */
    const signupWithEmail = async (name: string, email: string, pass: string) => {
        // Clear guest session
        sessionStorage.removeItem(GUEST_USER_KEY);
        // 1. Firebase Create
        await createUserWithEmailAndPassword(auth, email, pass);
        // 2. Backend Register
        try {
            await registerMutation({ email, password: pass }).unwrap();
        } catch (err) {
            console.error('Backend registration failed:', err);
        }
        console.log("Signing up user:", name);
        // 3. Sign out immediately after signup (requiring manual login)
        await signOut(auth);
    };

    /**
     * loginWithGoogle: Uses Google popup for authentication.
     */
    const loginWithGoogle = async () => {
        // Clear guest session
        sessionStorage.removeItem(GUEST_USER_KEY);
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    };

    /**
     * loginWithGithub: Uses GitHub popup for authentication.
     */
    const loginWithGithub = async () => {
        // Clear guest session
        sessionStorage.removeItem(GUEST_USER_KEY);
        const provider = new GithubAuthProvider();
        await signInWithPopup(auth, provider);
    };

    /**
     * loginAsGuest: Creates a temporary guest session stored in sessionStorage.
     */
    const loginAsGuest = async () => {
        const guestUser: User = {
            uid: 'guest_' + Date.now(),
            displayName: 'Guest User',
            email: null,
            photoURL: null,
            provider: 'guest',
            role: 'guest'
        };

        // Store in sessionStorage to persist across page navigation
        sessionStorage.setItem(GUEST_USER_KEY, JSON.stringify(guestUser));
        setUser(guestUser);
    };

    /**
     * logout: Logs out from Firebase and clears any active sessions.
     */
    const logout = async () => {
        // Clear guest session
        sessionStorage.removeItem(GUEST_USER_KEY);
        localStorage.removeItem('jwt_token');
        await signOut(auth);
        setUser(null);
    };

    /**
     * updateProfileName: Updates the user's display name in Firebase and local state.
     */
    const updateProfileName = async (name: string) => {
        if (!auth.currentUser) throw new Error("No user logged in");
        await updateProfile(auth.currentUser, { displayName: name });
        setUser(prev => prev ? { ...prev, displayName: name } : null);
    };

    /**
     * changePassword: Changes user password after re-authenticating with the old one.
     */
    const changePassword = async (oldPass: string, newPass: string) => {
        const user = auth.currentUser;
        if (!user || !user.email) throw new Error("No user logged in");

        // 1. Re-authenticate
        const credential = EmailAuthProvider.credential(user.email, oldPass);
        await reauthenticateWithCredential(user, credential);

        // 2. Update Password
        await updatePassword(user, newPass);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            loginWithEmail,
            signupWithEmail,
            loginWithGoogle,
            loginWithGithub,
            loginAsGuest,
            logout,
            updateProfileName,
            changePassword
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};