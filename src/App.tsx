import { FC } from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { SplitScreen } from 'components/SplitScreen';
import { RecoilRoot } from 'recoil';
import Fonts from 'utils/fonts';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        backgroundColor: '#0D204A',
        color: 'gray.100',
      },
    },
  },
});

const App: FC = () => (
  <ChakraProvider theme={theme}>
    <RecoilRoot>
      <Fonts />
      <SplitScreen />
    </RecoilRoot>
  </ChakraProvider>
);

export default App;
