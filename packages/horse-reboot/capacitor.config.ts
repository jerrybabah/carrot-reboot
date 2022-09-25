/* eslint-disable import/no-mutable-exports */
import { CapacitorConfig } from '@capacitor/cli';

let config: CapacitorConfig;

/**
 * production 환경
 */
if (process.env.NODE_ENV === 'production') {
  config = {
    appId: 'com.horse.reboot.app',
    appName: '김프로 - 구인자용',
    webDir: 'dist',
    bundledWebRuntime: false,
    plugins: {
      PushNotifications: {
        presentationOptions: ['badge', 'sound', 'alert'],
      },
    },
  };
/**
 * development 환경
 */
} else {
  config = {
    appId: 'com.horse.reboot.dev.app',
    appName: 'horse reboot',
    webDir: 'dist',
    bundledWebRuntime: false,
    android: {
      path: 'android.dev',
      includePlugins: [
        '@capacitor-community/firebase-analytics',
        '@capacitor/app',
        '@capacitor/haptics',
        '@capacitor/keyboard',
        '@capacitor/push-notifications',
        // 'cordova-plugin-facebook-connect',
        'cordova-plugin-ionic',
      ],
    },
    ios: {
      path: 'ios.dev',
      includePlugins: [
        '@capacitor-community/firebase-analytics',
        '@capacitor/app',
        '@capacitor/haptics',
        '@capacitor/keyboard',
        '@capacitor/push-notifications',
        // 'cordova-plugin-facebook-connect',
        'cordova-plugin-ionic',
      ],
    },
    plugins: {
      PushNotifications: {
        presentationOptions: ['badge', 'sound', 'alert'],
      },
    },
  };
}

export default config;
