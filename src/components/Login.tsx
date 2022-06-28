import { Button } from '@chakra-ui/react';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { signInWithCustomToken } from 'firebase/auth';
import { useState, VFC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { metamaskSlice, MetaMaskState } from 'store/metamaskSlice';
import { deleteNonce, generateNonce, verifyNonce } from 'utils/functions';
import { requestAccount } from 'utils/metamask';
import { auth } from '../utils/firebase';

// eslint-disable-next-line react/function-component-definition
const Login: VFC = () => {
  const [isBusy, setIsBusy] = useState('');
  const { actions } = metamaskSlice;
  const dispatch = useDispatch();
  const metamask = useSelector((state: MetaMaskState) => state);

  const connect = async () => {
    setIsBusy('Connecting MetaMask...');
    try {
      await requestAccount();
    } catch (e) {
      console.log(e);
    }
    setIsBusy('');
    console.log('*****', metamask?.account);
  };

  const signIn = async () => {
    const { ethereum } = window as unknown as { ethereum: MetaMaskInpageProvider };
    // Step 1: We get a nonce from the server
    setIsBusy('Fetching a verification message from server...');
    const account = metamask?.account;
    const result = await generateNonce({ account });
    // eslint-disable-next-line no-unsafe-optional-chaining
    const { nonce, uuid } = (result as { data: { nonce: unknown; uuid: unknown } })?.data;

    console.log('signIn: uuid/nonce', uuid, nonce);

    try {
      // Step 2: We ask the user to sign this nonce
      setIsBusy('Waiting for you to sign a message...');
      const signature = await ethereum.request({
        method: 'personal_sign',
        params: [nonce, account],
      });

      // Step 3: We ask the server to verify the signature and get custom token
      const result2 = await verifyNonce({ signature, uuid });
      console.log(result2.data);
      const { token } = (result2 as { data: { token: string } }).data;
      console.log('signIn: token', token);
      if (token) {
        const userCredential = await signInWithCustomToken(auth, token);
        console.log(userCredential);
        console.log(userCredential.user);
        // dispatch(actions.setUser(userCredential.user));
      } else {
        // eslint-disable-next-line no-alert
        alert('Failed to verifyIdenty');
      }
    } catch (e) {
      console.error(e);
      setIsBusy('Canceling the verification...');
      try {
        await deleteNonce({ account, uuid });
        // eslint-disable-next-line no-shadow
      } catch (e) {
        console.error(e);
      }
    }
    setIsBusy('');
  };
  const signOut = async () => {
    await auth.signOut();
  };

  return (
    <>
      {metamask?.account == null ? <Button onClick={connect}>connect</Button> : ''}
      {/* <Button onClick={signIn}>signIn</Button> */}
      {/* <Button onClick={signOut}>signOut</Button> */}
      {isBusy}
    </>
  );
};

export default Login;
