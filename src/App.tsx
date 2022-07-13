/* eslint-disable react/jsx-no-constructed-context-values */
import { FC, useEffect } from 'react';
import { initializeEthereum } from 'utils/metamask';
import { useDispatch, useSelector } from 'react-redux';
import { metamaskSlice, MetaMaskState } from 'store/metamaskSlice';
import { ChakraProvider } from '@chakra-ui/react';
import { getAuth } from 'firebase/auth';
import { SplitScreen } from 'components/SplitScreen';
import Fonts from 'utils/fonts';

const App: FC = () => {
  const dispatch = useDispatch();
  const metamask = useSelector((state: MetaMaskState) => state);
  const { actions } = metamaskSlice;

  useEffect(() => {
    void initializeEthereum(dispatch, metamask);
    console.log('currentUser', getAuth().currentUser);
    void getAuth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(actions.setUser(user.uid));
      } else {
        // clearUserInfo();
        // disableLogout
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ChakraProvider>
      <Fonts />
      <SplitScreen />
    </ChakraProvider>
  );
};

export default App;
