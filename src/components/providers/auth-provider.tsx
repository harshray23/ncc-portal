"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getFirebase } from '@/lib/firebase';
import type { UserProfile } from '@/lib/types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

  const fetchUserProfile = useCallback(async (fbUser: User) => {
    const { db } = getFirebase();
    const token = await fbUser.getIdTokenResult();
    const role = token.claims.role as string;

    if (!role) {
      setUser(null);
      setLoading(false);
      return;
    }

    const collectionName = `${role}s`;
    const userDocRef = doc(db, collectionName, fbUser.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      const userProfile: UserProfile = {
        uid: fbUser.uid,
        email: data.email,
        name: data.name,
        role: data.role,
        regimentalNumber: data.regimentalNumber,
        studentId: data.studentId,
        rank: data.rank,
        phone: data.phone,
        whatsapp: data.whatsapp,
        approved: data.approved,
        unit: data.unit,
        year: data.year,
        createdAt: data.createdAt.toDate(),
        regimentalNumberEditCount: data.regimentalNumberEditCount || 0,
        profilePhotoUrl: data.profilePhotoUrl
      };
      setUser(userProfile);
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const { auth } = getFirebase();
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);
      if (fbUser) {
        setFirebaseUser(fbUser);
        await fetchUserProfile(fbUser);
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchUserProfile]);

  const refreshUser = useCallback(async () => {
    if (firebaseUser) {
      setLoading(true);
      await firebaseUser.reload();
      const refreshedFbUser = getFirebase().auth.currentUser;
      if (refreshedFbUser) {
        await fetchUserProfile(refreshedFbUser);
      }
      setLoading(false);
    }
  }, [firebaseUser, fetchUserProfile]);


  return (
    <AuthContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
