/* eslint-disable react/jsx-no-constructed-context-values */
import { useEffect, FC, useState } from 'react';
import { initializeEthereum } from 'utils/metamask';
import { useDispatch, useSelector } from 'react-redux';
import { MetaMaskState } from 'store/metamaskSlice';
import { ChakraProvider, Text } from '@chakra-ui/react';
import { getAuth } from 'firebase/auth';
import { SplitScreen } from 'components/SplitScreen';
import TwitterLogin from 'components/TwitterLogin';
import FirebaseAuth from 'components/FirebaseAuth';
import EmojiPickerPopover from 'components/EmojiPicker';
import Fonts from 'utils/fonts';

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
      <Fonts />
      <SplitScreen />
    </ChakraProvider>
  );
};

export default App;
