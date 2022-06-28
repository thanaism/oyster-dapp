import * as functions from 'firebase-functions';

import { deleteNonce } from '../../functions/ethereum';

export default functions
  .runWith({ memory: '1GB' })
  .https.onCall((data, context) => deleteNonce(data, context));
