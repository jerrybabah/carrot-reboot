import { defineStore } from 'pinia';
import { UploaderFileListItem } from 'vant';

import { Portfolio, updateWorkerPortfolio } from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { useMyStore } from './my.store';
import { toast } from '../utils';

export type PortfolioModificationState = {
  id: string,

  initialImages: UploaderFileListItem[],
  initialDescription: string,

  images: UploaderFileListItem[],
  description: string,

  isUpdating: boolean,
};

export const usePortfolioModificationStore = defineStore({
  id: 'portfolioModification',

  state: (): PortfolioModificationState => ({
    id: '',

    initialImages: [],
    initialDescription: '',

    images: [],
    description: '',

    isUpdating: false,
  }),

  getters: {
    isImagesChanged(): boolean {
      return this.initialImages.length !== this.images.length
        || this.initialImages.some((initialImage, index) => initialImage.url !== this.images[index].url);
    },

    isDescriptionChanged(): boolean {
      return this.initialDescription !== this.description;
    },

    isChanged(): boolean {
      return this.isImagesChanged
        || this.isDescriptionChanged;
    },

    isImagesUploaded(): boolean {
      return this.images.some((image) => image.status === 'done');
    },

    isDescriptionInputed(): boolean {
      return !!this.description;
    },

    isComplete(): boolean {
      return this.isImagesUploaded;
    },

    isImagesUploading(): boolean {
      return this.images.some((image) => image.status === 'uploading');
    },
  },

  actions: {
    init(portfolio: Portfolio) {
      this.$patch({
        id: portfolio.id,

        initialImages: portfolio.images.map<UploaderFileListItem>((imageUrl) => ({
          url: imageUrl,
          status: 'done',
        })),
        images: portfolio.images.map<UploaderFileListItem>((imageUrl) => ({
          url: imageUrl,
          status: 'done',
        })),

        initialDescription: portfolio.description || '',
        description: portfolio.description || '',
      });
    },

    async updatePortfolio() {
      const myStore = useMyStore();

      if (!myStore.isLoggedIn) {
        throw new Error('??????????????? ?????? ???????????? ??????????????? ?????? ?????????');
      }

      if (!this.isChanged || !this.isComplete) {
        toast('????????? ????????? ????????? ????????? ???????????? ???????????????.');
        throw new Error('?????? ?????? ?????? ?????? ?????? ???????????? ??????');
      }

      if (!this.id) {
        throw new Error('????????? ?????????????????? ???????????? ???????????????.');
      }

      this.$patch({
        isUpdating: true,
      });

      try {
        await updateWorkerPortfolio(
          myStore.currentUser!.id,
          this.id,
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
          isUpdating: false,
        });
      }
    },
  },
});
