import { BigNumber, Contract, ethers, providers, utils, Wallet } from 'ethers';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { TwitterApi } from 'twitter-api-v2';

const db = admin.firestore();

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
    return { error: 'サーバーが正しくセットアップされていません。管理者にお問い合わせください。' };

  const { to, accessToken, accessSecret, text } = data;

  try {
    const twitterClient = new TwitterApi({ appKey, appSecret, accessToken, accessSecret });
    await twitterClient.v2.tweet(text);
  } catch {
    return { error: 'ツイートに失敗しました。文字数をご確認ください。' };
  }

  const address = utils.getAddress(to);

  const refTweet = db.collection('tweets').doc(address);
  const tweetDoc = await refTweet.get();
  const tweetData = tweetDoc.data();

  if (tweetData != null) {
    const previousDate = tweetData.created.toDate();
    const currentDate = new Date();
    const difMs = currentDate.getTime() - previousDate.getTime();
    const MSEC_PER_DAY = 86400 * 1000;
    if (difMs < MSEC_PER_DAY) return { error: 'コインが付与されるのは1日1ツイートまでです。' };
  }

  const newData = { created: admin.firestore.FieldValue.serverTimestamp() };
  await refTweet.set(newData);

  const provider = new providers.AlchemyProvider('maticmum', apiKey);
  const contract = new Contract(contractAddress, abi, provider);
  const wallet = new Wallet(privateKey, provider);

  try {
    // 牡蠣コイン保有数に応じて付与量ブーストして設定（2000ごとにUP）
    const balance = (await contract.balanceOf(to)) as BigNumber;
    const divided = balance.div(ethers.BigNumber.from('2000'));
    const normalized = divided.gt(ethers.BigNumber.from('3')) ? 3 : divided.toNumber();
    const level = Math.floor(normalized / 2000);
    const steps = [15, 20, 40, 40];
    const amount = steps[level];

    const contractWithSigner = contract.connect(wallet);
    const txn = await contractWithSigner.transfer(to, utils.parseEther(String(amount)));
    if (txn == null) throw Error('トランザクションの登録に失敗しました');
    return { hash: txn.hash };
  } catch (e) {
    return { error: `ブロックチェーン処理中にエラーが発生しました: ${e}` };
  }
};
