import * as functions from 'firebase-functions';
import { tweet } from '../../functions/tweet';

export default functions
  .runWith({
    memory: '1GB',
    secrets: ['PRIVATE_KEY', 'ALCHEMY_API_KEY', 'TWITTER_API_KEY', 'TWITTER_API_SECRET'],
  })
  .https.onCall((data, context) => tweet(data, context));
