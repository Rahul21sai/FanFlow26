/**
 * @fileoverview Firebase service for authentication and Firestore operations.
 * Uses Firebase JS SDK v10+ with modular imports.
 * Falls back gracefully if Firebase config is missing.
 */

import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously as firebaseSignInAnonymously,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type Auth,
  type User,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  type Firestore,
} from 'firebase/firestore';
import type { Incident, CrowdData } from '../types';
import { FirebaseServiceError } from '../types';
import { COLLECTION_INCIDENTS, COLLECTION_CROWD_DATA } from '../constants';

/** Firebase configuration from environment variables. */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

/**
 * Checks if Firebase is configured with required environment variables.
 * @returns Whether all required Firebase config values are present
 */
export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}

/**
 * Initializes Firebase app, Auth, and Firestore instances.
 * Safe to call multiple times — will return existing instances.
 * @returns Object containing the Firebase app, auth, and db instances
 * @throws {FirebaseServiceError} If Firebase configuration is missing
 */
export function initializeFirebase(): { app: FirebaseApp; auth: Auth; db: Firestore } {
  if (app && auth && db) {
    return { app, auth, db };
  }

  if (!isFirebaseConfigured()) {
    throw new FirebaseServiceError(
      'Firebase configuration is missing. Set VITE_FIREBASE_* environment variables.',
      'FIREBASE_CONFIG_MISSING'
    );
  }

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  return { app, auth, db };
}

/**
 * Signs in the user anonymously (guest mode).
 * @returns The authenticated Firebase User
 * @throws {FirebaseServiceError} If sign-in fails
 */
export async function signInAnonymously(): Promise<User> {
  try {
    const { auth: authInstance } = initializeFirebase();
    const credential = await firebaseSignInAnonymously(authInstance);
    return credential.user;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Anonymous sign-in failed';
    throw new FirebaseServiceError(message, 'FIREBASE_AUTH_ERROR');
  }
}

/**
 * Signs in the user with email and password.
 * @param email - User email address
 * @param password - User password
 * @returns The authenticated Firebase User
 * @throws {FirebaseServiceError} If sign-in fails
 */
export async function signInWithEmail(email: string, password: string): Promise<User> {
  try {
    const { auth: authInstance } = initializeFirebase();
    const credential = await signInWithEmailAndPassword(authInstance, email, password);
    return credential.user;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Email sign-in failed';
    throw new FirebaseServiceError(message, 'FIREBASE_AUTH_ERROR');
  }
}

/**
 * Signs out the current user.
 * @throws {FirebaseServiceError} If sign-out fails
 */
export async function signOut(): Promise<void> {
  try {
    const { auth: authInstance } = initializeFirebase();
    await firebaseSignOut(authInstance);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Sign-out failed';
    throw new FirebaseServiceError(message, 'FIREBASE_AUTH_ERROR');
  }
}

/**
 * Subscribes to authentication state changes.
 * @param callback - Function called with the user (or null) on state change
 * @returns Unsubscribe function
 */
export function onAuthChange(callback: (user: User | null) => void): () => void {
  try {
    const { auth: authInstance } = initializeFirebase();
    return onAuthStateChanged(authInstance, callback);
  } catch {
    // Firebase not configured — immediately call with null
    callback(null);
    return () => { /* no-op unsubscribe */ };
  }
}

/**
 * Adds a new incident to the Firestore incidents collection.
 * @param incident - The incident data to store (without ID)
 * @returns The Firestore document ID of the created incident
 * @throws {FirebaseServiceError} If the write fails
 */
export async function addIncident(
  incident: Omit<Incident, 'id'>
): Promise<string> {
  try {
    const { db: dbInstance } = initializeFirebase();
    const docRef = await addDoc(collection(dbInstance, COLLECTION_INCIDENTS), {
      ...incident,
      reportedAt: incident.reportedAt.toISOString(),
    });
    return docRef.id;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to add incident';
    throw new FirebaseServiceError(message, 'FIREBASE_FIRESTORE_ERROR');
  }
}

/**
 * Subscribes to real-time incident feed updates.
 * @param callback - Function called with updated incident list
 * @param maxItems - Maximum number of incidents to fetch (default 20)
 * @returns Unsubscribe function
 */
export function subscribeToIncidents(
  callback: (incidents: Incident[]) => void,
  maxItems: number = 20
): () => void {
  try {
    const { db: dbInstance } = initializeFirebase();
    const q = query(
      collection(dbInstance, COLLECTION_INCIDENTS),
      orderBy('reportedAt', 'desc'),
      limit(maxItems)
    );

    return onSnapshot(q, (snapshot) => {
      const incidents: Incident[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Incident, 'id' | 'reportedAt'>),
        reportedAt: new Date(doc.data().reportedAt as string),
      }));
      callback(incidents);
    });
  } catch {
    callback([]);
    return () => { /* no-op */ };
  }
}

/**
 * Subscribes to real-time crowd data updates.
 * @param callback - Function called with updated crowd data map
 * @returns Unsubscribe function
 */
export function subscribeToCrowdData(
  callback: (data: Map<string, CrowdData>) => void
): () => void {
  try {
    const { db: dbInstance } = initializeFirebase();
    return onSnapshot(collection(dbInstance, COLLECTION_CROWD_DATA), (snapshot) => {
      const dataMap = new Map<string, CrowdData>();
      snapshot.docs.forEach((doc) => {
        const raw = doc.data();
        dataMap.set(doc.id, {
          zoneId: doc.id,
          currentCount: raw.currentCount as number,
          density: raw.density as CrowdData['density'],
          percentage: raw.percentage as number,
          lastUpdated: new Date(raw.lastUpdated as string),
        });
      });
      callback(dataMap);
    });
  } catch {
    callback(new Map());
    return () => { /* no-op */ };
  }
}
