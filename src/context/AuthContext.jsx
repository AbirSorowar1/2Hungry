import { createContext, useContext, useEffect, useState } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const user = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
        };
        localStorage.setItem('2hungry_user', JSON.stringify(user));
        setUser(user);
      } else {
        localStorage.removeItem('2hungry_user');
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    const mockUser = {
      uid: 'demo-' + Date.now(),
      email,
      displayName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      photoURL: null,
      emailVerified: true,
    };
    localStorage.setItem('2hungry_user', JSON.stringify(mockUser));
    setUser(mockUser);
    return { user: mockUser };
  };

  const signUp = async (email, password, name) => {
    const mockUser = {
      uid: 'user-' + Date.now(),
      email,
      displayName: name,
      photoURL: null,
    };
    localStorage.setItem('2hungry_user', JSON.stringify(mockUser));
    setUser(mockUser);
    return { user: mockUser };
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // User will be set by onAuthStateChanged
      return { user: result.user };
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};