import { AuthContext, OysterUser, UserContext } from 'contexts/auth';
import { onAuthStateChanged, UserCredential } from 'firebase/auth';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import findUser from 'services/findUser';
import writeUser from 'services/writeUser';
import { auth, db } from 'utils/firebase';

const FirebaseAuth: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<OysterUser | null>(null);
  const [credential, setCredential] = useState<UserCredential | null>(null);
  // const counterRef = useRef(0);

  // const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
  //   if (firebaseUser) {
  //     if (counterRef.current === 1 && credential) {
  //       const theUser = await writeUser(db, firebaseUser, credential);
  //       setUser(theUser);
  //     } else if (!user) {
  //       const theUser = await findUser(db, firebaseUser.uid);
  //       setUser(theUser);
  //     } else {
  //       setUser(null);
  //     }
  //   }
  // });

  // useEffect(() => {
  //   if (credential) counterRef.current += 1;
  //   return unsubscribe;
  // });

  /* eslint-disable react/jsx-no-constructed-context-values */
  return (
    <AuthContext.Provider value={{ auth, db }}>
      <UserContext.Provider value={{ user, credential, setCredential }}>
        {children}
      </UserContext.Provider>
    </AuthContext.Provider>
  );
};

export default FirebaseAuth;
