import { defineStore } from 'pinia';

import {
  Recruit, Cursor,
  getOffersByWork, getApplicationsToWork, getContractsWithWork,
} from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { useWorksStore } from './works.store';

export type RecruitsState = {
  offers: Recruit[],
  isOffersFirstFetching: boolean,
  currentOfferCursor: Cursor<Recruit, keyof Recruit> | null,

  applications: Recruit[],
  isApplicationsFirstFetching: boolean,
  currentApplicationCursor: Cursor<Recruit, keyof Recruit> | null,

  contracts: Recruit[],
  isContractsFirstFetching: boolean,
  currentContractCursor: Cursor<Recruit, keyof Recruit> | null,

  selectedRecruit: Recruit | null,
}

export const useRecruitsStore = defineStore({
  id: 'recruits',

  state: (): RecruitsState => ({
    offers: [],
    isOffersFirstFetching: false,
    currentOfferCursor: null,

    applications: [],
    isApplicationsFirstFetching: false,
    currentApplicationCursor: null,

    contracts: [],
    isContractsFirstFetching: false,
    currentContractCursor: null,

    selectedRecruit: null,
  }),

  getters: {
    isOffersEmpty(): boolean {
      return this.offers.length === 0;
    },

    isOffersInfiniteDisabled(): boolean {
      return this.currentOfferCursor === null;
    },

    isApplicationsEmpty(): boolean {
      return this.applications.length === 0;
    },

    isApplicationsInfiniteDisabled(): boolean {
      return this.currentApplicationCursor === null;
    },

    isContractsEmpty(): boolean {
      return this.contracts.length === 0;
    },

    isContractsInfiniteDisabled(): boolean {
      return this.currentContractCursor === null;
    },

    isSelected(): boolean {
      return this.selectedRecruit !== null;
    },
  },

  actions: {
    initOffersState() {
      this.$patch({
        offers: [],
        isOffersFirstFetching: false,
        currentOfferCursor: null,
      });
    },

    initApplicationsState() {
      this.$patch({
        applications: [],
        isApplicationsFirstFetching: false,
        currentApplicationCursor: null,
      });
    },

    initContracsState() {
      this.$patch({
        contracts: [],
        isContractsFirstFetching: false,
        currentContractCursor: null,
      });
    },

    selectRecruit(recruit: Recruit | null) {
      this.$patch({
        selectedRecruit: recruit,
      });
    },

    async fetchOffers() {
      const worksStore = useWorksStore();

      if (!worksStore.isSelected) {
        throw new Error('작업요청서가 선택되지 않은 상태에서 요청 목록 요청함');
      }

      if (this.currentOfferCursor === null) {
        this.$patch({
          isOffersFirstFetching: true,
        });
      }

      try {
        const { list, cursor } = await getOffersByWork(
          worksStore.selectedWork!.id,
          this.currentOfferCursor as Cursor<Recruit, keyof Recruit>,
        );

        this.offers.push(...list);

        this.currentOfferCursor = cursor;
      } finally {
        if (this.isOffersFirstFetching) {
          this.$patch({
            isOffersFirstFetching: false,
          });
        }
      }
    },

    async fetchApplications() {
      const worksStore = useWorksStore();

      if (!worksStore.isSelected) {
        throw new Error('작업요청서가 선택되지 않은 상태에서 지원 목록 요청함');
      }

      if (this.currentApplicationCursor === null) {
        this.$patch({
          isApplicationsFirstFetching: true,
        });
      }

      try {
        const { list, cursor } = await getApplicationsToWork(
          worksStore.selectedWork!.id,
          this.currentApplicationCursor as Cursor<Recruit, keyof Recruit>,
        );

        this.applications.push(...list);

        this.currentApplicationCursor = cursor;
      } finally {
        if (this.isApplicationsFirstFetching) {
          this.$patch({
            isApplicationsFirstFetching: false,
          });
        }
      }
    },

    async fetchContracts() {
      const worksStore = useWorksStore();

      if (!worksStore.isSelected) {
        throw new Error('작업요청서가 선택되지 않은 상태에서 체결 목록 요청함');
      }

      if (this.currentContractCursor === null) {
        this.$patch({
          isContractsFirstFetching: true,
        });
      }

      try {
        const { list, cursor } = await getContractsWithWork(
          worksStore.selectedWork!.id,
          this.currentContractCursor as Cursor<Recruit, keyof Recruit>,
        );

        this.contracts.push(...list);

        this.currentContractCursor = cursor;
      } finally {
        if (this.isContractsFirstFetching) {
          this.$patch({
            isContractsFirstFetching: false,
          });
        }
      }
    },
  },
});
