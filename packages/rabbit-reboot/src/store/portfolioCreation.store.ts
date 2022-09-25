import { defineStore } from 'pinia';
import { UploaderFileListItem } from 'vant';

import { createWorkerPortfolio } from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { useMyStore } from './my.store';
import { toast } from '../utils';

export type PortfolioCreationState = {
  images: UploaderFileListItem[],
  description: string,

  isCreating: boolean,
}

export const usePortfolioCreationStore = defineStore({
  id: 'portfolioCreation',

  state: (): PortfolioCreationState => ({
    images: [],
    description: '',

    isCreating: false,
  }),

  getters: {
    isImagesUploaded(): boolean {
      return this.images.some((image) => image.status === 'done');
    },

    isDescriptionInputed(): boolean {
      return !!this.description;
    },

    isCompleted(): boolean {
      return this.isImagesUploaded;
    },

    isInputed(): boolean {
      return this.isImagesUploaded
        || this.isDescriptionInputed;
    },

    isImagesUploading(): boolean {
      return this.images.some((image) => image.status === 'uploading');
    },
  },

  actions: {
    async createPortfolio() {
      const myStore = useMyStore();

      if (!myStore.isLoggedIn) {
        throw new Error('로그인되지 않은 상태에서 포트폴리오 생성함');
      }

      if (!this.isCompleted) {
        toast('입력이 완료되지 않았습니다. 입력하지 않은 것이 있는지 확인해주세요.');
        throw new Error('입력이 완료되지 않았습니다');
      }

      this.$patch({
        isCreating: true,
      });

      try {
        await createWorkerPortfolio(
          myStore.currentUser!.id,
          {
            images: this.images.reduce<string[]>((result, image) => {
              if (image.url) {
                return [
                  ...result,
                  image.url,
                ];
              }

              return [
                ...result,
              ];
            }, []),
            description: this.description,
          },
        );
      } finally {
        this.$patch({
          isCreating: false,
        });
      }
    },
  },
});
