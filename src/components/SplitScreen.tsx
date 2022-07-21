import { Flex, Heading, Stack, Image, ImageProps, Spinner, Text, Box } from '@chakra-ui/react';
import { metamaskVerifiedAddress } from 'atoms/metamaskState';
import { getAuth } from 'firebase/auth';
import { useMetaMask } from 'hooks/useMetaMask';
import { useRedirectData } from 'hooks/useRedirectData';
import { FC, Suspense, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { CoinForm } from './CoinForm';
import { Login } from './Login';

export const SplitScreen = () => {
  useMetaMask();

  const setUser = useSetRecoilState(metamaskVerifiedAddress);
  useEffect(() => {
    void getAuth().onAuthStateChanged((user) => setUser(user?.uid));
  }, []);

  return (
    <Stack minW="100vw" maxH="100vh" direction="column">
      <Flex
        flex={1}
        minH="40vw"
        bgPos="0% 50%"
        bgRepeat="no-repeat"
        bgSize="100vw"
        bgImg={'url("/logo.png")'}
      >
        <SiteLogo />
      </Flex>
      <Flex p={{ base: 3, md: 8 }} flex={1} align="center" justify="center">
        <Stack spacing={6} w="full" maxW="xl">
          <SiteDescription />
          <Suspense fallback={<LoadingSpinner />}>
            <SuspendedBlock />
          </Suspense>
        </Stack>
      </Flex>
    </Stack>
  );
};

const SuspendedBlock = () => {
  useRedirectData();
  return (
    <>
      <Login />
      <CoinForm />
    </>
  );
};

const LoadingSpinner = () => (
  <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
);

const SiteLogo = () => (
  <Heading
    fontSize={{ base: '4xl', md: '5xl', lg: '7xl' }}
    minH="100%"
    width="100%"
    textAlign="center"
    display="flex"
    flexDirection="column"
    justifyContent="space-between"
  >
    <Box>
      <Text fontFamily="Knewave" color="white" textShadow="2px 2px 2px gray">
        ABYSS CRYPTO
      </Text>
    </Box>
    <Box>
      <Text
        fontFamily="Knewave"
        color="white"
        textShadow="2px 2px 2px gray"
        pos="relative"
        bottom="0.5"
      >
        KAKI Portal
      </Text>
    </Box>
  </Heading>
);

const SiteDescription = () => (
  <Text fontSize={{ base: 'md', lg: 'lg' }}>
    <Text
      as="a"
      href="https://kakiwakatenokai.myshopify.com/"
      textDecorationLine="underline"
      target="_blank"
    >
      牡蠣若手の会のECサイト
    </Text>
    から牡蠣を購入された方はKAKIコインを入手できます。さあ、深海に行きましょう！
  </Text>
);

const SiteImage: FC<ImageProps> = (props) => (
  <Image
    alt="Login Image"
    objectFit="cover"
    src="https://lh3.googleusercontent.com/ZS0MODDaSKGX5zf7Eg7QDJk9npJcidN7GZDLyaQk8BVJjmHlPMlLe1le5iUEA2OmPOBIQ01c9WO2FSSZYtPEy0f8bIUSXAWPGtRQ=s0"
    {...props}
  />
);

export default SplitScreen;
