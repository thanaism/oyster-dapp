import { FC } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { SplitScreen } from 'components/SplitScreen';
import { RecoilRoot } from 'recoil';
import Fonts from 'utils/fonts';

const App: FC = () => (
  <ChakraProvider>
    <RecoilRoot>
      <Fonts />
      <SplitScreen />
    </RecoilRoot>
  </ChakraProvider>
);

export default App;
