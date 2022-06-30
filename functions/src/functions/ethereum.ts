import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { utils } from 'ethers';

const db = admin.firestore();

// The user will see this message when MetaMask makes a "Signature Request" to the user.
const readableMessage = (nonce: string) =>
  'Welcome to Oyster Portal!\n' +
  'Please click "Sign" to sign in to unleash the power of your NFTs.\n' +
  'This request will not trigger a blockchain transaction or cost any gas fees.\n\n' +
  // 'Your authentication status will reset after 24 hours.'
  // `Wallet address:\n${address}` +
  `Nonce:\n${nonce}`;

export const generateNonce = async (
  data: { address: string },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context: functions.https.CallableContext,
) => {
  const { address } = data;
  const refNonces = db.collection('nonces');
  const newData = { address, created: admin.firestore.FieldValue.serverTimestamp() };
  const refDoc = await refNonces.add(newData);
  const { id } = refDoc;
  return { message: readableMessage(id), nonce: id };
};

export const verifyNonce = async (
  data: { signature: string; nonce: string },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context: functions.https.CallableContext,
) => {
  const { signature, nonce } = data;
  const message = readableMessage(nonce);
  const address = utils.verifyMessage(message, signature);
  const refNonce = db.collection('nonces').doc(nonce);
  const nonceDoc = await refNonce.get();
  const nonceData = nonceDoc.data();
  await refNonce.delete();
  if (utils.getAddress(nonceData?.address) !== utils.getAddress(address)) {
    return { error: 'no nonce in the database' };
  }

  const token = await admin.auth().createCustomToken(address);
  return { address, token }; // address for debug only
};

export const deleteNonce = async (
  data: { address: string; nonce: string },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context: functions.https.CallableContext,
) => {
  const { address, nonce } = data;

  const refNonce = db.collection('nonces').doc(nonce);
  const nonceDoc = await refNonce.get();
  const nonceData = nonceDoc.data();
  if (utils.getAddress(nonceData?.address) !== utils.getAddress(address)) {
    return { error: 'no nonce in the database' };
  }
  await refNonce.delete();
  return { success: true };
};
