/* eslint-disable camelcase */
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { createHmac } from 'crypto';

const db = admin.firestore();

const verify = (rawBody: Buffer, hmac: unknown) => {
  const secret = process.env.SHOPIFY_SECRET_KEY;
  if (secret == null) throw Error('secret key for validation is undefined...');

  const hash = createHmac('SHA256', secret).update(rawBody).digest('base64');
  if (hash !== hmac) throw Error('verification failed...');
};

// eslint-disable-next-line import/prefer-default-export, @typescript-eslint/no-unused-vars
export const receiveShopifyWebhook = async (req: functions.https.Request, res: unknown) => {
  const hmac = req.headers['X-Shopify-Hmac-SHA256'] || req.headers['x-shopify-hmac-sha256'];
  verify(req.rawBody, hmac);

  const { total_price: price, name, email, shipping_address } = req.body;
  let { phone } = shipping_address;
  phone = phone.replace(/-/g, '');
  const order = name.slice(1);

  const refOrder = db.collection('orders').doc(order);
  await refOrder.set({ used: false, price, email, phone }, { merge: true });
};
