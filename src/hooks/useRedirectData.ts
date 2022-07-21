import {
  twitterCredential,
  twitterDisplayName,
  twitterRedirectDataFetched,
  twitterUsername,
} from 'atoms/twitterState';
import { getAdditionalUserInfo, getRedirectResult, TwitterAuthProvider } from 'firebase/auth';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { auth } from 'utils/firebase';

export const useRedirectData = () => {
  const [fetched, setFetched] = useRecoilState(twitterRedirectDataFetched);
  const setCredential = useSetRecoilState(twitterCredential);
  const setUsername = useSetRecoilState(twitterUsername);
  const setDisplayName = useSetRecoilState(twitterDisplayName);

  if (!fetched) {
    throw getRedirectResult(auth)
      .then((result) => {
        if (result == null) return;
        console.log('result:', result);
        const credential = TwitterAuthProvider.credentialFromResult(result);
        if (credential == null) return;
        console.log('credential:', credential);
        setCredential(credential);
        const { displayName } = result.user;
        if (displayName == null) return;
        setDisplayName(displayName);
        const userInfo = getAdditionalUserInfo(result);
        if (userInfo == null) return;
        const { username } = userInfo;
        if (username == null) return;
        setUsername(username);
      })
      .catch((error) => {
        console.log('error:', error);
      })
      .finally(() => setFetched(true));
  }
};
