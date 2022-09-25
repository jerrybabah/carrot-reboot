import { defineStore } from 'pinia';

export type JobSearchSegment = 'apply' | 'offer' | 'contract';

export type UiState = {
  jobSearch: {
    segment: JobSearchSegment,
  },
  works: {
    filter: {
      largeDistricts: string[],
    },
  },

  isLoginRequiredModalOpened: boolean,

  isApplyModalOpened: boolean,

  isContactModalOpened: boolean,

  isPortfolioModificationConfirmModalOpened: boolean,

  isWorkerModificationLeaveConfirmModalOpened: boolean,

  isInactiveModalOpened: boolean,
};

export const useUiStore = defineStore({
  id: 'ui',

  state: (): UiState => ({
    jobSearch: {
      segment: 'apply',
    },
    works: {
      filter: {
        largeDistricts: [],
      },
    },

    isLoginRequiredModalOpened: false,

    isApplyModalOpened: false,

    isContactModalOpened: false,

    isPortfolioModificationConfirmModalOpened: false,

    isWorkerModificationLeaveConfirmModalOpened: false,

    isInactiveModalOpened: false,
  }),

  getters: {

  },

  actions: {

  },
});
