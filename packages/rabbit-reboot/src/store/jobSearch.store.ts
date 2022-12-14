import { defineStore } from 'pinia';

import {
  Recruit, Cursor,
  getApplicationsByWorker, getOffersToWorker,
} from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { useMyStore } from './my.store';
import {
  CursorDoc,
  getContractsWithWorker,
} from '../services';

export type WorkStatusFilter = 'all' | 'future' | 'present' | 'past';

export type JobSearchState = {
  applications: Recruit[],
  isApplicationsFirstFetching: boolean,
  currentApplicationCursor: Cursor<Recruit, keyof Recruit> | null,

  offers: Recruit[],
  isOffersFirstFetching: boolean,
  currentOfferCursor: Cursor<Recruit, keyof Recruit> | null,

  contracts: Recruit[],
  isContractsFirstFetching: boolean,
  currentContractCursor: CursorDoc | null,
  workStatusFilter: WorkStatusFilter,

  selectedRecruit: Recruit | null,
};

export const useJobSearchStore = defineStore({
  id: 'jobSearch',

  state: (): JobSearchState => ({
    applications: [],
    isApplicationsFirstFetching: false,
    currentApplicationCursor: null,

    offers: [],
    isOffersFirstFetching: false,
    currentOfferCursor: null,

    contracts: [],
    isContractsFirstFetching: false,
    currentContractCursor: null,
    workStatusFilter: 'all',

    selectedRecruit: null,
  }),

  getters: {
    isApplicationsEmpty(): boolean {
      return this.applications.length === 0;
    },

    isApplicationsInfiniteDisabled(): boolean {
      return this.currentApplicationCursor === null;
    },

    isOffersEmpty(): boolean {
      return this.offers.length === 0;
    },

    isOffersInfiniteDisabled(): boolean {
      return this.currentOfferCursor === null;
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
    initContractsState() {
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

    async fetchApplications() {
      const myStore = useMyStore();

      if (!myStore.isLoggedIn) {
        throw new Error('??????????????? ?????? ???????????? ?????? ?????? ?????????');
      }

      if (this.currentApplicationCursor === null) {
        this.$patch({
          isApplicationsFirstFetching: true,
        });
      }

      try {
        const { list, cursor } = await getApplicationsByWorker(
          myStore.currentUser!.id,
          this.currentApplicationCursor as Cursor<Recruit, keyof Recruit>,
        );

        /**
         * INFO: ????????? ?????? ????????? recruit ???????????? ?????? ????????? ????????????.
         * ????????? ???????????? ???????????? ??????????????? ?????? ??????????????? ????????? ???
         * ????????? recruit ???????????? 2??? ???????????? ????????? ?????????. ?????? ???????????? ?????????
         * ??? fetch??? ???????????? ?????? ???????????? ?????? ????????????.
         */
        if (this.isApplicationsFirstFetching) {
          this.applications = list;
        } else {
          this.applications.push(...list);
        }

        this.currentApplicationCursor = cursor;
      } finally {
        if (this.isApplicationsFirstFetching) {
          this.$patch({
            isApplicationsFirstFetching: false,
          });
        }
      }
    },

    async fetchOffers() {
      const myStore = useMyStore();

      if (!myStore.isLoggedIn) {
        throw new Error('??????????????? ?????? ???????????? ?????? ?????? ?????????');
      }

      if (this.currentOfferCursor === null) {
        this.$patch({
          isOffersFirstFetching: true,
        });
      }

      try {
        const { list, cursor } = await getOffersToWorker(
          myStore.currentUser!.id,
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

    async fetchContracts() {
      const myStore = useMyStore();

      if (!myStore.isLoggedIn) {
        throw new Error('??????????????? ?????? ???????????? ?????? ?????? ?????????');
      }

      if (this.currentContractCursor === null) {
        this.$patch({
          isContractsFirstFetching: true,
        });
      }

      try {
        const { list, cursor } = await getContractsWithWorker(
          myStore.currentUser!.id,
          this.workStatusFilter,
          this.currentContractCursor,
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
