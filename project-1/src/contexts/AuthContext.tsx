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
    type User as FirebaseUser
} from "firebase/auth";
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
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Types
export type AuthProviderType = 'google' | 'github' | 'email' | 'guest';
export interface User {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
    provider: AuthProviderType;
}
interface AuthContextType {
    user: User | null;
    loading: boolean;
    loginWithEmail: (email: string, pass: string) => Promise<void>;
    signupWithEmail: (name: string, email: string, pass: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    loginWithGithub: () => Promise<void>;
    loginAsGuest: () => Promise<void>;
    logout: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    // Map Firebase User to App User
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
            provider: provider
        };
    };
    // Monitor Auth State
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
            if (fbUser) {
                setUser(mapUser(fbUser));
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);
    const loginWithEmail = async (email: string, pass: string) => {
        await signInWithEmailAndPassword(auth, email, pass);
    };
    const signupWithEmail = async (name: string, email: string, pass: string) => {
        // 1. Create User
        await createUserWithEmailAndPassword(auth, email, pass);
        console.log("Signing up user:", name);
        // 2. Sign out (Redirect flow requirement)
        await signOut(auth);
    };
    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    };
    const loginWithGithub = async () => {
        const provider = new GithubAuthProvider();
        await signInWithPopup(auth, provider);
    };
    const loginAsGuest = async () => {
        setUser({
            uid: 'guest_' + Date.now(),
            displayName: 'Guest User',
            email: null,
            photoURL: null,
            provider: 'guest'
        });
    };
    const logout = async () => {
        await signOut(auth);
        setUser(null);
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
            logout
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