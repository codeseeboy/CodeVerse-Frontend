import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { CodeSnippet, User } from '../types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    return {
      id: user.uid,
      email: user.email!,
      displayName: user.displayName!,
      photoURL: user.photoURL || undefined,
    } as User;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const signOut = () => firebaseSignOut(auth);

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (user: FirebaseUser | null) => {
    if (user) {
      callback({
        id: user.uid,
        email: user.email!,
        displayName: user.displayName!,
        photoURL: user.photoURL || undefined,
      });
    } else {
      callback(null);
    }
  });
};

export const saveCodeSnippet = async (snippet: Omit<CodeSnippet, 'id' | 'createdAt' | 'updatedAt'>) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be authenticated to save code');

  const snippetRef = doc(collection(db, 'snippets'));
  const now = Timestamp.now();

  const newSnippet: CodeSnippet = {
    ...snippet,
    id: snippetRef.id,
    userId: user.uid,
    createdAt: now.toDate(),
    updatedAt: now.toDate(),
  };

  await setDoc(snippetRef, newSnippet);
  return newSnippet;
};

export const getCodeSnippet = async (id: string) => {
  const snippetRef = doc(db, 'snippets', id);
  const snippetDoc = await getDoc(snippetRef);
  
  if (!snippetDoc.exists()) {
    throw new Error('Code snippet not found');
  }

  return snippetDoc.data() as CodeSnippet;
};

export const getUserSnippets = async (userId: string) => {
  const snippetsRef = collection(db, 'snippets');
  const q = query(
    snippetsRef,
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc'),
    limit(50)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as CodeSnippet);
};

export const getPublicSnippets = async () => {
  const snippetsRef = collection(db, 'snippets');
  const q = query(
    snippetsRef,
    where('isPublic', '==', true),
    orderBy('updatedAt', 'desc'),
    limit(50)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as CodeSnippet);
}; 