import { defineStore } from 'pinia';
import { UploaderFileListItem } from 'vant';

import { Work, updateWork as updateWorkService } from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { RequiredWorkerInfo } from './workCreation.store';
import { useMyStore } from './my.store';
import { parseDistrict, toast } from '../utils';

export type WorkModificationState = {
  id: string,

  initialField: string,
  initialStartDate: Date | null,
  initialEndDate: Date | null,
  initialDistrict: string,
  initialAddressDetail: string,
  initialRequiredWorkers: RequiredWorkerInfo[],
  initialTitle: string,
  initialDescription: string,
  initialImages: UploaderFileListItem[],

  field: string,
  startDate: Date | null,
  endDate: Date | null,
  district: string,
  addressDetail: string,
  requiredWorkers: RequiredWorkerInfo[],
  title: string,
  description: string,
  images: UploaderFileListItem[],

  isUpdating: boolean,
}

export const useWorkModificationStore = defineStore({
  id: 'workModification',

  state: (): WorkModificationState => ({
    id: '',

    initialField: '',
    initialStartDate: null,
    initialEndDate: null,
    initialDistrict: '/',
    initialAddressDetail: '',
    initialRequiredWorkers: [
      {
        type: '기공',
        wage: null,
      },
    ],
    initialTitle: '',
    initialDescription: '',
    initialImages: [],

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

    isUpdating: false,
  }),

  getters: {
    isFieldChanged(): boolean {
      return this.initialField !== this.field;
    },

    isDateChanged(): boolean {
      return this.initialStartDate?.valueOf() !== this.startDate?.valueOf()
        || this.initialEndDate?.valueOf() !== this.endDate?.valueOf();
    },

    isDistrictChanged(): boolean {
      return this.initialDistrict !== this.district;
    },

    isAddressDetailChanged(): boolean {
      return this.initialAddressDetail !== this.addressDetail;
    },

    isRequiredWorkersChanged(): boolean {
      return this.initialRequiredWorkers.length !== this.requiredWorkers.length
        || this.initialRequiredWorkers.some((initialWorkerInfo, index) => (
          initialWorkerInfo.type !== this.requiredWorkers[index].type
            || initialWorkerInfo.wage !== this.requiredWorkers[index].wage
        ));
    },

    isTitleChanged(): boolean {
      return this.initialTitle !== this.title;
    },

    isDescriptionChanged(): boolean {
      return this.initialDescription !== this.description;
    },

    isImagesChanged(): boolean {
      return this.initialImages.length !== this.images.length
        || this.initialImages.some((initialImage, index) => initialImage.url !== this.images[index].url);
    },

    isChanged(): boolean {
      return this.isFieldChanged
        || this.isDateChanged
        || this.isDistrictChanged
        || this.isAddressDetailChanged
        || this.isRequiredWorkersChanged
        || this.isTitleChanged
        || this.isDescriptionChanged
        || this.isImagesChanged;
    },

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

    isImagesUploading(): boolean {
      return this.images.some((image) => image.status === 'uploading');
    },

    parsedDistrict(): { beautifiedDistrict: string, largeDistrict: string, smallDistrict: string } {
      return parseDistrict(this.district, true);
    },
  },

  actions: {
    init(work: Work) {
      this.$patch({
        id: work.id,

        initialField: work.field,
        field: work.field,

        initialStartDate: work.startDate,
        startDate: work.startDate,

        initialEndDate: work.endDate,
        endDate: work.endDate,

        initialDistrict: `${work.address1}/${work.address2}`,
        district: `${work.address1}/${work.address2}`,

        initialAddressDetail: work.addressDetail || '',
        addressDetail: work.addressDetail || '',

        initialRequiredWorkers: work.requiredWorkers.map<RequiredWorkerInfo>((requiredWorkerInfo) => ({
          type: requiredWorkerInfo.type,
          wage: requiredWorkerInfo.wage,
        })),
        requiredWorkers: work.requiredWorkers.map<RequiredWorkerInfo>((requiredWorkerInfo) => ({
          type: requiredWorkerInfo.type,
          wage: requiredWorkerInfo.wage,
        })),

        initialTitle: work.title,
        title: work.title,

        initialDescription: work.description,
        description: work.description,

        initialImages: work.images.map<UploaderFileListItem>((imageUrl) => ({
          url: imageUrl,
          status: 'done',
        })),
        images: work.images.map<UploaderFileListItem>((imageUrl) => ({
          url: imageUrl,
          status: 'done',
        })),
      });
    },

    async updateWork() {
      const myStore = useMyStore();

      if (!myStore.isLoggedIn) {
        throw new Error('로그인되지 않은 상태에서 작업 요청서 수정 시도함');
      }

      if (!this.isChanged || !this.isCompleted) {
        toast('변경된 내용이 없거나 입력이 완료되지 않았습니다.');
        throw new Error('변경 내용 없음 또는 입력 완료되지 않음');
      }

      if (!this.id) {
        throw new Error('수정할 작업 요청서가 설정되지 않았습니다.');
      }

      this.$patch({
        isUpdating: true,
      });

      try {
        await updateWorkService(
          this.id,
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
      } finally {
        this.$patch({
          isUpdating: false,
        });
      }
    },
  },
});
