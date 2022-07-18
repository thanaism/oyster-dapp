import { OAuthCredential } from 'firebase/auth';
import { atom } from 'recoil';

// eslint-disable-next-line import/prefer-default-export
export const twitterCredential = atom<OAuthCredential | undefined>({
  key: 'TwitterCredential',
  default: undefined,
});

export const twitterRedirectDataFetched = atom({
  key: 'TwitterRedirectDataFetched',
  default: false,
});
