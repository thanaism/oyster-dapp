import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { MetaMaskState } from 'store/metamaskSlice';
import { transfer } from 'utils/functions';
import { ChainIds } from 'utils/metamask';

export const CoinForm: FC = () => {
  const [enabled, setEnabled] = useState(true);
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState('');
  const metamask = useSelector((state: MetaMaskState) => state);

  const requestTransfer = async (to: string, amount: string, phone: string, order: string) => {
    const response = await transfer({ to, amount, phone, order });
    const { error, hash } = response.data as any;
    if (hash != null) alert('申請が受理されました。しばらくすると残高に反映されます。');
    if (error != null) alert(error);
  };

  return (
    <>
      <Stack
        // spacing={4}
        w="full"
        maxW="lg"
        bg={useColorModeValue('white', 'gray.700')}
        rounded="xl"
        boxShadow="lg"
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
          牡蠣の購入者はこちら
        </Heading>
        <FormControl id="order" isRequired>
          <FormLabel>注文番号（4ケタ）</FormLabel>
          <Input
            placeholder="0000"
            _placeholder={{ color: 'gray.500' }}
            type="number"
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            onChange={(event: any) => setOrder(event.currentTarget.value)}
          />
        </FormControl>
        <FormControl id="tel" isRequired>
          <FormLabel>注文時に入力した電話番号</FormLabel>
          <Input
            placeholder="09012345678"
            type="tel"
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            onChange={(event: any) => setPhone(event.currentTarget.value)}
          />
        </FormControl>
        <Stack spacing={6}>
          <Button
            rounded={'full'}
            bg="blue.400"
            color="white"
            _hover={{
              bg: 'blue.500',
            }}
            isLoading={!enabled}
            onClick={async () => {
              setEnabled(false);
              try {
                await requestTransfer(metamask?.account as string, '5', phone, order);
              } catch {
                alert('取得に失敗しました');
              } finally {
                setEnabled(true);
              }
            }}
          >
            牡蠣コイン（テスト版）を申請
          </Button>
          <Text fontSize={{ base: 'sm', lg: 'sm' }} color={'gray.400'}>
            ※2022/5/8以前にご注文の方はシステム未対応のため、
            <Text as="a" href="https://twitter.com/naokichipocket" textDecorationLine={'underline'}>
              なおきち
            </Text>
            までウォレットアドレスを直接ご連絡ください。
          </Text>
        </Stack>
      </Stack>
      {metamask?.chainId !== ChainIds.MumbaiTestNet ? (
        <>
          <Text fontSize={{ base: 'sm', lg: 'sm' }} color={'gray.400'}>
            <Text>現在、牡蠣コインはテスト版としてMumbaiネットワークで運用されています。</Text>
            <Text>MumbaiはPolygon準拠のテスト用ネットワークで利用に一切の費用はかかりません。</Text>
          </Text>
          <Text fontSize={{ base: 'sm', lg: 'sm' }} color={'gray.400'}>
            💡MetaMaskでMumbaiを利用するには「Mumbaiに切り替え」します。
          </Text>
        </>
      ) : (
        <Text fontSize={{ base: 'sm', lg: 'sm' }} color={'gray.400'}>
          💡MetaMask上でコインの枚数を確認するには「牡蠣コインを設定」します。
        </Text>
      )}
    </>
  );
};

export default CoinForm;
