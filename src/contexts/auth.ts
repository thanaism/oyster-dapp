import { Auth, UserCredential } from 'firebase/auth';
import { createContext } from 'react';
import { Firestore, Timestamp } from 'firebase/firestore';

type AuthContextValue = {
  auth: Auth | null;
  db: Firestore | null;
};

export const AuthContext = createContext<AuthContextValue>({
  auth: null,
  db: null,
});

export type OysterUser = {
  id?: string;
  screenName: string;
  displayName: string | null;
  description: string | null;
  photoUrl: string | null;
  provider: string;
  providerUid: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
};

type UserContextValue = {
  user: OysterUser | null;
  credential: UserCredential | null;
  setCredential: (credential: UserCredential | null) => void;
};

export const UserContext = createContext<UserContextValue>({
  user: null,
  credential: null,
  setCredential: () => undefined,
});

export const blankUser: OysterUser = {
  screenName: '',
  displayName: null,
  description: null,
  photoUrl: null,
  provider: 'twitter',
  providerUid: '',
  createdAt: null,
  updatedAt: null,
};
