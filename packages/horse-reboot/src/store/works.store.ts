import { defineStore } from 'pinia';

import {
  Work, Cursor,
  getClientRecruitingWorks, getClientRecruitedWorks,
} from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { useMyStore } from './my.store';

export type WorkStatusFilter = 'all' | 'future' | 'present' | 'past';

export type WorksState = {
  recruitingWorks: Work[],
  isRecruitingFetching: boolean,

  currentRecruitedCursor: Cursor<Work, keyof Work> | null,
  recruitedWorks: Work[],
  workStatusFilter: WorkStatusFilter,
  isRecruitedFirstFetching: boolean, // INFO: 두 번째부터 fetching 상태는 ion-infinite에서 모두 관리하므로 필요 없다. (ion-infinite에서 state를 필요로 하지 않는다.)

  selectedWork: Work | null,
}

export const useWorksStore = defineStore({
  id: 'works',

  state: (): WorksState => ({
    recruitingWorks: [],
    isRecruitingFetching: false,

    currentRecruitedCursor: null,
    recruitedWorks: [],
    workStatusFilter: 'all',
    isRecruitedFirstFetching: false,

    selectedWork: null,
  }),

  getters: {
    isRecruitingEmpty(): boolean {
      return this.recruitingWorks.length === 0;
    },

    isRecruitedInfiniteDisabled(): boolean {
      return this.currentRecruitedCursor === null;
    },

    isRecruitedEmpty(): boolean {
      return this.recruitedWorks.length === 0;
    },

    isSelected(): boolean {
      return this.selectedWork !== null;
    },
  },

  actions: {
    initRecruitingState() {
      this.$patch({
        recruitingWorks: [],
        isRecruitingFetching: false,
      });
    },

    initRecruitedState() {
      this.$patch({
        currentRecruitedCursor: null,
        recruitedWorks: [],
        isRecruitedFirstFetching: false,
      });
    },

    selectWork(work: Work | null) {
      this.$patch({
        selectedWork: work,
      });
    },

    async fetchRecruitings() {
      const myStore = useMyStore();

      if (!myStore.isLoggedIn) {
        throw new Error('로그인 안된 상태에서 구인중 일자리 목록 요청함');
      }

      this.$patch({
        isRecruitingFetching: true,
      });

      try {
        this.recruitingWorks = await getClientRecruitingWorks(
          myStore.currentUser!.id,
        );
      } finally {
        this.$patch({
          isRecruitingFetching: false,
        });
      }
    },

    async fetchRecruiteds() {
      const myStore = useMyStore();

      if (!myStore.isLoggedIn) {
        throw new Error('로그인 안된 상태에서 구인완료 일자리 목록 요청함');
      }

      if (this.currentRecruitedCursor === null) {
        this.$patch({
          isRecruitedFirstFetching: true,
        });
      }

      try {
        const { list, cursor } = await getClientRecruitedWorks(
          myStore.currentUser!.id,
          this.workStatusFilter,
          this.currentRecruitedCursor as Cursor<Work, keyof Work>,
        );

        this.recruitedWorks.push(...list);

        this.currentRecruitedCursor = cursor;
      } finally {
        if (this.isRecruitedFirstFetching) {
          this.$patch({
            isRecruitedFirstFetching: false,
          });
        }
      }
    },
  },
});
