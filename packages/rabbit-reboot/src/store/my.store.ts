import { defineStore } from 'pinia';
import firebase from 'firebase/app';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

import { Worker, updateWorkerRegistrationToken } from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { getLocallyLoggedInWorker, loginLocally, getRegistrationToken } from '../utils';

export type MyState = {
  currentUser: Worker | null,
  isLoggingIn: boolean,
  isAutoLoggingIn: boolean,
  isLoggingOut: boolean,
}

export const useMyStore = defineStore({
  id: 'my',

  state: (): MyState => ({
    currentUser: null,

    isLoggingIn: false,

    isAutoLoggingIn: false,

    isLoggingOut: false,
  }),

  getters: {
    isLoggedIn(): boolean {
      return this.currentUser !== null;
    },
  },

  actions: {
    async login(token: string) {
      this.$patch({
        isLoggingIn: true,
      });

      const worker = await loginLocally(token);

      FirebaseAnalytics.setUserId({ userId: worker.id })
        .then(() => FirebaseAnalytics.setUserProperty({ name: 'role', value: 'worker' }))
        .catch((e) => console.log(e));

      this.$patch({
        currentUser: worker,
        isLoggingIn: false,
      });
    },

    async autoLogin() {
      this.$patch({
        isAutoLoggingIn: true,
      });

      const worker = await getLocallyLoggedInWorker();

      if (!worker) {
        this.$patch({
          isAutoLoggingIn: false,
        });

        return;
      }

      FirebaseAnalytics.setUserId({ userId: worker.id })
        .then(() => FirebaseAnalytics.setUserProperty({ name: 'role', value: 'worker' }))
        .catch((e) => console.log(e));

      this.$patch({
        currentUser: worker,
        isAutoLoggingIn: false,
      });
    },

    async logout() {
      if (!this.isLoggedIn) {
        return;
      }

      this.$patch({
        isLoggingOut: true,
      });

      await firebase.auth().signOut();

      if (this.currentUser!.registrationToken !== null) {
        // async
        updateWorkerRegistrationToken(
          this.currentUser!.id,
          null,
        );
      }

      this.$reset();
    },

    waitForAutoLogin() {
      return new Promise<void>((resolve) => {
        if (!this.isAutoLoggingIn) {
          resolve();
        }

        const timer = setInterval(() => {
          if (!this.isAutoLoggingIn) {
            clearInterval(timer);
            resolve();
          }
        }, 100); // 0.1초
      });
    },

    async updateRegistrationTokenIfChanged() {
      if (!this.isLoggedIn) {
        return;
      }

      try {
        const registrationToken = await getRegistrationToken();

        if (this.currentUser!.registrationToken === registrationToken) {
          return;
        }

        await updateWorkerRegistrationToken(
          this.currentUser!.id,
          registrationToken,
        );

        this.$patch({
          currentUser: {
            registrationToken,
          },
        });
      } catch (e) {
        console.log(e);
      }
    },
  },
});
