import { defineStore } from 'pinia';

import {
  Portfolio, Cursor,
  getWorkerPortfolios,
} from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { useMyStore } from './my.store';

export type PortfoliosState = {
  currentCursor: Cursor<Portfolio, keyof Portfolio> | null,
  portfolios: Portfolio[],
  isFirstFetching: boolean,

  selectedPorfolio: Portfolio | null,
}

export const usePortfoliosStore = defineStore({
  id: 'porfolios',

  state: (): PortfoliosState => ({
    currentCursor: null,
    portfolios: [],
    isFirstFetching: false,

    selectedPorfolio: null,
  }),

  getters: {
    isEmpty(): boolean {
      return this.portfolios.length === 0;
    },

    isInfiniteDisabled(): boolean {
      return this.currentCursor === null;
    },

    isSelected(): boolean {
      return this.selectedPorfolio !== null;
    },
  },

  actions: {
    selectPortfolio(portfolio: Portfolio | null) {
      this.$patch({
        selectedPorfolio: portfolio,
      });
    },

    async fetchPortfolios() {
      const myStore = useMyStore();

      if (!myStore.isLoggedIn) {
        throw new Error('로그인 안된 상태에서 포트폴리오 목록 요청함');
      }

      if (this.currentCursor === null) {
        this.$patch({
          isFirstFetching: true,
        });
      }

      try {
        const { list, cursor } = await getWorkerPortfolios(
          myStore.currentUser!.id,
          this.currentCursor as Cursor<Portfolio, keyof Portfolio>,
        );

        this.portfolios.push(...list);

        this.currentCursor = cursor;
      } finally {
        if (this.isFirstFetching) {
          this.$patch({
            isFirstFetching: false,
          });
        }
      }
    },
  },
});
