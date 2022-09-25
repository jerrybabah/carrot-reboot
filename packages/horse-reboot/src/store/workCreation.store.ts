import { defineStore } from 'pinia';
import { UploaderFileListItem } from 'vant';

import {
  Work, Worker,
  createWork as createWorkService, getWork as getWorkService,
} from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { useMyStore } from './my.store';
import { useWorksStore } from './works.store';
import { parseDistrict, toast } from '../utils';

export type RequiredWorkerInfo = {
  type: string,
  wage: number | null,
}

export type WorkCreationState = {
  field: string,
  startDate: Date | null,
  endDate: Date | null,
  district: string,
  addressDetail: string,
  requiredWorkers: RequiredWorkerInfo[],
  title: string,
  description: string,
  images: UploaderFileListItem[],
  isCreatingWork: boolean,
  selectedWorker: Worker | null,
}

export const useWorkCreationStore = defineStore({
  id: 'workCreation',

  state: (): WorkCreationState => ({
    field: '',
    startDate: null,
    endDate: null,
    district: '/',
    addressDetail: '',
    requiredWorkers: [
      {
        type: '기공',
        wage: null,
      },
    ],
    title: '',
    description: '',
    images: [],
    isCreatingWork: false,

    selectedWorker: null,
  }),

  getters: {
    isFieldSelected(): boolean {
      return !!this.field;
    },

    isStartDateSelected(): boolean {
      return this.startDate !== null;
    },

    isEndDateSelected(): boolean {
      return this.endDate !== null;
    },

    isDistrictSelected(): boolean {
      return this.district !== '/';
    },

    isAddressDetailInputed(): boolean {
      return !!this.addressDetail;
    },

    isRequiredWorkersInputed(): boolean {
      return this.requiredWorkers.every((requiredWorkerInfo) => requiredWorkerInfo.wage !== null && !Number.isNaN(requiredWorkerInfo.wage));
    },

    isTitleInputed(): boolean {
      return !!this.title;
    },

    isDescriptionInputed(): boolean {
      return !!this.description;
    },

    isImagesUploaded(): boolean {
      return this.images.some((image) => image.status === 'done');
    },

    isCompleted(): boolean {
      return this.isFieldSelected
        && this.isStartDateSelected
        && this.isEndDateSelected
        && this.isDistrictSelected
        && this.isRequiredWorkersInputed
        && this.isTitleInputed
        && this.isDescriptionInputed;
    },

    isInputed(): boolean {
      return this.isFieldSelected
        || this.isStartDateSelected
        || this.isEndDateSelected
        || this.isDistrictSelected
        || this.isAddressDetailInputed
        || this.isRequiredWorkersInputed
        || this.isTitleInputed
        || this.isDescriptionInputed
        || this.isImagesUploaded;
    },

    isImagesUploading(): boolean {
      return this.images.some((image) => image.status === 'uploading');
    },

    parsedDistrict(): { beautifiedDistrict: string, largeDistrict: string, smallDistrict: string } {
      return parseDistrict(this.district, true);
    },

    requriedWorkerCount(): number {
      return this.requiredWorkers.length;
    },

    totalCost(): number {
      return this.requiredWorkers.reduce<number>((cost, requriedWorkerInfo) => {
        if (!requriedWorkerInfo.wage) {
          return cost;
        }

        return cost + requriedWorkerInfo.wage;
      }, 0);
    },

    isWorkerSelected(): boolean {
      return !!this.selectedWorker;
    },
  },

  actions: {
    initInputs() {
      this.$patch({
        field: '',
        startDate: null,
        endDate: null,
        district: '/',
        addressDetail: '',
        requiredWorkers: [
          {
            type: '기공',
            wage: null,
          },
        ],
        title: '',
        description: '',
        images: [],
      });
    },

    async createWork(): Promise<Work> {
      const myStore = useMyStore();

      if (!myStore.isLoggedIn) {
        throw new Error('로그인되지 않은 상태에서 작업 요청서 생성 시도함');
      }

      if (!this.isCompleted) {
        toast('입력이 완료되지 않았습니다. 입력하지 않은 것이 있는지 확인해주세요.');
        throw new Error('입력이 완료되지 않았습니다');
      }

      this.$patch({
        isCreatingWork: true,
      });

      const worksStore = useWorksStore();

      try {
        const workId = await createWorkService(
          myStore.currentUser!.id,
          {
            field: this.field,
            startDate: this.startDate as any,
            endDate: this.endDate as any,
            address1: this.parsedDistrict.largeDistrict,
            address2: this.parsedDistrict.smallDistrict,
            addressDetail: this.addressDetail,
            requiredWorkers: this.requiredWorkers as any,
            title: this.title,
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

        const createdWork = await getWorkService(workId);

        worksStore.$patch({
          recruitingWorks: [
            createdWork!,
            ...worksStore.recruitingWorks,
          ],
        });

        return createdWork!;
      } finally {
        this.$patch({
          isCreatingWork: false,
        });
      }
    },

    selectWorker(worker: Worker | null) {
      this.$patch({
        selectedWorker: worker,
      });
    },
  },
});
