import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

// eslint-disable-next-line import/prefer-default-export
export const test = httpsCallable(functions, 'test');
export const generateNonce = httpsCallable(functions, 'generateNonce');
export const verifyNonce = httpsCallable(functions, 'verifyNonce');
export const deleteNonce = httpsCallable(functions, 'deleteNonce');
export const transfer = httpsCallable(functions, 'transfer');
