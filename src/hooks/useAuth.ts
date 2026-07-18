/**
 * @fileoverview Authentication hook for Firebase Auth state management.
 */

import { useState, useEffect, useCallback } from 'react';
import type { User } from 'firebase/auth';
import {
  onAuthChange,
  signInAnonymously,
  signInWithEmail,
  signOut,
  isFirebaseConfigured,
} from '../services';

/** Return type for the useAuth hook. */
export interface UseAuthReturn {
  /** Currently authenticated user, or null. */
  readonly user: User | null;
  /** Whether auth state is still loading. */
  readonly loading: boolean;
  /** Whether Firebase Auth is configured. */
  readonly isConfigured: boolean;
  /** Sign in anonymously (guest mode). */
  readonly signInAnon: () => Promise<void>;
  /** Sign in with email and password. */
  readonly signInEmail: (email: string, password: string) => Promise<void>;
  /** Sign out the current user. */
  readonly handleSignOut: () => Promise<void>;
}

/**
 * React hook for Firebase authentication state management.
 * Provides user state, loading indicator, and auth actions.
 * Falls back gracefully when Firebase is not configured.
 *
 * @returns Authentication state and action functions
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isConfigured = isFirebaseConfigured();

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, [isConfigured]);

  const signInAnon = useCallback(async () => {
    if (!isConfigured) return;
    setLoading(true);
    try {
      await signInAnonymously();
    } finally {
      setLoading(false);
    }
  }, [isConfigured]);

  const signInEmail = useCallback(async (email: string, password: string) => {
    if (!isConfigured) return;
    setLoading(true);
    try {
      await signInWithEmail(email, password);
    } finally {
      setLoading(false);
    }
  }, [isConfigured]);

  const handleSignOut = useCallback(async () => {
    if (!isConfigured) return;
    await signOut();
  }, [isConfigured]);

  return { user, loading, isConfigured, signInAnon, signInEmail, handleSignOut };
}
