import { defineStore } from 'pinia';
import { UploaderFileListItem } from 'vant';

import { createReview as createReviewService } from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { useMyStore } from './my.store';
import { useRecruitsStore } from './recruits.store';
import { toast } from '../utils';

export type ReviewCreationState = {
  score: number,
  description: string,
  images: UploaderFileListItem[],

  isCreating: boolean,
};

export const useReviewCreationStore = defineStore({
  id: 'reviewCreation',

  state: (): ReviewCreationState => ({
    score: 0,
    description: '',
    images: [],

    isCreating: false,
  }),

  getters: {
    scoreDescription(): string {
      switch (this.score) {
        case 1: return '나쁨';
        case 2: return '벌로';
        case 3: return '보통';
        case 4: return '좋음';
        case 5: return '최고';
        default: return '';
      }
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

    isInputed(): boolean {
      return this.isScoreInputed
        || this.isDescriptionInputed
        || this.isImagesUploaded;
    },

    isImagesUploading(): boolean {
      return this.images.some((image) => image.status === 'uploading');
    },
  },

  actions: {
    async createReview() {
      const myStore = useMyStore();

      if (!myStore.isLoggedIn) {
        throw new Error('로그인되지 않은 상태에서 리뷰 작성함');
      }

      const recruitsStore = useRecruitsStore();

      if (!recruitsStore.isSelected) {
        throw new Error('recruit가 선택되지 않음');
      }

      if (!this.isCompleted) {
        toast('입력이 완료되지 않았습니다. 입력하지 않은 것이 있는지 확인해주세요.');
        throw new Error('입력이 완료되지 않았습니다');
      }

      this.$patch({
        isCreating: true,
      });

      try {
        await createReviewService(
          recruitsStore.selectedRecruit!.work.id,
          recruitsStore.selectedRecruit!.worker.id,
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
          isCreating: false,
        });
      }
    },
  },
});
