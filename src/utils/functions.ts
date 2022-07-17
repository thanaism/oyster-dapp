import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

export const generateNonce = httpsCallable(functions, 'generateNonce');
export const verifyNonce = httpsCallable(functions, 'verifyNonce');
export const deleteNonce = httpsCallable(functions, 'deleteNonce');
export const transfer = httpsCallable(functions, 'transfer');
export const tweet = httpsCallable(functions, 'tweet');
