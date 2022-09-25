import { defineStore } from 'pinia';
import axios from 'axios';

import { getClientByPhoneNumber, createClient as createClientService } from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { API_URL } from '../config';
import { toast } from '../utils';

export type ClientSigninState = {
  phoneNumber: string,
  isSending: boolean,
  isSended: boolean,
  authNumber: string,
  isAuthing: boolean,
  token: string | null,
  isNewUser: boolean | null,
  name: string,
  isCreatingClient: boolean,
}

export const useClientSigninStore = defineStore({
  id: 'clientSignin',

  state: (): ClientSigninState => ({
    phoneNumber: '',

    isSending: false,
    isSended: false,

    authNumber: '',

    isAuthing: false,

    token: null,
    isNewUser: null,

    name: '',

    isCreatingClient: false,
  }),

  getters: {
    isPhoneNumberValidated(): boolean {
      return /^\d{11}$/g.test(this.phoneNumber);
    },

    isAuthNumberValidated(): boolean {
      return /^\d{6}$/g.test(this.authNumber);
    },

    isNameInputed(): boolean {
      return !!this.name;
    },
  },

  actions: {
    async sendAuthNumber() {
      this.$patch({
        isSending: true,
      });

      try {
        await axios.post(`${API_URL}/auth/sendAuthNumber`, {
          type: 'client',
          phoneNumber: this.phoneNumber,
        });

        this.$patch({
          isSended: true,
        });
      } catch (e: any) {
        if (e.response.status === 400) {
          toast('전화번호 형식이 알맞지 않습니다. 숫자 11자리를 입력해주세요.', 4000);
        } else {
          toast('인증번호 전송 중에 문제가 발생했습니다. 다시 시도해주세요.', 4000);
        }
        throw new Error(e);
      } finally {
        this.$patch({
          isSending: false,
        });
      }
    },

    async authAuthNumber() {
      this.$patch({
        isAuthing: true,
      });

      try {
        const { data: { token } } = await axios.post(`${API_URL}/auth/authAuthNumber`, {
          type: 'client',
          phoneNumber: this.phoneNumber,
          authNumber: this.authNumber,
        });

        const client = await getClientByPhoneNumber(this.phoneNumber);

        this.$patch({
          token,
          isNewUser: !client,
        });
      } catch (e: any) {
        if (e.response?.status === 400) {
          toast('인증번호 형식이 알맞지 않습니다. 숫자 6자리를 입력해주세요.', 4000);
        } else if (e.response?.status === 401) {
          toast('인증번호가 알맞지 않습니다. 다시 입력해주세요.', 4000);
        } else if (e.response?.status === 404) {
          toast('인증번호 전송에 문제가 발생했습니다. 인증문자를 다시 받아주세요.', 4000);
        } else {
          toast('인증번호 인증에 문제가 발생했습니다. 다시 시도해주세요.', 4000);
        }
        throw new Error(e);
      } finally {
        this.$patch({
          isAuthing: false,
        });
      }
    },

    async createClient() {
      if (!this.isNameInputed) {
        toast('이름을 입력해주세요.');
        return;
      }

      this.$patch({
        isCreatingClient: true,
      });

      try {
        await createClientService({
          name: this.name,
          phoneNumber: this.phoneNumber,
        });
      } finally {
        this.$patch({
          isCreatingClient: false,
        });
      }
    },
  },
});
