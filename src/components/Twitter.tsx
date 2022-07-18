import { Button, Center, FormControl, FormLabel, Icon, Stack, Textarea } from '@chakra-ui/react';
import {
  getAuth,
  getRedirectResult,
  linkWithPopup,
  signInWithRedirect,
  TwitterAuthProvider,
  unlink,
} from 'firebase/auth';
import { useState, FC, useEffect } from 'react';
import { FaUndo } from 'react-icons/fa';
import { tweet } from 'utils/functions';
import { useRecoilState, useRecoilValue } from 'recoil';
import { twitterCredential } from 'atoms/twitterState';
import { IEmojiData } from 'emoji-picker-react';
import { metamaskAddress } from 'atoms/metamaskState';
import { BlueButton, RedButton } from './Buttons';
import EmojiPickerPopover from './EmojiPicker';

export const TweetToEarn: FC = () => <TwitterLogin />;

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

const TwitterLogin: FC = () => {
  const account = useRecoilValue(metamaskAddress);
  const [credential, setCredential] = useRecoilState(twitterCredential);
  const [enabled, setEnabled] = useState(true);

  const baseMessage =
    '【牡蠣業界を稼げる憧れの業界にする🦪】\n\n' +
    '牡蠣業界を応援するとKAKIコインがもらえるプロジェクトに参加しました！\n' +
    'https://oyster-773ce.web.app/';
  const hashTags = ['#AbyssCrypto', '#牡蠣若手の会', '#KAKIコイン', '#EatOystersToEarn'];

  const hashTag = () => `\n\n${hashTags[Math.floor(Math.random() * hashTags.length)]}`;
  const [text, setText] = useState(baseMessage + hashTag());
  const [start, setStart] = useState(0);

  useEffect(() => {
    const auth = getAuth();
    void getRedirectResult(auth)
      .then((result) => {
        if (result == null) return;
        const credential = TwitterAuthProvider.credentialFromResult(result);
        if (credential == null) return;
        console.log('credential:', credential);
        setCredential(credential);
      })
      .catch((error) => {
        console.log('error', error);
        setCredential(undefined);
      });
  });

  const submit = async () => {
    setEnabled(false);
    try {
      const to = account!;
      const accessToken = credential!.accessToken!;
      const accessSecret = credential!.secret!;
      await requestTweet({ to, accessToken, accessSecret, text });
    } catch {
      alert('取得に失敗しました');
    } finally {
      setEnabled(true);
    }
    setText(baseMessage + hashTag());
    setStart(0);
  };

  const putEmoji = (event: React.MouseEvent<Element, MouseEvent>, data: IEmojiData) => {
    const leftHand = text.slice(0, start);
    const rightHand = text.slice(start);
    setStart(data.emoji.length + start);
    setText(leftHand + data.emoji + rightHand);
  };

  return (
    <>
      {credential == null ? <TwitterSignInButton /> : null}
      {credential ? (
        <Stack spacing={6}>
          <FormControl>
            <FormLabel>投稿内容</FormLabel>
            <Textarea
              aria-multiline
              minH="3xs"
              value={text}
              onInput={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                if (event != null) {
                  setText(event.target.value);
                  setStart(event.target.selectionStart);
                }
              }}
              onClick={(event: any) => setStart(event.target.selectionStart as number)}
            />
          </FormControl>
          <Stack direction="row-reverse">
            <BlueButton isLoading={!enabled} onClick={submit}>
              ツイートして獲得
            </BlueButton>
            <EmojiPickerPopover onEmojiClick={putEmoji} />
            <RedButton
              onClick={() => {
                setText(baseMessage + hashTag());
                setStart(0);
              }}
            >
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
