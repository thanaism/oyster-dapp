import { Flex, Heading, Image, Spinner, Stack, Text, useBreakpointValue } from '@chakra-ui/react';
import { metamaskVerifiedAddress } from 'atoms/metamaskState';
import { getAuth } from 'firebase/auth';
import { useMetaMask } from 'hooks/useMetaMask';
import { useRedirectData } from 'hooks/useRedirectData';
import { Suspense, useEffect } from 'react';
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
    <Stack minH="100vh" direction={{ base: 'column', md: 'row' }}>
      <Flex p={{ base: 3, md: 8 }} flex={1} align="center" justify="center">
        <Stack spacing={6} w="full" maxW="lg">
          <SiteLogo />
          <SiteDescription />
          <Suspense fallback={<LoadingSpinner />}>
            <SuspendedBlock />
          </Suspense>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <SiteImage />
      </Flex>
    </Stack>
  );
};

const SuspendedBlock = () => {
  useRedirectData();
  return (
    <>
      <CoinForm />
      <Login />
    </>
  );
};

const LoadingSpinner = () => (
  <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
);

const SiteLogo = () => (
  <Heading fontSize={{ base: '5xl', md: '6xl', lg: '7xl' }}>
    <Text
      as="span"
      position="relative"
      fontFamily="Knewave"
      _after={{
        content: "''",
        width: 'full',
        height: useBreakpointValue({ base: '20%', md: '30%' }),
        position: 'absolute',
        bottom: 1,
        left: 0,
        bg: 'blue.400',
        zIndex: -1,
      }}
    >
      ABYSS CRYPTO
    </Text>
    <br />{' '}
    <Text fontFamily="Knewave" color="blue.400" as="span">
      KAKI Portal
    </Text>{' '}
  </Heading>
);

const SiteDescription = () => (
  <Text fontSize={{ base: 'md', lg: 'lg' }} color="gray.500">
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

const SiteImage = () => (
  <Image
    alt="Login Image"
    objectFit="cover"
    src="https://lh3.googleusercontent.com/ZS0MODDaSKGX5zf7Eg7QDJk9npJcidN7GZDLyaQk8BVJjmHlPMlLe1le5iUEA2OmPOBIQ01c9WO2FSSZYtPEy0f8bIUSXAWPGtRQ=s0"
  />
);
export default SplitScreen;
