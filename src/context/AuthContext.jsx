import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch additional user details from Firestore
        let userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          streak: 0,
          badges: [],
          weeklyGoal: 10
        };

        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            userData = { ...userData, ...userDoc.data() };
          }
        } catch (e) {
          console.error("Error fetching user data", e);
        }
        
        setCurrentUser(userData);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update auth profile
    await updateProfile(user, { displayName });

    // Create user document in Firestore
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName,
      streak: 0,
      badges: ['First Step'],
      weeklyGoal: 10,
      createdAt: new Date().toISOString()
    };
    
    await setDoc(doc(db, 'users', user.uid), userData);
    
    // Force a local update immediately while waiting for onAuthStateChanged
    setCurrentUser(userData);
    return user;
  };

  const login = async (email, password) => {
    if (email === 'demo@studyflow.app') {
      // Small override for demo mode logic just in case it's used
      const fakeUser = {
        uid: 'demo_user',
        email: 'demo@studyflow.app',
        displayName: 'Demo User',
        streak: 5,
        badges: ['Demo Master'],
        weeklyGoal: 10
      };
      setCurrentUser(fakeUser);
      return fakeUser;
    }
    
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user document already exists, if not create one
    let userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      streak: 0,
      badges: ['Google Scholar'],
      weeklyGoal: 10,
      createdAt: new Date().toISOString()
    };

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), userData);
      }
    } catch (e) {
      console.error("Error creating Google user doc", e);
    }
    
    return user;
  };

  const logout = () => {
    if (currentUser?.uid === 'demo_user') {
      setCurrentUser(null);
      return;
    }
    return signOut(auth);
  };

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
