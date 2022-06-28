import { getAdditionalUserInfo, User, UserCredential } from 'firebase/auth';
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import { blankUser, OysterUser } from 'contexts/auth';

const addRandomSuffix = (username: string) => {
  const rndInt = Math.floor(Math.random() * 10000);
  const suffix = `0000${rndInt}`.slice(-4);
  return `${username}${suffix}`;
};

const writeUser = async (db: Firestore, firebaseUser: User, credential: UserCredential) => {
  const { uid: id, displayName, photoURL: photoUrl } = firebaseUser;

  const additionalUserInfo = getAdditionalUserInfo(credential);
  if (!additionalUserInfo) throw new Error('Invalid credential information.');

  const { username, profile } = additionalUserInfo;
  if (!username || !profile) throw new Error('Invalid credential information.');

  const description = (profile as { description: string }).description || '';
  const providerUid = (profile as { id_str: string }).id_str;
  if (!providerUid) throw new Error('Invalid credential information.');

  // resolve screenname duplication
  const usersRef = collection(db, 'users');
  const querySnapshot = await getDocs(query(usersRef, where('screenName', '==', username)));

  const screenName = querySnapshot.size ? addRandomSuffix(username) : username;

  let theUser: OysterUser | null = null;
  const batch = writeBatch(db);
  const userDoc = await getDoc(doc(usersRef, id));

  if (userDoc.exists()) {
    const user = userDoc.data() as OysterUser;
    const diff: Partial<OysterUser> = {};
    if (user.description !== description) diff.description = description;
    if (user.displayName !== displayName) diff.displayName = displayName;
    if (user.photoUrl !== photoUrl) diff.photoUrl = photoUrl;

    if (!Object.keys(diff).length) {
      batch.update(userDoc.ref, {
        ...diff,
        updatedAt: serverTimestamp(),
      });
    }
    theUser = { ...diff, ...user, id: userDoc.id };
  } else {
    const user: OysterUser = {
      ...blankUser,
      providerUid,
      screenName,
      displayName,
      description,
      photoUrl,
    };
    batch.set(userDoc.ref, {
      ...user,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    theUser = { ...user, id: userDoc.id };

    // const counterDocRef = doc(db, 'docCounters', 'users');
    // batch.set(
    //   counterDocRef,
    //   {
    //     count: increment(1),
    //     updatedAt: serverTimestamp(),
    //   },
    //   { merge: true },
    // );
  }
  await batch.commit();

  return theUser;
};

export default writeUser;
