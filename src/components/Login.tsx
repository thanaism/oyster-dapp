import { Button, Stack } from '@chakra-ui/react';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { signInWithCustomToken } from 'firebase/auth';
import { useState, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { metamaskSlice, MetaMaskState } from 'store/metamaskSlice';
import { deleteNonce, generateNonce, transfer, verifyNonce } from 'utils/functions';
import {
  addKakiCoinAsset,
  addMumbaiNetworkToWallet,
  ChainIds,
  hasMetaMask,
  requestAccount,
} from 'utils/metamask';
import { auth } from '../utils/firebase';

export const Login: FC = () => {
  const [isBusy, setIsBusy] = useState(false);
  const dispatch = useDispatch();
  const { actions } = metamaskSlice;
  const metamask = useSelector((state: MetaMaskState) => state);

  const connect = async () => {
    if (!hasMetaMask()) {
      alert('MetaMaskをインストールしてください');
      return;
    }
    // setIsBusy('MetaMaskに接続しています...');
    setIsBusy(true);
    try {
      await requestAccount();
    } catch (e) {
      console.log(e);
    }
    setIsBusy(false);
  };

  const signIn = async () => {
    const { ethereum } = window as unknown as { ethereum: MetaMaskInpageProvider };
    // Step 1: We get a nonce from the server
    // setIsBusy('サーバーに認証用メッセージを要求しています...');
    setIsBusy(true);
    const address = metamask?.account;
    const result = await generateNonce({ address });
    // eslint-disable-next-line no-unsafe-optional-chaining
    const { message, nonce } = (result as { data: { message: string; nonce: string } })?.data;

    console.log('signIn: nonce/message', nonce, message);

    try {
      // Step 2: We ask the user to sign this nonce
      // setIsBusy('MetaMask上での署名（Sign）を待機しています...');
      const signature = await ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      });

      // Step 3: We ask the server to verify the signature and get custom token
      const result2 = await verifyNonce({ signature, nonce });
      console.log(result2.data);
      const { token } = (result2 as { data: { token: string } }).data;
      console.log('signIn: token', token);
      if (token == null) throw Error('token is empty');
      const userCredential = await signInWithCustomToken(auth, token);
      console.log(userCredential);
      console.log(userCredential.user);
      dispatch(actions.setUser(userCredential.user.uid));
      // dispatch(actions.setUser(userCredential.user));
    } catch (e) {
      console.error(e);
      alert('認証に失敗しました');
      // setIsBusy('認証をキャンセルしています...');
      try {
        await deleteNonce({ address, nonce });
        // eslint-disable-next-line no-shadow
      } catch (e) {
        console.error(e);
      }
    }
    setIsBusy(false);
  };

  const signOut = async () => {
    await auth.signOut();
    dispatch(actions.setUser(undefined));
  };

  return (
    <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
      {metamask?.account == null ? (
        <Button
          rounded="full"
          bg="blue.400"
          color="white"
          _hover={{ bg: 'blue.500' }}
          onClick={connect}
          isLoading={isBusy}
        >
          MetaMaskへ接続
        </Button>
      ) : (
        ''
      )}
      {metamask?.account != null && metamask?.user == null ? (
        <Button
          rounded="full"
          bg="blue.400"
          color="white"
          _hover={{ bg: 'blue.500' }}
          onClick={signIn}
          isLoading={isBusy}
        >
          深海へ行く！
        </Button>
      ) : (
        ''
      )}
      {metamask?.user != null ? (
        <Button
          rounded="full"
          bg="red.400"
          color="white"
          _hover={{ bg: 'red.500' }}
          onClick={signOut}
        >
          ログアウト
        </Button>
      ) : (
        ''
      )}
      {metamask?.user != null && metamask?.chainId !== ChainIds.MumbaiTestNet ? (
        <Button
          rounded="full"
          bg="blue.400"
          color="white"
          _hover={{ bg: 'blue.500' }}
          onClick={addMumbaiNetworkToWallet}
        >
          Mumbaiに切り替え
        </Button>
      ) : (
        ''
      )}
      {metamask?.user != null && metamask?.chainId === ChainIds.MumbaiTestNet ? (
        <Button
          rounded="full"
          bg="blue.200"
          color="white"
          _hover={{ bg: 'blue.300' }}
          onClick={() => addKakiCoinAsset(metamask)}
        >
          KAKIコインを設定
        </Button>
      ) : (
        ''
      )}
      <Button
        rounded={'full'}
        as="a"
        href="https://opensea.io/collection/abysscrypto-polygon"
        target={'blank'}
      >
        NFT購入
      </Button>
    </Stack>
  );
};

export default Login;
