import * as admin from 'firebase-admin';
import exportIfNeeded from './common/exportifneeded';

if (!admin.apps.length) admin.initializeApp();

exportIfNeeded('test', 'tests/test', exports);

exportIfNeeded('verifyNonce', 'nonces/verifyNonce', exports);
exportIfNeeded('generateNonce', 'nonces/generateNonce', exports);
exportIfNeeded('deleteNonce', 'nonces/deleteNonce', exports);
