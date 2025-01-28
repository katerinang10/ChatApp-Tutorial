import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';

const getExtra = () => {
  if (Constants.expoConfig) {
    return Constants.expoConfig.extra; 
  } else if (Constants.manifest2?.extra) {
    return Constants.manifest2.extra; 
  }
  throw new Error('Unable to access Expo config. Check app.config.js and environment variables.');
};

const extra = getExtra();

const firebaseConfig = {
  apiKey: extra.apiKey,
  authDomain: extra.authDomain,
  projectId: extra.projectId,
  storageBucket: extra.storageBucket,
  messagingSenderId: extra.messagingSenderId,
  appId: extra.appId,
};

initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getFirestore();
