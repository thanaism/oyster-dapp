import { collection, doc, Firestore, getDoc } from '@firebase/firestore';
import { OysterUser } from 'contexts/auth';

const findUser = async (db: Firestore, id: string) => {
  const userDoc = await getDoc(doc(collection(db, 'users'), id));

  if (userDoc.exists()) {
    const user = userDoc.data() as OysterUser;
    return { ...user, id: userDoc.id };
  }

  return null;
};

export default findUser;
