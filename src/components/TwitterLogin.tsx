import { Heading } from '@chakra-ui/react';
import { AuthContext, UserContext } from 'contexts/auth';
import {
  AdditionalUserInfo,
  getAdditionalUserInfo,
  TwitterAuthProvider,
  UserCredential,
} from 'firebase/auth';
import { useContext, useState, VFC } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const TwitterLogin: VFC = () => {
  const { auth } = useContext(AuthContext);
  const { credential, setCredential } = useContext(UserContext);
  const [message, setMessage] = useState('');
  // const history = useHistory();
  const [userInfo, setUserInfo] = useState<AdditionalUserInfo | null>(null);

  const uiConfig: firebaseui.auth.Config = {
    // signInFlow: 'redirect',
    signInFlow: 'redirect',
    signInOptions: [
      {
        provider: TwitterAuthProvider.PROVIDER_ID,
        customParameters: { lang: 'ja' },
      },
    ],
    // signInSuccessUrl: '',
    callbacks: {
      signInSuccessWithAuthResult: (authResult) => {
        setMessage('Twitterでログインしました');
        setCredential(authResult as UserCredential);
        const additonalUserInfo = authResult.additionalUserInfo as AdditionalUserInfo;
        setUserInfo(additonalUserInfo);
        console.log(authResult);
        console.log(additonalUserInfo);
        return false;
      },
    },
    // callbacks: {
    //   signInSuccessWithAuthResult: (authResult, redirectUrl) => {
    //     setCredential(authResult as UserCredential);
    //     console.log(redirectUrl);
    //     // const dest = redirectUrl || paths.home;
    //     // history.replace(dest);
    //     return false;
    //   },
    // },
  };

  return (
    <>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
      <Heading>{message}</Heading>
      {JSON.stringify(credential)}
      <Heading>{JSON.stringify(userInfo)}</Heading>
    </>
  );
};

export default TwitterLogin;
