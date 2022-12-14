import { defineStore } from 'pinia';
import { UploaderFileListItem } from 'vant';
import axios from 'axios';

import {
  Districts, DISTRICTS,
  getWorkerByPhoneNumber, createWorker as createWorkerService,
} from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { API_URL } from '../config';
import { toast, parseDistrict } from '../utils';

export type WorkerSigninState = {
  phoneNumber: string,
  isSending: boolean,
  isSended: boolean,
  authNumber: string,
  isAuthing: boolean,
  token: string | null,
  isNewUser: boolean | null,
  specialties: string[],
  career: number,
  minWage: string,
  maxWage: string,
  districts: string[],
  profileImage: UploaderFileListItem[],
  name: string,
  description: string,
  certificateImage: UploaderFileListItem[],
  isCreatingWorker: boolean,
}

export const useWorkerSigninStore = defineStore({
  id: 'workerSignin',

  state: (): WorkerSigninState => ({
    phoneNumber: '',

    isSending: false,
    isSended: false,

    authNumber: '',

    isAuthing: false,

    token: null,
    isNewUser: null,

    specialties: [],
    career: 0,
    minWage: '',
    maxWage: '',
    districts: [],
    profileImage: [],
    name: '',
    description: '',
    certificateImage: [],

    isCreatingWorker: false,
  }),

  getters: {
    isPhoneNumberValidated(): boolean {
      return /^\d{11}$/g.test(this.phoneNumber);
    },

    isAuthNumberValidated(): boolean {
      return /^\d{6}$/g.test(this.authNumber);
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

    isProfileImageUploaded(): boolean {
      return this.profileImage.length > 0 && this.profileImage[0].status === 'done';
    },

    isNameInputed(): boolean {
      return !!this.name;
    },

    isDescriptionInputed(): boolean {
      return !!this.description;
    },

    isCertificateImageUploaded(): boolean {
      return this.certificateImage.length > 0 && this.certificateImage[0].status === 'done';
    },

    isCompleted(): boolean {
      return this.isSpecialtiesSelected
        && this.isCareerInputed
        && this.isMinWageInputed
        && this.isMaxWageInputed
        && this.isDistrictsSelected
        && this.isNameInputed
        && this.isDescriptionInputed
        && this.isCertificateImageUploaded;
    },

    isProfileImageUploading(): boolean {
      return this.profileImage.length > 0 && this.profileImage[0].status === 'uploading';
    },

    isCertificateImageUploading(): boolean {
      return this.certificateImage.length > 0 && this.certificateImage[0].status === 'uploading';
    },
  },

  actions: {
    async sendAuthNumber() {
      this.$patch({
        isSending: true,
      });

      try {
        await axios.post(`${API_URL}/auth/sendAuthNumber`, {
          type: 'worker',
          phoneNumber: this.phoneNumber,
        });

        this.$patch({
          isSended: true,
        });
      } catch (e: any) {
        if (e.response.status === 400) {
          toast('???????????? ????????? ????????? ????????????. ?????? 11????????? ??????????????????.', 4000);
        } else {
          toast('???????????? ?????? ?????? ????????? ??????????????????. ?????? ??????????????????.', 4000);
        }
        throw new Error(e);
      } finally {
        this.$patch({
          isSending: false,
        });
      }
    },

    async authAuthNumber() {
      this.$patch({
        isAuthing: true,
      });

      try {
        const { data: { token } } = await axios.post(`${API_URL}/auth/authAuthNumber`, {
          type: 'worker',
          phoneNumber: this.phoneNumber,
          authNumber: this.authNumber,
        });

        const worker = await getWorkerByPhoneNumber(this.phoneNumber);

        this.$patch({
          token,
          isNewUser: !worker,
        });
      } catch (e: any) {
        if (e.response?.status === 400) {
          toast('???????????? ????????? ????????? ????????????. ?????? 6????????? ??????????????????.', 4000);
        } else if (e.response?.status === 401) {
          toast('??????????????? ????????? ????????????. ?????? ??????????????????.', 4000);
        } else if (e.response?.status === 404) {
          toast('???????????? ????????? ????????? ??????????????????. ??????????????? ?????? ???????????????.', 4000);
        } else {
          toast('???????????? ????????? ????????? ??????????????????. ?????? ??????????????????.', 4000);
        }
        throw new Error(e);
      } finally {
        this.$patch({
          isAuthing: false,
        });
      }
    },

    async createWorker() {
      if (!this.isCompleted) {
        toast('????????? ???????????? ???????????????. ???????????? ?????? ?????? ????????? ??????????????????.');
        return;
      }

      this.$patch({
        isCreatingWorker: true,
      });

      try {
        await createWorkerService(
          {
            profileImage: this.profileImage.length > 0 ? this.profileImage[0].url || null : null,
            certificateImage: this.certificateImage[0].url!,
            specialties: this.specialties,
            name: this.name,
            career: this.career,
            minWage: Number.parseInt(this.minWage, 10),
            maxWage: Number.parseInt(this.maxWage, 10),
            phoneNumber: this.phoneNumber,
            districts: this.districts.reduce<Districts>((districts, district) => {
              const { largeDistrict, smallDistrict } = parseDistrict(district);

              if (smallDistrict === '??????') {
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
            description: this.description,
          },
        );
      } finally {
        this.$patch({
          isCreatingWorker: false,
        });
      }
    },
  },
});
