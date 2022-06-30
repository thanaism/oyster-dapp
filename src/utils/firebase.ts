import { initializeApp } from 'firebase/app';

import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';

import firebaseConfig from '../config/project';

const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore();
export const auth = getAuth();
export const functions = getFunctions(firebaseApp);

// eslint-disable-next-line no-restricted-globals
if (location.hostname === 'localhost') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectFunctionsEmulator(functions, 'localhost', 5001);
}
