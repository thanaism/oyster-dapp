import { useEffect, FC } from 'react';
import { initializeEthereum } from 'utils/metamask';
import { useDispatch, useSelector } from 'react-redux';
import { MetaMaskState } from 'store/metamaskSlice';
import { ChakraProvider } from '@chakra-ui/react';
import { getAuth } from 'firebase/auth';
import { SplitScreen } from 'components/SplitScreen';
import Login from 'components/Login';

const App: FC = () => {
  const dispatch = useDispatch();
  const metamask = useSelector((state: MetaMaskState) => state);

  useEffect(() => {
    void initializeEthereum(dispatch, metamask);
    void getAuth().onAuthStateChanged((user) => {
      if (user) {
        // printUserInfo());
        // disableLogin
      } else {
        // clearUserInfo();
        // disableLogout
      }
    });
  }, [dispatch, metamask]);

  return (
    <ChakraProvider>
      <SplitScreen />
    </ChakraProvider>
  );
};

export default App;
