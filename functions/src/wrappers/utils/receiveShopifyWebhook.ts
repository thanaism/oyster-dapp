import * as functions from 'firebase-functions';
import { receiveShopifyWebhook } from '../../functions/utils';

export default functions
  .runWith({ memory: '1GB', secrets: ['SHOPIFY_SECRET_KEY'] })
  .https.onRequest((req, res) => receiveShopifyWebhook(req, res));
