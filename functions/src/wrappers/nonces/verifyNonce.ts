import * as functions from 'firebase-functions';

import { verifyNonce } from '../../functions/ethereum';

export default functions
  .runWith({ memory: '1GB' })
  .https.onCall((data, context) => verifyNonce(data, context));
