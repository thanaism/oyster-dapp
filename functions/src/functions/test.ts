import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const test = async (
  data: { signature: string; uuid: string },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context: functions.https.CallableContext,
) => {
  const { uuid } = data;
  if (uuid == null) return null;
  const auth = admin.auth();
  const token = await auth.createCustomToken(uuid);
  const account = '';
  return { account, token };
};
