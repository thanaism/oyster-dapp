import * as functions from 'firebase-functions';

import { test } from '../../functions/test';

export default functions
  .runWith({ memory: '1GB' })
  .https.onCall((data, context) => test(data, context));
