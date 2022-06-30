import { Contract, providers, utils, Wallet } from 'ethers';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

const abi = [
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'function balanceOf(address tokenHolder) view returns (uint256)',
  'function transfer(address recipient, uint256 amount) returns (bool)',
  'function transferFrom(address holder, address recipient, uint256 amount) returns (bool)',
];

// eslint-disable-next-line import/prefer-default-export
export const transfer = async (
  data: { to: string; amount: string; order: string; phone: string },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context: functions.https.CallableContext,
) => {
  if (context.auth == null) return { error: 'not authenticated' };

  const contractAddress = process.env.KAKICOIN_CONTRACT_ADDRESS;
  const apiKey = process.env.ALCHEMY_API_KEY;
  const privateKey = process.env.PRIVATE_KEY;

  if (contractAddress == null || apiKey == null || privateKey == null)
    return { error: 'missing environment variables' };

  const { to, amount, order, phone } = data;

  // const address = context.auth.uid;
  // if (utils.getAddress(address) !== utils.getAddress(to)) return { error: 'address mismatch' };

  const refOrder = db.collection('orders').doc(order);

  const orderDoc = await refOrder.get();
  const orderData = orderDoc.data();
  if (orderData == null) return { error: 'no order in the database' };
  if (orderData?.phone !== phone) return { error: 'wrong phone number' };
  if (orderData?.used) return { error: 'already used' };
  await refOrder.set({ used: true, address: to }, { merge: true });

  const provider = new providers.AlchemyProvider('maticmum', apiKey);
  const contract = new Contract(contractAddress, abi, provider);
  const wallet = new Wallet(privateKey, provider);

  try {
    const contractWithSigner = contract.connect(wallet);
    const txn = await contractWithSigner.transfer(to, utils.parseEther(amount));
    if (txn == null) throw Error('Error submitting transaction');
    return { hash: txn.hash };
  } catch (e) {
    await refOrder.set({ used: false }, { merge: true });
    return { error: `Error Caught in Catch Statement: ${e}` };
  }
};
