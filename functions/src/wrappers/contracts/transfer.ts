import * as functions from 'firebase-functions';
import { transfer } from '../../functions/contract';

export default functions
  .runWith({ memory: '1GB', secrets: ['PRIVATE_KEY', 'ALCHEMY_API_KEY'] })
  .https.onCall((data, context) => transfer(data, context));
