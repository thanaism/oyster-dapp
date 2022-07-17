/* eslint-disable no-console, no-alert */
import { Button, Stack } from '@chakra-ui/react';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { metamaskAddress, metamaskChainId, metamaskVerifiedAddress } from 'atoms/metamaskState';
import { signInWithCustomToken } from 'firebase/auth';
import { useState, FC } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { deleteNonce, generateNonce, verifyNonce } from 'utils/functions';
import {
  addKakiCoinAsset,
  addMumbaiNetworkToWallet,
  ChainIds,
  hasMetaMask,
  requestAccount,
} from 'utils/metamask';
import { auth } from '../utils/firebase';
import { BlueButton, LightBlueButton, RedButton } from './Buttons';

export const Login: FC = () => {
  const [isBusy, setIsBusy] = useState(false);
  const [user, setUser] = useRecoilState(metamaskVerifiedAddress);
  const account = useRecoilValue(metamaskAddress);
  const chainId = useRecoilValue(metamaskChainId);

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
    setIsBusy(true);
    const address = account;
    const result = await generateNonce({ address });
    // eslint-disable-next-line no-unsafe-optional-chaining
    const { message, nonce } = (result as { data: { message: string; nonce: string } })?.data;

    console.log('signIn: nonce/message', nonce, message);

    try {
      const signature = await ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      });

      const result2 = await verifyNonce({ signature, nonce });
      const { token } = (result2 as { data: { token: string } }).data;
      console.log('signIn: token', token);
      if (token == null) throw Error('token is empty');
      const userCredential = await signInWithCustomToken(auth, token);
      console.log(userCredential);
      setUser(userCredential.user.uid);
    } catch (e) {
      console.error(e);
      alert('認証に失敗しました');
      try {
        await deleteNonce({ address, nonce });
      } catch (e) {
        console.error(e);
      }
    }
    setIsBusy(false);
  };

  const signOut = async () => {
    await auth.signOut();
    setUser(undefined);
  };

  return (
    <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
      {account == null ? (
        <BlueButton onClick={connect} isLoading={isBusy}>
          MetaMaskへ接続
        </BlueButton>
      ) : (
        ''
      )}
      {account != null && user == null ? (
        <BlueButton onClick={signIn} isLoading={isBusy}>
          深海へ行く！
        </BlueButton>
      ) : (
        ''
      )}
      {user != null ? <RedButton onClick={signOut}>ログアウト</RedButton> : ''}
      {user != null && chainId !== ChainIds.MumbaiTestNet ? (
        <BlueButton onClick={addMumbaiNetworkToWallet}>Mumbaiに切り替え</BlueButton>
      ) : (
        ''
      )}
      {user != null && chainId === ChainIds.MumbaiTestNet ? (
        <LightBlueButton onClick={() => addKakiCoinAsset(chainId)}>
          KAKIコインを設定
        </LightBlueButton>
      ) : (
        ''
      )}
      <Button
        rounded="full"
        as="a"
        href="https://opensea.io/collection/abysscrypto-polygon"
        target="blank"
      >
        NFT購入
      </Button>
    </Stack>
  );
};

export default Login;
