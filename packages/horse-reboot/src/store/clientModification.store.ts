import { defineStore } from 'pinia';

import {
  Client,
  updateClient as updateClientService, getClient as getClientService,
} from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { useMyStore } from './my.store';
import { toast } from '../utils';

export type ClientModificationState = {
  id: string,

  initialName: string,

  name: string,

  isUpdating: boolean,
}

export const useClientModificationStore = defineStore({
  id: 'clientModification',

  state: (): ClientModificationState => ({
    id: '',

    initialName: '',

    name: '',

    isUpdating: false,
  }),

  getters: {
    isNameChanged(): boolean {
      return this.initialName !== this.name;
    },

    isChanged(): boolean {
      return this.isNameChanged;
    },

    isNameInputed(): boolean {
      return !!this.name;
    },

    isCompleted(): boolean {
      return this.isNameInputed;
    },
  },

  actions: {
    init(client: Client) {
      this.$patch({
        id: client.id,

        initialName: client.name,
        name: client.name,
      });
    },

    async updateClient() {
      const myStore = useMyStore();

      if (!myStore.isLoggedIn) {
        throw new Error('로그인되지 않은 상태에서 프로필 수정 시도함');
      }

      if (!this.isChanged || !this.isCompleted) {
        toast('변경된 내용이 없거나 입력이 완료되지 않았습니다.');
        throw new Error('변경 내용 없음 또는 입력 완료되지 않음');
      }

      if (!this.id) {
        throw new Error('수정할 구인자가 설정되지 않았습니다.');
      }

      this.$patch({
        isUpdating: true,
      });

      try {
        await updateClientService(
          this.id,
          {
            name: this.name,
          },
        );

        const updatedClient = await getClientService(this.id);

        myStore.$patch({
          currentUser: updatedClient,
        });
      } finally {
        this.$patch({
          isUpdating: false,
        });
      }
    },
  },
});
