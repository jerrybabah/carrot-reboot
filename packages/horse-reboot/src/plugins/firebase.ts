import { Capacitor } from '@capacitor/core';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';
// import 'firebase/analytics';
// import 'firebase/remote-config';
import { firebaseConfig } from '../config';

firebase.initializeApp(firebaseConfig);

if (!Capacitor.isNativePlatform()) {
  FirebaseAnalytics.initializeFirebase(firebaseConfig);
}

// const remoteConfig = firebase.remoteConfig();

// remoteConfig.settings = {
//   minimumFetchIntervalMillis: 0,
//   fetchTimeoutMillis: 60000,
// };
// remoteConfig.fetchAndActivate().then(() => console.log('remote config init completed'));
