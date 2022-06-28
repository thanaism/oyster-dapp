import { Box, Button } from '@chakra-ui/react';
import { BaseProvider } from '@metamask/providers';
import { BigNumber, ContractInterface, ethers } from 'ethers';
import { Dispatch, SetStateAction, useCallback, useEffect, useState, VFC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MetaMaskState } from 'store/metamaskSlice';
import { ChainIds, displayAccount, hasMetaMask, switchNetwork } from 'utils/metamask';

const kakiBassadorGoldId =
  '43036373961938536366575155881670300754799737399724292781116150638386360615012';
const kakiBassadorSilverId =
  '43036373961938536366575155881670300754799737399724292781116150639485872242788';
const kakiCoinId = '43036373961938536366575155881670300754799737399724292781116150637286848988136';

const OpenSeaERC1155 = {
  // eslint-disable-next-line global-require, @typescript-eslint/no-unsafe-assignment
  abi: require('../abis/OpenSeaERC1155.json'),
  address: '0x2953399124F0cBB46d2CbACD8A89cF0599974963',
  // address: '0x88B48F654c30e99bc2e4A1559b4Dcf1aD93FA656', // thanaism
};

const OysterBasic = {
  // eslint-disable-next-line global-require, @typescript-eslint/no-unsafe-assignment
  wabi: require('../abis/OysterBasic.json'),
  address: '0x3e0d2EAD707cC4972348B7aD5328dc91FA15D5cB',
};

const Tokens: VFC = () => {
  const metamask = useSelector((state: MetaMaskState) => state);

  const [goldBadgeCount, setGoldBadgeCount] = useState(0);
  const [silverBadgeCount, setSilverBadgeCount] = useState(0);
  const [coinCount, setCoinCount] = useState(0);
  const [counterMessage, setCounterMessage] = useState('');
  const [isPolygon, setIsPolygon] = useState(false);

  useEffect(() => {
    const { account, chainId } = metamask;

    if (!hasMetaMask()) {
      setCounterMessage('MetaMask拡張機能をインストールしてください。');
      return;
    }
    const { ethereum } = window as unknown as { ethereum: BaseProvider };
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    if (chainId !== ChainIds.Polygon) {
      setCounterMessage('MetaMakのネットワークがPolygonに設定されていません。');
      return;
    }

    setIsPolygon(true);

    const fetchCount = async (id: string, setter: Dispatch<SetStateAction<number>>) => {
      const erc1155 = new ethers.Contract(
        OpenSeaERC1155.address,
        OpenSeaERC1155.abi as ContractInterface,
        signer,
      );
      try {
        const result = (await erc1155.functions.balanceOf(
          account,
          ethers.BigNumber.from(id),
        )) as Array<BigNumber>;
        console.log(result[0]);
        setter(result[0].toNumber());
      } catch (e) {
        console.error('fetchInfo', e);
      }
    };
    void fetchCount(kakiBassadorGoldId, setGoldBadgeCount);
    void fetchCount(kakiBassadorSilverId, setSilverBadgeCount);
    void fetchCount(kakiCoinId, setCoinCount);
    setCounterMessage('');
  }, [metamask]);

  const itemId0 = ethers.BigNumber.from(
    '43036373961938536366575155881670300754799737399724292781116150475658639704065',
    // '27617059322859042104612081057486012670924659893551643239560313328606004641793', // thanaism
  );
  const itemId1 = ethers.BigNumber.from(
    '43036373961938536366575155881670300754799737399724292781116150476758151331841',
    // '27617059322859042104612081057486012670924659893551643239560313329705516269569', // thanaism
  );
  const delta = itemId1.sub(itemId0).add(ethers.BigNumber.from(0));
  const itemCount = 143;
  const itemIds = [...Array(itemCount).keys()].map((value) =>
    itemId0.add(ethers.BigNumber.from(delta.mul(value))),
  );
  // console.log(JSON.stringify(itemIds));

  const [abyssCryptoCount, setAbyssCryptoCount] = useState(0);
  const [oysterBasicCount, setOysterBasicCount] = useState(0);

  const tokenGate = useCallback(() => {
    const { account, chainId } = metamask;
    if (!hasMetaMask()) {
      return 'pleaseInstall';
    }
    const { ethereum } = window as unknown as { ethereum: BaseProvider };
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    console.log('** recomputing', displayAccount(metamask) || 'N/A', chainId);

    if (!account) return 'pleaseConnect';

    if (chainId === ChainIds.RinkebyTestNet) {
      const fetchOysterBasic = async () => {
        const oysterBasic = new ethers.Contract(
          OysterBasic.address,
          (OysterBasic.wabi as { abi: ContractInterface }).abi,
          signer,
        );
        const result = (await oysterBasic.functions.balanceOf(account)) as Array<BigNumber>;
        setOysterBasicCount(result[0].toNumber());
      };
      void fetchOysterBasic();
      return 'active';
    }

    if (chainId !== ChainIds.Polygon) {
      return 'switchNetwork';
    }

    if (chainId !== ChainIds.Polygon) return 'switchNetwork';

    const fetchAbyssCrypto = async () => {
      const abyssCrypto = new ethers.Contract(
        OpenSeaERC1155.address,
        OpenSeaERC1155.abi as ContractInterface,
        signer,
      );
      const accounts = itemIds.map(() => account);
      try {
        const results = (await abyssCrypto.functions.balanceOfBatch(accounts, itemIds)) as Array<
          Array<ethers.BigNumber>
        >;
        const count = results[0].reduce(
          (total, result) => total.add(result),
          ethers.BigNumber.from(0),
        );
        setAbyssCryptoCount(count.toNumber());
      } catch (e) {
        console.error('fetchInfo', e);
      }
    };
    void fetchAbyssCrypto();
    return 'active';
  }, [itemIds, metamask]);

  const dispatch = useDispatch();

  const switchToPolygon = async () => {
    console.log('switchToPolygon called');
    await switchNetwork(ChainIds.Polygon, dispatch);
  };

  // switch (tokenGate()) {
  //   case 'switchNetwork':
  //     return <Button onClick={switchToPolygon}>switchToPolygon</Button>;
  //   case 'active':
  //     return (
  //       <>
  //         {abyssCryptoCount > 0
  //           ? `You have NFTs: ${abyssCryptoCount}`
  //           : `You don't have AbyssCrypto NFTs :(`}
  //         {oysterBasicCount > 0 ? `OysterBasicCount: ${oysterBasicCount}` : ''}
  //       </>
  //     );
  //   default:
  //     return <>{tokenGate()}</>;
  // }
  return (
    <>
      {counterMessage === '' ? (
        <>
          ・牡蠣バサダーゴールドバッジ保有数：{goldBadgeCount}
          <br />
          ・牡蠣バサダーシルバーバッジ保有数：{silverBadgeCount}
          <br />
          ・牡蠣コイン保有数：{coinCount}
          <br />
        </>
      ) : (
        ''
      )}
      {!isPolygon ? (
        <>
          {counterMessage}
          <br />
          <Button onClick={switchToPolygon}>Polygonネットワークに切替</Button>
        </>
      ) : (
        <Box>{counterMessage}</Box>
      )}
    </>
  );
};

export default Tokens;
