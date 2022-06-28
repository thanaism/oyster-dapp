import { useEffect, VFC } from 'react';
import { ChainIds, initializeEthereum } from 'utils/metamask';

import { useDispatch, useSelector } from 'react-redux';
import { MetaMaskState } from 'store/metamaskSlice';
import Login from 'components/Login';
import Tokens from 'components/Tokens';
import { Box, ChakraProvider, Heading } from '@chakra-ui/react';
import FirebaseAuth from 'components/FirebaseAuth';
import TwitterLogin from 'components/TwitterLogin';

const App: VFC = () => {
  const dispatch = useDispatch();
  const metamask = useSelector((state: MetaMaskState) => state);

  useEffect(() => {
    void initializeEthereum(dispatch, metamask);
  }, [dispatch, metamask]);

  const networks = Object.fromEntries(Object.entries(ChainIds).map(([k, v]) => [v, k]));

  return (
    <ChakraProvider>
      <Box>
        <Heading>牡蠣ポータル🦪</Heading>
        こちらは開発中の画面です…… ・接続先ネットワークID：{metamask?.chainId} <br />
        ・接続先ネットワーク名：
        {metamask?.chainId ? JSON.stringify(networks[metamask?.chainId]) : ''} <br />
        ・ウォレットID：{metamask?.account} <br />
        <Tokens />
        <Login />
      </Box>
      <FirebaseAuth>
        <TwitterLogin />
      </FirebaseAuth>
    </ChakraProvider>
  );
};

export default App;
