import { Flex, Heading, Image, Stack, Text, useBreakpointValue } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { MetaMaskState } from 'store/metamaskSlice';
import CoinForm from './CoinForm';
import Login from './Login';

export const SplitScreen = () => {
  const metamask = useSelector((state: MetaMaskState) => state);

  return (
    <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
      <Flex p={{ base: 3, md: 8 }} flex={1} align={'center'} justify={'center'}>
        <Stack spacing={6} w={'full'} maxW={'lg'}>
          <Heading fontSize={{ base: '5xl', md: '6xl', lg: '7xl' }}>
            <Text
              as={'span'}
              position={'relative'}
              fontFamily={'Knewave'}
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
            <Text fontFamily={'Knewave'} color={'blue.400'} as={'span'}>
              KAKI Portal
            </Text>{' '}
          </Heading>
          <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'}>
            <Text
              as="a"
              href="https://kakiwakatenokai.myshopify.com/"
              textDecorationLine={'underline'}
              target={'_blank'}
            >
              牡蠣若手の会のECサイト
            </Text>
            から牡蠣を購入された方はKAKIコインを入手できます。さあ、深海に行きましょう！
          </Text>
          {metamask?.user != null ? <CoinForm /> : ''}
          <Login />
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image
          alt={'Login Image'}
          objectFit={'cover'}
          src={
            'https://lh3.googleusercontent.com/ZS0MODDaSKGX5zf7Eg7QDJk9npJcidN7GZDLyaQk8BVJjmHlPMlLe1le5iUEA2OmPOBIQ01c9WO2FSSZYtPEy0f8bIUSXAWPGtRQ=s0'
          }
        />
      </Flex>
    </Stack>
  );
};

export default SplitScreen;
