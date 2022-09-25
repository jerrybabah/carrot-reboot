export const firebaseConfig = process.env.NODE_ENV === 'production'
  ? {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: '',
  }
  : {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: '',
  };

export const API_URL = process.env.NODE_ENV === 'production'
  ? ''
  : '';
