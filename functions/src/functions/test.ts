import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

// eslint-disable-next-line import/prefer-default-export
export const test = async (
  data: { signature: string; uuid: string },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context: functions.https.CallableContext,
) => {
  const { uuid } = data;
  if (uuid == null) return null;
  const token = await admin.auth().createCustomToken(uuid);
  const account = '';
  return { account, token };
};
