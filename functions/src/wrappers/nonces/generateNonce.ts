import * as functions from 'firebase-functions';

import { generateNonce } from '../../functions/ethereum';

export default functions
  // .region('asia-northeast1')
  .runWith({
    memory: '1GB',
  })
  .https.onCall(async (data, context) => {
    return await generateNonce(data, context);
  });
