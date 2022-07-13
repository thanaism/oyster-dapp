import { BigNumber, Contract, ethers, providers, utils, Wallet } from 'ethers';
import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';
import { TwitterApi } from 'twitter-api-v2';

// const db = admin.firestore();

const abi = [
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'function balanceOf(address tokenHolder) view returns (uint256)',
  'function transfer(address recipient, uint256 amount) returns (bool)',
  'function transferFrom(address holder, address recipient, uint256 amount) returns (bool)',
];

// eslint-disable-next-line import/prefer-default-export
export const tweet = async (
  data: { to: string; accessToken: string; accessSecret: string; text: string },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context: functions.https.CallableContext,
) => {
  if (context.auth == null) return { error: 'not authenticated' };

  const contractAddress = process.env.KAKICOIN_CONTRACT_ADDRESS;
  const apiKey = process.env.ALCHEMY_API_KEY;
  const privateKey = process.env.PRIVATE_KEY;
  const appKey = process.env.TWITTER_API_KEY;
  const appSecret = process.env.TWITTER_API_SECRET;

  if (
    contractAddress == null ||
    apiKey == null ||
    privateKey == null ||
    appKey == null ||
    appSecret == null
  )
    return { error: 'missing environment variables' };

  const { to, accessToken, accessSecret, text } = data;

  // const address = context.auth.uid;
  // if (utils.getAddress(address) !== utils.getAddress(to)) return { error: 'address mismatch' };

  try {
    const twitterClient = new TwitterApi({ appKey, appSecret, accessToken, accessSecret });
    await twitterClient.v2.tweet(text);
    // console.log(twitterClient, text);
  } catch {
    return { error: 'Tweet failed' };
  }

  // const refUser = db.collection('users').doc(to);

  // const userDoc = await refUser.get();
  // const userData = userDoc.data();

  // if (orderData == null) return { error: 'no order in the database' };
  // if (orderData?.phone !== phone) return { error: 'wrong phone number' };
  // if (orderData?.used) return { error: 'already used' };
  // const { price } = orderData;
  // const flooredPrice = ((price / 100) | 0) * 10;
  // await refUser.set({ used: true, address: to }, { merge: true });

  const provider = new providers.AlchemyProvider('maticmum', apiKey);
  const contract = new Contract(contractAddress, abi, provider);
  const wallet = new Wallet(privateKey, provider);

  try {
    const balance = (await contract.balanceOf(to)) as BigNumber;
    const divided = balance.div(ethers.BigNumber.from('2000'));
    const normalized = divided.gt(ethers.BigNumber.from('3')) ? 3 : divided.toNumber();
    const level = Math.floor(normalized / 2000);
    const steps = [15, 20, 40, 40];
    const amount = steps[level];
    const contractWithSigner = contract.connect(wallet);
    const txn = await contractWithSigner.transfer(to, utils.parseEther(String(amount)));
    if (txn == null) throw Error('Error submitting transaction');
    return { hash: txn.hash };
  } catch (e) {
    // await refUser.set({ used: false }, { merge: true });
    return { error: `Error Caught in Catch Statement: ${e}` };
  }
};
