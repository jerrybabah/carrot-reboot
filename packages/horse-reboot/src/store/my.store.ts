import { defineStore } from 'pinia';
import firebase from 'firebase/app';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

import { Client, updateClientRegistrationToken } from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { getLocallyLoggedInClient, loginLocally, getRegistrationToken } from '../utils';

export type MyState = {
  currentUser: Client | null,
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

      const client = await loginLocally(token);

      FirebaseAnalytics.setUserId({ userId: client.id })
        .then(() => FirebaseAnalytics.setUserProperty({ name: 'role', value: 'client' }))
        .catch((e) => console.log(e));

      this.$patch({
        currentUser: client,
        isLoggingIn: false,
      });
    },

    async autoLogin() {
      this.$patch({
        isAutoLoggingIn: true,
      });

      const client = await getLocallyLoggedInClient();

      if (!client) {
        this.$patch({
          isAutoLoggingIn: false,
        });

        return;
      }

      FirebaseAnalytics.setUserId({ userId: client.id })
        .then(() => FirebaseAnalytics.setUserProperty({ name: 'role', value: 'client' }))
        .catch((e) => console.log(e));

      this.$patch({
        currentUser: client,
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
        updateClientRegistrationToken(
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

        await updateClientRegistrationToken(
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
