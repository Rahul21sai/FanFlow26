/**
 * @fileoverview Barrel export for all service modules.
 */
export {
  initializeFirebase,
  isFirebaseConfigured,
  signInAnonymously,
  signInWithEmail,
  signOut,
  onAuthChange,
  addIncident,
  subscribeToIncidents,
  subscribeToCrowdData,
} from './firebase';

export {
  askGemini,
  getGeminiFallback,
  isGeminiConfigured,
  toGeminiHistory,
} from './gemini';

export {
  generateSimulatedCrowdData,
  createCrowdDataSubscription,
} from './crowdService';
