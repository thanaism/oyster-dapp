import { twitterCredential, twitterRedirectDataFetched } from 'atoms/twitterState';
import { getRedirectResult, TwitterAuthProvider } from 'firebase/auth';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { auth } from 'utils/firebase';

export const useRedirectData = () => {
  const [fetched, setFetched] = useRecoilState(twitterRedirectDataFetched);
  const setCredential = useSetRecoilState(twitterCredential);

  if (!fetched) {
    throw getRedirectResult(auth)
      .then((result) => {
        if (result == null) return;
        const credential = TwitterAuthProvider.credentialFromResult(result);
        if (credential == null) return;
        console.log('credential:', credential);
        setCredential(credential);
      })
      .catch((error) => {
        console.log('error:', error);
      })
      .finally(() => setFetched(true));
  }
};
