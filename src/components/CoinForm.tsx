import {
  FormControl,
  FormLabel,
  Icon,
  Input,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { metamaskAddress, metamaskChainId, metamaskVerifiedAddress } from 'atoms/metamaskState';
import { BsTwitter } from 'react-icons/bs';
import { FaShopify } from 'react-icons/fa';
import { FcIdea } from 'react-icons/fc';
import { FC, useState } from 'react';
import { transfer } from 'utils/functions';
import { ChainIds } from 'utils/metamask';
import { TweetToEarn } from './Twitter';
import { BlueButton } from './Buttons';

export const CoinForm: FC = () => {
  const user = useRecoilValue(metamaskVerifiedAddress);
  if (user != null)
    return (
      <>
        <Stack
          w="full"
          maxW="lg"
          // eslint-disable-next-line react-hooks/rules-of-hooks
          // bg={useColorModeValue('white', 'gray.700')}
          rounded={{ base: 'none', md: 'xl' }}
          boxShadow={{ base: 'none', md: 'lg' }}
          p={{ base: 0, md: 6 }}
          my={12}
        >
          <Tabs>
            <TabList>
              <Tab>
                <Icon as={BsTwitter} mr="1" />
                ツイートでコイン獲得
              </Tab>
              <Tab>
                <Icon as={FaShopify} mr="1" />
                牡蠣購入でコイン獲得
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <TweetToEarn />
              </TabPanel>
              <TabPanel>
                <EatToEarn />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
        <AnnotaionsOutsideForm />
      </>
    );
  return null;
};

const AnnotaionsOutsideForm: FC = () => {
  const chainId = useRecoilValue(metamaskChainId);
  if (chainId !== ChainIds.MumbaiTestNet) return <MumbaiDescription />;
  return <KakiCoinDescription />;
};

const MumbaiDescription: FC = () => (
  <>
    {/* <Text fontSize={{ base: 'sm', lg: 'sm' }} color="gray.400">
      現在、KAKIコインはテスト版としてMumbaiネットワークで運用されています。
      MumbaiはPolygon準拠のテスト用ネットワークで利用に一切の費用はかかりません。
    </Text> */}
    <Text fontSize={{ base: 'sm', lg: 'sm' }} color="gray.400">
      <Icon as={FcIdea} /> MetaMaskでMumbaiを利用するには「Mumbaiに切り替え」します。
    </Text>
  </>
);

const KakiCoinDescription: FC = () => (
  <Text fontSize={{ base: 'sm', lg: 'sm' }} color="gray.400">
    <Icon as={FcIdea} />
    MetaMask上でコインの枚数を確認するには「KAKIコインを設定」します。
  </Text>
);

const requestTransfer = async (to: string, amount: string, phone: string, order: string) => {
  const response = await transfer({ to, amount, phone, order });
  const { error, hash } = response.data as any;
  if (hash != null) alert('申請が受理されました。しばらくすると残高に反映されます。');
  if (error != null) alert(error);
};

const EatToEarn: FC = () => {
  const account = useRecoilValue(metamaskAddress);
  const [enabled, setEnabled] = useState(true);
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState('');

  const submit = async () => {
    setEnabled(false);
    try {
      await requestTransfer(account!, '5', phone, order);
    } catch {
      alert('取得に失敗しました');
    } finally {
      setEnabled(true);
    }
  };

  return (
    <Stack spacing={6}>
      <Text>牡蠣若手の会ECサイトで牡蠣や加工品を購入いただいた方が申請できます！</Text>
      <FormControl id="order" isRequired>
        <FormLabel>注文番号（4ケタ）</FormLabel>
        <Input
          placeholder="0000"
          _placeholder={{ color: 'gray.500' }}
          type="number"
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
          onChange={(event: any) => setOrder(event.currentTarget.value)}
        />
      </FormControl>
      <FormControl id="tel" isRequired>
        <FormLabel>注文時に入力した電話番号</FormLabel>
        <Input
          placeholder="09012345678"
          type="tel"
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
          onChange={(event: any) => setPhone(event.currentTarget.value)}
        />
      </FormControl>
      <BlueButton isLoading={!enabled} onClick={submit}>
        KAKIコイン（Beta版）を申請
      </BlueButton>
      <Text fontSize={{ base: 'sm', lg: 'sm' }} color="gray.400">
        ※2022/5/8以前にご注文の方はシステム未対応のため、
        <Text as="a" href="https://twitter.com/naokichipocket" textDecorationLine="underline">
          なおきち
        </Text>
        までウォレットアドレスを直接ご連絡ください。
      </Text>
    </Stack>
  );
};

export default CoinForm;
