import { defineStore } from 'pinia';

export type WorksSegment = 'recruiting' | 'recruited';

export type WorkerSegment = 'review' | 'portfolio';

export type RecruitsSegment = 'offer' | 'apply' | 'contract';

export type UiState = {
  works: {
    segment: WorksSegment,
  },
  worker: {
    segment: WorkerSegment,
  },
  recruits: {
    segment: RecruitsSegment,
  },

  isLoginRequiredModalOpened: boolean,

  isWorkCreationModalOpened: boolean,

  isContactModalOpened: boolean,

  isContractModalOpened: boolean,

  isContractWorkModalOpened: boolean,

  isReviewLeaveConfirmModalOpened: boolean,

  isWorkModificationLeaveConfirmModalOpened: boolean,

  isReviewModificationLeaveConfirmModalOpened: boolean,

  isClientModificationLeaveConfirmModalOpened: boolean,
}

export const useUiStore = defineStore({
  id: 'ui',

  state: (): UiState => ({
    works: {
      segment: 'recruiting',
    },

    worker: {
      segment: 'review',
    },

    recruits: {
      segment: 'offer',
    },

    isLoginRequiredModalOpened: false,

    isWorkCreationModalOpened: false,

    isContactModalOpened: false,

    isContractModalOpened: false,

    isContractWorkModalOpened: false,

    isReviewLeaveConfirmModalOpened: false,

    isWorkModificationLeaveConfirmModalOpened: false,

    isReviewModificationLeaveConfirmModalOpened: false,

    isClientModificationLeaveConfirmModalOpened: false,
  }),

  actions: {
  },
});
