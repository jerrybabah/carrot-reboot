import { defineStore } from 'pinia';
import { UploaderFileListItem } from 'vant';

import {
  Worker, DISTRICTS, Districts,
  updateWorker as updateWorkerService,
  getWorker as getWorkerService,
} from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { useMyStore } from './my.store';
import { toast, parseDistrict } from '../utils';

export type workerModificationState = {
  id: string,

  initialProfileImage: UploaderFileListItem[],
  initialName: string,
  initialDescription: string,
  initialSpecialties: string[],
  initialCareer: number,
  initialMinWage: string,
  initialMaxWage: string,
  initialDistricts: string[],
  initialCertificateImage: UploaderFileListItem[],

  profileImage: UploaderFileListItem[],
  name: string,
  description: string,
  specialties: string[],
  career: number,
  minWage: string,
  maxWage: string,
  districts: string[],
  certificateImage: UploaderFileListItem[],

  isUpdating: boolean,
}

export const useWorkerModificationStore = defineStore({
  id: 'workerModification',

  state: (): workerModificationState => ({
    id: '',

    initialProfileImage: [],
    initialName: '',
    initialDescription: '',
    initialSpecialties: [],
    initialCareer: 0,
    initialMinWage: '',
    initialMaxWage: '',
    initialDistricts: [],
    initialCertificateImage: [],

    profileImage: [],
    name: '',
    description: '',
    specialties: [],
    career: 0,
    minWage: '',
    maxWage: '',
    districts: [],
    certificateImage: [],

    isUpdating: false,
  }),

  getters: {
    isProfileImageChanged(): boolean {
      /**
       * 초기값, 변경값 모두 설정된 경우
       * 첫 번째 인덱스값만 신경쓴다.
       */
      if (this.initialProfileImage.length > 0 && this.profileImage.length > 0) {
        return this.initialProfileImage[0].url !== this.profileImage[0].url;
      }

      /**
       * 초기값, 변경값 모두 설정되지 않았으면 변경되지 않은 것 (false || false)
       * 초기값, 변경값 중 하나만 설정됐으면 변경된 것 (true || false or false || true)
       */
      return this.initialProfileImage.length > 0 || this.profileImage.length > 0;
    },

    isNameChanged(): boolean {
      return this.initialName !== this.name;
    },

    isDescriptionChanged(): boolean {
      return this.initialDescription !== this.description;
    },

    isSpecialtiesChanged(): boolean {
      return this.initialSpecialties.length !== this.specialties.length
        || this.initialSpecialties.some((initialSpecialty) => !this.specialties.includes(initialSpecialty));
    },

    isCareearChanged(): boolean {
      return this.initialCareer !== this.career;
    },

    isMinWageChanged(): boolean {
      return this.initialMinWage !== this.minWage;
    },

    isMaxWageChanged(): boolean {
      return this.initialMaxWage !== this.maxWage;
    },

    isDistrictsChanged(): boolean {
      return this.initialDistricts.length !== this.districts.length
        || this.initialDistricts.some((initialDistrict) => !this.districts.includes(initialDistrict));
    },

    isCertificateImageChanged(): boolean {
      /**
       * 초기값, 변경값 모두 설정된 경우
       * 첫 번째 인덱스값만 신경쓴다.
       */
      if (this.initialCertificateImage.length > 0 && this.certificateImage.length > 0) {
        return this.initialCertificateImage[0].url !== this.certificateImage[0].url;
      }

      /**
       * 초기값, 변경값 모두 설정되지 않았으면 변경되지 않은 것 (false || false)
       * 초기값, 변경값 중 하나만 설정됐으면 변경된 것 (true || false or false || true)
       */
      return this.initialCertificateImage.length > 0 || this.certificateImage.length > 0;
    },

    isChanged(): boolean {
      return this.isProfileImageChanged
         || this.isNameChanged
         || this.isDescriptionChanged
         || this.isSpecialtiesChanged
         || this.isCareearChanged
         || this.isMinWageChanged
         || this.isMaxWageChanged
         || this.isDistrictsChanged
         || this.isCertificateImageChanged;
    },

    isProfileImageUploaded(): boolean {
      return this.profileImage.length > 0 && this.profileImage[0].status === 'done';
    },

    isNameInputed(): boolean {
      return !!this.name;
    },

    isDescriptionInputed(): boolean {
      return !!this.description;
    },

    isSpecialtiesSelected(): boolean {
      return this.specialties.length > 0;
    },

    isCareerInputed(): boolean {
      return this.career > 0;
    },

    isMinWageInputed(): boolean {
      return !!this.minWage;
    },

    isMaxWageInputed(): boolean {
      return !!this.maxWage;
    },

    isDistrictsSelected(): boolean {
      return this.districts.length > 0;
    },

    isCertificateImageUploaded(): boolean {
      return this.certificateImage.length > 0 && this.certificateImage[0].status === 'done';
    },

    isCompleted(): boolean {
      return this.isNameInputed
        && this.isDescriptionInputed
        && this.isSpecialtiesSelected
        && this.isCareerInputed
        && this.isMinWageInputed
        && this.isMaxWageInputed
        && this.isDistrictsSelected
        && this.isCertificateImageUploaded;
    },

    isProfileImageUploading(): boolean {
      return this.profileImage.length > 0 && this.profileImage[0].status === 'uploading';
    },

    isCertificateImageUploading(): boolean {
      return this.certificateImage.length > 0 && this.certificateImage[0].status === 'uploading';
    },

    joinedDistricts(): string {
      return this.districts.join(', ');
    },
  },

  actions: {
    init(worker: Worker) {
      this.$patch({
        id: worker.id,

        initialProfileImage: worker.profileImage ? [
          { url: worker.profileImage, status: 'done' },
        ] : [],
        profileImage: worker.profileImage ? [
          { url: worker.profileImage, status: 'done' },
        ] : [],

        initialName: worker.name,
        name: worker.name,

        initialDescription: worker.description,
        description: worker.description,

        initialSpecialties: [...worker.specialties],
        specialties: [...worker.specialties],

        initialCareer: worker.career,
        career: worker.career,

        initialMinWage: worker.minWage.toString(),
        minWage: worker.minWage.toString(),

        initialMaxWage: worker.maxWage.toString(),
        maxWage: worker.maxWage.toString(),

        initialDistricts: Object.entries(worker.districts).reduce<string[]>((result, [largeDistrict, smallDistricts]) => {
          if (smallDistricts.length === DISTRICTS[largeDistrict].length) {
            return [
              ...result,
              `${largeDistrict}/전체`,
            ];
          }

          const distircts = smallDistricts.map<string>((smallDistrict) => `${largeDistrict}/${smallDistrict}`);

          return [
            ...result,
            ...distircts,
          ];
        }, []),

        districts: Object.entries(worker.districts).reduce<string[]>((result, [largeDistrict, smallDistricts]) => {
          if (smallDistricts.length === DISTRICTS[largeDistrict].length) {
            return [
              ...result,
              `${largeDistrict}/전체`,
            ];
          }

          const distircts = smallDistricts.map<string>((smallDistrict) => `${largeDistrict}/${smallDistrict}`);

          return [
            ...result,
            ...distircts,
          ];
        }, []),

        initialCertificateImage: [{ url: worker.certificateImage, status: 'done' }],
        certificateImage: [{ url: worker.certificateImage, status: 'done' }],
      });
    },

    async updateWorker() {
      const myStore = useMyStore();

      if (!myStore.isLoggedIn) {
        throw new Error('로그인되지 않은 상태에서 프로필 수정 시도함');
      }

      if (!this.isChanged || !this.isCompleted) {
        toast('변경된 내용이 없거나 입력이 완료되지 않았습니다.');
        throw new Error('변경 내용 없음 또는 입력 완료되지 않음');
      }

      if (!this.id) {
        throw new Error('수정할 기술자가 설정되지 않았습니다.');
      }

      this.$patch({
        isUpdating: true,
      });

      try {
        await updateWorkerService(
          this.id,
          {
            profileImage: this.profileImage.length > 0 ? this.profileImage[0].url : null,
            name: this.name,
            description: this.description,
            specialties: this.specialties,
            career: this.career,
            minWage: Number.parseInt(this.minWage, 10),
            maxWage: Number.parseInt(this.maxWage, 10),
            districts: this.districts.reduce<Districts>((districts, district) => {
              const { largeDistrict, smallDistrict } = parseDistrict(district);

              if (smallDistrict === '전체') {
                return {
                  ...districts,
                  [largeDistrict]: [
                    ...DISTRICTS[largeDistrict],
                  ],
                };
              }

              if (districts[largeDistrict]) {
                if (districts[largeDistrict].length === DISTRICTS[largeDistrict].length) {
                  return {
                    ...districts,
                  };
                }

                return {
                  ...districts,
                  [largeDistrict]: [
                    ...districts[largeDistrict],
                    smallDistrict,
                  ],
                };
              }

              return {
                ...districts,
                [largeDistrict]: [smallDistrict],
              };
            }, {}),
            certificateImage: this.certificateImage[0].url!,
          },
        );

        const updatedWorker = await getWorkerService(this.id);

        myStore.$patch({
          currentUser: updatedWorker,
        });
      } finally {
        this.$patch({
          isUpdating: false,
        });
      }
    },
  },
});
