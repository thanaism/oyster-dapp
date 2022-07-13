import { Button, FormControl, FormLabel, Icon, Stack, Textarea } from '@chakra-ui/react';
import { auth } from 'utils/firebase';
import { AuthContext, UserContext } from 'contexts/auth';
import {
  getAuth,
  linkWithPopup,
  linkWithRedirect,
  TwitterAuthProvider,
  unlink,
  UserCredential,
} from 'firebase/auth';
import { useContext, useState, FC, useEffect } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { FaUndo } from 'react-icons/fa';
import { tweet } from 'utils/functions';
import { useSelector } from 'react-redux';
import { MetaMaskState } from 'store/metamaskSlice';
import EmojiPickerPopover from './EmojiPicker';

const TwitterLogin: FC = () => {
  // eslint-disable-next-line no-shadow
  const { auth } = useContext(AuthContext);
  const { credential, setCredential } = useContext(UserContext);
  const [enabled, setEnabled] = useState(true);

  const uiConfig: firebaseui.auth.Config = {
    signInFlow: 'redirect',
    // signInFlow: 'popup',
    signInOptions: [
      {
        provider: TwitterAuthProvider.PROVIDER_ID,
        customParameters: { lang: 'ja' },
      },
    ],
    callbacks: {
      signInSuccessWithAuthResult: (authResult) => {
        setCredential(authResult as UserCredential);
        return false;
      },
    },
  };

  const baseMessage =
    '【牡蠣業界を稼げる憧れの業界にする🦪】\n\n' +
    '牡蠣業界を応援するとKAKIコインがもらえるプロジェクトに参加しました！\n' +
    'https://oyster-773ce.web.app/';
  const hashTags = ['#AbyssCrypto', '#牡蠣若手の会', '#KAKIコイン', '#EatOystersToEarn'];
  // eslint-disable-next-line prefer-template
  const hashTag = () => '\n\n' + hashTags[Math.floor(Math.random() * hashTags.length)];
  const [text, setText] = useState(baseMessage + hashTag());
  const [start, setStart] = useState(0);

  const metamask = useSelector((state: MetaMaskState) => state);

  const requestTweet = async (data: {
    to: string;
    accessToken: string;
    accessSecret: string;
    text: string;
  }) => {
    const { to, accessToken, accessSecret, text } = data;
    const response = await tweet({ to, accessSecret, accessToken, text });
    const { error, hash } = response.data as any;
    if (hash != null) alert('申請が受理されました。しばらくすると残高に反映されます。');
    if (error != null) alert(error);
  };

  useEffect(() => {
    const user = getAuth().currentUser;
    if (user != null) {
      const { providerData } = user;
      console.log('providerData', providerData);
    }
  });
  return (
    <>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
      {/* <Button
        onClick={async () => {
          const provider = new TwitterAuthProvider();
          const user = getAuth().currentUser;
          if (user != null) {
            // const result = await linkWithPopup(user, provider);
            const result = await linkWithRedirect(user, provider);
            console.log(result);
          }
        }}
      >
        link
      </Button>
      <Button
        onClick={async () => {
          const user = getAuth().currentUser;
          if (user != null) {
            await unlink(user, 'twitter.com');
          }
        }}
      >
        unlink
      </Button> */}
      {credential ? (
        <Stack spacing={6}>
          {/* <Text>アカウント：{JSON.stringify((credential as any)?.credential.accessToken)}</Text> */}
          <FormControl>
            <FormLabel>投稿内容</FormLabel>
            <Textarea
              aria-multiline
              minH={'3xs'}
              value={text}
              onInput={(event: any) => {
                setText(event.target.value as string);
                setStart(event.target.selectionStart as number);
              }}
              onClick={(event: any) => setStart(event.target.selectionStart as number)}
            />
          </FormControl>
          <Stack direction={'row-reverse'}>
            <Button
              rounded={'full'}
              bg="blue.400"
              color="white"
              isLoading={!enabled}
              _hover={{ bg: 'blue.500' }}
              onClick={async () => {
                setEnabled(false);
                try {
                  const to = metamask.account!;
                  console.log(JSON.stringify((credential as any).credential));
                  const { accessToken, secret: accessSecret } = (credential as any).credential;
                  await requestTweet({ to, accessToken, accessSecret, text });
                } catch {
                  alert('取得に失敗しました');
                } finally {
                  setEnabled(true);
                }
                // alert(`ツイート処理を実装予定です。\n\n投稿内容：\n${text}`);
                setText(baseMessage + hashTag());
                setStart(0);
              }}
            >
              {/* ツイートしてKAKIコインを獲得！ */}
              ツイートして獲得
            </Button>
            <EmojiPickerPopover
              onEmojiClick={(event, obj) => {
                const leftHand = text.slice(0, start);
                const rightHand = text.slice(start);
                setStart(obj.emoji.length + start);
                setText(leftHand + obj.emoji + rightHand);
              }}
            />
            <Button
              bg="red.400"
              color="white"
              _hover={{ bg: 'red.500' }}
              rounded={'full'}
              onClick={() => {
                setText(baseMessage + hashTag());
                setStart(0);
              }}
            >
              <Icon as={FaUndo} />
            </Button>
          </Stack>
        </Stack>
      ) : (
        ''
      )}
    </>
  );
};

export default TwitterLogin;
