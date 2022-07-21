import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Icon,
  Stack,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import {
  getAuth,
  linkWithPopup,
  signInWithRedirect,
  TwitterAuthProvider,
  unlink,
} from 'firebase/auth';
import React, { FC, useState } from 'react';
import { FaUndo } from 'react-icons/fa';
import { tweet } from 'utils/functions';
import { useRecoilValue } from 'recoil';
import { twitterCredential, twitterDisplayName, twitterUsername } from 'atoms/twitterState';
import { IEmojiData } from 'emoji-picker-react';
import { metamaskAddress } from 'atoms/metamaskState';
import { baseUrl } from 'config/params';
import { BlueButton, RedButton } from './Buttons';
import EmojiPickerPopover from './EmojiPicker';

export const TweetToEarn: FC = () => <TwitterLogin />;

const requestTweet = async (data: {
  to: string;
  accessToken: string;
  secret: string;
  text: string;
}) => {
  const { to, text, accessToken, secret } = data;
  const response = await tweet({ to, text, accessToken, accessSecret: secret });
  const { error, hash } = response.data as { error?: string; hash?: string };
  return { error, hash };
};

const getDefaultTweetMessage = () => {
  const baseMessage =
    '【牡蠣業界を稼げる憧れの業界にする🦪】\n\n' +
    '牡蠣業界を応援するとKAKIコインがもらえるプロジェクトに参加しました！\n' +
    'https://oyster-773ce.web.app/';
  const hashTags = ['#AbyssCrypto', '#牡蠣若手の会', '#KAKIコイン', '#EatOystersToEarn'];
  const hashTag = () => `\n\n${hashTags[Math.floor(Math.random() * hashTags.length)]}`;
  return baseMessage + hashTag();
};

const charCount = (str: string) =>
  // eslint-disable-next-line no-bitwise
  Array.from(str).reduce((s, c) => (c.match(/[ -~]/) ? s + 0.5 : s + 1), 0) | 0;

const TwitterLogin: FC = () => {
  const account = useRecoilValue(metamaskAddress);
  const credential = useRecoilValue(twitterCredential);
  const username = useRecoilValue(twitterUsername);
  const displayName = useRecoilValue(twitterDisplayName);
  const [enabled, setEnabled] = useState(true);

  const [text, setText] = useState(getDefaultTweetMessage());
  const [start, setStart] = useState(0);
  const [length, setLength] = useState(charCount(getDefaultTweetMessage()));

  const toast = useToast();

  const submit = async () => {
    setEnabled(false);
    try {
      if (account == null) throw Error;
      const to = account;
      if (credential == null) throw Error;
      const { accessToken, secret } = credential;
      if (accessToken == null || secret == null) throw Error;
      const { hash, error } = await requestTweet({ to, accessToken, secret, text });
      if (hash == null && error != null)
        toast({
          title: '取得に失敗しました',
          description: error,
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      if (error == null && hash != null)
        toast({
          title: '申請が受理されました',
          description: (
            <>
              <Text>しばらくすると残高に反映されます。</Text>
              <Text
                as="a"
                href={`${baseUrl}${hash}`}
                target="_blank"
                textDecorationLine="underline"
              >
                トランザクション詳細を見る
              </Text>
            </>
          ),
          status: 'success',
          // duration: 9000,
          isClosable: true,
        });
    } catch {
      toast({
        title: '取得に失敗しました',
        description: 'インターネット接続を確認してください。',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setEnabled(true);
    }
    setText(getDefaultTweetMessage());
    setStart(0);
  };

  const putEmoji = (event: React.MouseEvent<Element, MouseEvent>, data: IEmojiData) => {
    const leftHand = text.slice(0, start);
    const rightHand = text.slice(start);
    setStart(data.emoji.length + start);
    setText(leftHand + data.emoji + rightHand);
  };

  const reset = () => {
    setText(getDefaultTweetMessage());
    setStart(0);
  };

  return (
    <>
      {credential == null ? <TwitterSignInButton /> : null}
      {credential ? (
        <Stack spacing={6}>
          <Text>
            アカウント：{displayName}（@{username}）
          </Text>
          <FormControl>
            <FormLabel>投稿内容（文字数：{length}）</FormLabel>
            <Textarea
              aria-multiline
              minH="3xs"
              value={text}
              onInput={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                setText(event.target.value);
                setLength(charCount(event.target.value));
              }}
              onSelect={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                setStart(event.target.selectionStart)
              }
            />
          </FormControl>
          <Stack direction="row-reverse">
            <BlueButton isLoading={!enabled} onClick={submit} disabled={length > 140}>
              ツイートして獲得
            </BlueButton>
            <EmojiPickerPopover onEmojiClick={putEmoji} />
            <RedButton onClick={reset}>
              <Icon as={FaUndo} />
            </RedButton>
          </Stack>
        </Stack>
      ) : (
        ''
      )}
    </>
  );
};

const TwitterSignInButton = () => (
  <Center marginTop="4">
    <BlueButton
      size="lg"
      onClick={async () => {
        const auth = getAuth();
        const provider = new TwitterAuthProvider();
        await signInWithRedirect(auth, provider);
      }}
    >
      Sign in with Twitter
    </BlueButton>
  </Center>
);

const LinkWithPopupButton = () => (
  <Button
    onClick={async () => {
      const provider = new TwitterAuthProvider();
      const user = getAuth().currentUser;
      if (user != null) {
        const result = await linkWithPopup(user, provider);
        console.log(result);
      }
    }}
  >
    link
  </Button>
);

const UnlinkButton = () => (
  <Button
    onClick={async () => {
      const user = getAuth().currentUser;
      if (user != null) {
        await unlink(user, 'twitter.com');
        console.log('unlink succeded');
      }
    }}
  >
    unlink
  </Button>
);

export default TwitterLogin;
