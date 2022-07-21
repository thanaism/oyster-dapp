import { OAuthCredential } from 'firebase/auth';
import { atom } from 'recoil';

export const twitterCredential = atom<OAuthCredential | undefined>({
  key: 'TwitterCredential',
  default: undefined,
});

export const twitterRedirectDataFetched = atom({
  key: 'TwitterRedirectDataFetched',
  default: false,
});

export const twitterUsername = atom<string>({
  key: 'TwitterUsername',
  default: undefined,
});

export const twitterDisplayName = atom<string>({
  key: 'TwitterDisplayName',
  default: undefined,
});
