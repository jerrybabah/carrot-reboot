import { defineStore } from 'pinia';
import { UploaderFileListItem } from 'vant';

import { Review, updateReview as updateReviewService } from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { useMyStore } from './my.store';
import { toast } from '../utils';

export type reviewModificationState = {
  id: string,

  initialScore: number,
  initialDescription: string,
  initialImages: UploaderFileListItem[],

  score: number,
  description: string,
  images: UploaderFileListItem[],

  isUpdating: boolean,
};

export const useReviewModificationStore = defineStore({
  id: 'reviewModificationStore',

  state: (): reviewModificationState => ({
    id: '',

    initialScore: 0,
    initialDescription: '',
    initialImages: [],

    score: 0,
    description: '',
    images: [],

    isUpdating: false,
  }),

  getters: {
    isScoreChanged(): boolean {
      return this.initialScore !== this.score;
    },

    isDescriptionChanged(): boolean {
      return this.initialDescription !== this.description;
    },

    isImagesChanged(): boolean {
      return this.initialImages.length !== this.images.length
        || this.initialImages.some((initialImage, index) => initialImage.url !== this.images[index].url);
    },

    isChanged(): boolean {
      return this.isScoreChanged
        || this.isDescriptionChanged
        || this.isImagesChanged;
    },

    isScoreInputed(): boolean {
      return this.score > 0;
    },

    isDescriptionInputed(): boolean {
      return !!this.description;
    },

    isImagesUploaded(): boolean {
      return this.images.some((image) => image.status === 'done');
    },

    isCompleted(): boolean {
      return this.isScoreInputed
        && this.isDescriptionInputed;
    },

    isImagesUploading(): boolean {
      return this.images.some((image) => image.status === 'uploading');
    },
  },

  actions: {
    init(review: Review) {
      this.$patch({
        id: review.id,

        initialScore: review.score,
        score: review.score,

        initialDescription: review.description,
        description: review.description,

        initialImages: review.images.map<UploaderFileListItem>((imageUrl) => ({
          url: imageUrl,
          status: 'done',
        })),
        images: review.images.map<UploaderFileListItem>((imageUrl) => ({
          url: imageUrl,
          status: 'done',
        })),
      });
    },

    async updateReview() {
      const myStore = useMyStore();

      if (!myStore.isLoggedIn) {
        throw new Error('??????????????? ?????? ???????????? ?????? ?????? ?????????');
      }

      if (!this.isChanged || !this.isCompleted) {
        toast('????????? ????????? ????????? ????????? ???????????? ???????????????.');
        throw new Error('?????? ?????? ?????? ?????? ?????? ???????????? ??????');
      }

      if (!this.id) {
        throw new Error('????????? ????????? ???????????? ???????????????.');
      }

      this.$patch({
        isUpdating: true,
      });

      try {
        await updateReviewService(
          this.id,
          {
            score: this.score,
            description: this.description,
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
