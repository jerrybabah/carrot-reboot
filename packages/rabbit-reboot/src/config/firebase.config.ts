export const firebaseConfig = process.env.NODE_ENV === 'production'
  ? {
    apiKey: 'AIzaSyC9SP0wJBF8hC9rYwdL09qG7n1BsrI0YXs',
    authDomain: 'prod---carrot-reboot.firebaseapp.com',
    projectId: 'prod---carrot-reboot',
    storageBucket: 'prod---carrot-reboot.appspot.com',
    messagingSenderId: '461884176917',
    appId: '1:461884176917:web:4e40b2f8bbf6c8cc042c1c',
    measurementId: 'G-64H8VDWVDL',
  }
  : {
    apiKey: 'AIzaSyC9XTBhpo6ZmZja8DSP80sdkOl0TGQfY5w',
    authDomain: 'dev---carrot-reboot.firebaseapp.com',
    projectId: 'dev---carrot-reboot',
    storageBucket: 'dev---carrot-reboot.appspot.com',
    messagingSenderId: '941598587816',
    appId: '1:941598587816:web:5e7e47cb421dd1bdf63b9d',
    measurementId: 'G-9CXBD0T2EC',
  };

export const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://asia-northeast3-prod---carrot-reboot.cloudfunctions.net/api'
  : 'https://asia-northeast3-dev---carrot-reboot.cloudfunctions.net/api';
