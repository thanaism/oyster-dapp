import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { utils } from 'ethers';

const db = admin.firestore();

// The user will see this message when MetaMask makes a "Signature Request" to the user.
const readableMessage = (id: string) =>
  'Welcome to Oyster Portal!\n' +
  'Please click "Sign" to sign in to unleash the power of your NFTs.\n' +
  'This request will not trigger a blockchain transaction or cost any gas fees.\n\n' +
  // 'Your authentication status will reset after 24 hours.'
  // `Wallet address:\n${address}` +
  `Nonce:\n${id}`;

export const generateNonce = async (
  data: { account: string },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context: functions.https.CallableContext,
) => {
  const { account } = data;
  const refNonces = db.collection('nonces');
  const newData = { account, created: admin.firestore.FieldValue.serverTimestamp() };
  const refDoc = await refNonces.add(newData);
  const { id } = refDoc;
  return { nonce: readableMessage(id), id };
};

export const verifyNonce = async (
  data: { signature: string; id: string },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context: functions.https.CallableContext,
) => {
  const { signature, id } = data;
  const message = readableMessage(id);
  const account = utils.verifyMessage(message, signature);
  const refNonce = db.collection('nonces').doc(id);
  const nonceDoc = await refNonce.get();
  const nonceData = nonceDoc.data();
  await refNonce.delete();
  if (nonceData?.account !== account) {
    return { error: 'no nonce in the database' };
  }

  const token = await admin.auth().createCustomToken(account);
  return { account, token }; // account for debug only
};

export const deleteNonce = async (
  data: { account: string; uuid: string },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context: functions.https.CallableContext,
) => {
  const { account, uuid } = data;

  const refNonce = db.collection('nonces').doc(uuid);
  const nonceDoc = await refNonce.get();
  const nonceData = nonceDoc.data();
  if (nonceData?.account !== account) {
    return { error: 'no nonce in the database' };
  }
  await refNonce.delete();
  return { success: true };
};
