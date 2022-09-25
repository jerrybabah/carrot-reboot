<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" default-href="/tabs/myPage" />
        </ion-buttons>

        <ion-title>
          프로필 수정
        </ion-title>

        <ion-buttons slot="end">
          <ion-button
            :disabled="!workerModificationStore.isChanged || !workerModificationStore.isCompleted
              || workerModificationStore.isProfileImageUploading || workerModificationStore.isCertificateImageUploading"
            @click="onClickSubmit"
          >
            완료
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="ion-padding ion-vertical-margin">
        <ion-list>
          <div class="profile-image-wrapper">
            <div class="profile-image-label">
              <ion-text color="dark">
                프로필 이미지
              </ion-text>
            </div>

            <van-uploader
              v-model="workerModificationStore.profileImage"
              class="profile-image"
              :max-count="1"
              upload-icon="smile"
              :after-read="afterReadProfileImage"
            />
          </div>

          <ion-item>
            <ion-label position="stacked">
              이름
            </ion-label>

            <ion-input
              v-model="workerModificationStore.name"
              placeholder="예시) 홍길동, 김철수(성실인테리어)"
            />
          </ion-item>

          <ion-item>
            <ion-label position="stacked">
              자기소개
            </ion-label>

            <ion-textarea
              v-model="workerModificationStore.description"
              placeholder="자기 소개를 입력해주세요."
              mode="md"
              auto-grow
              rows="10"
            />
          </ion-item>

          <ion-item>
            <ion-label position="stacked">
              전문분야
            </ion-label>

            <ion-select
              v-model="workerModificationStore.specialties"
              multiple
              placeholder="전문분야를 선택해주세요. (다중선택)"
            >
              <ion-select-option
                v-for="(fieldKr, _, index) in FIELDS"
                :key="index"
                :value="fieldKr"
              >
                {{ fieldKr }}
              </ion-select-option>
            </ion-select>
          </ion-item>

          <div class="career-wrapper">
            <div class="career-label">
              경력
            </div>

            <van-stepper
              v-model="workerModificationStore.career"
              :min="0"
            />
          </div>

          <div class="wage-wrapper">
            <div class="wage-label">
              <ion-text color="dark">
                희망일당
              </ion-text>
            </div>

            <ion-grid>
              <ion-row class="ion-align-items-center">
                <ion-col>
                  <ion-item>
                    <ion-label position="stacked">
                      최소
                    </ion-label>

                    <ion-input
                      v-model="workerModificationStore.minWage"
                      type="number"
                      placeholder="금액 입력(원)"
                    />
                  </ion-item>
                </ion-col>

                <ion-col size="1" class="ion-text-center">
                  <ion-text color="dark">
                    ~
                  </ion-text>
                </ion-col>

                <ion-col>
                  <ion-item>
                    <ion-label position="stacked">
                      최대
                    </ion-label>

                    <ion-input
                      v-model="workerModificationStore.maxWage"
                      type="number"
                      placeholder="금액 입력(원)"
                    />
                  </ion-item>
                </ion-col>
              </ion-row>
            </ion-grid>
          </div>

          <ion-item>
            <ion-label position="stacked">
              시공 가능 지역
            </ion-label>

            <ion-textarea
              :value="workerModificationStore.joinedDistricts"
              readonly
              auto-grow
              placeholder="시공 가능 지역을 선택해주세요. (다중선택)"
              @click="() => { setDistrictModalOpen(true) }"
            />
          </ion-item>

          <div class="certificate-image-wrapper">
            <div class="certificat-image-label">
              <ion-text color="dark">
                건설업 기초안전보건교육 이수증
              </ion-text>
            </div>

            <van-uploader
              v-model="workerModificationStore.certificateImage"
              class="certificate-image"
              :max-count="1"
              :after-read="afterReadCertificatImage"
            />
          </div>
        </ion-list>
      </div>

      <ion-modal
        css-class="district-modification-modal"
        :is-open="isDistrictModalOpened"
        @didDismiss="setDistrictModalOpen(false)"
      >
        <DistrictSelect
          v-model="workerModificationStore.districts"
          :multiple="true"
          :all-selectable="true"
          clearable
        />
      </ion-modal>

      <ion-modal
        css-class="worker-modification-leave-confirm-modal"
        :is-open="uiStore.isWorkerModificationLeaveConfirmModalOpened"
        @didDismiss="() => {
          uiStore.$patch({
            isWorkerModificationLeaveConfirmModalOpened: false,
          });
        }"
      >
        <div class="modal-content">
          <div class="modal-description">
            <ion-text color="dark">
              수정 중인 내용이 삭제됩니다. 프로필 수정을 그만하시겠습니까?
            </ion-text>
          </div>

          <div class="actions">
            <ion-button
              expand="block"
              @click="() => {
                uiStore.$patch({
                  isWorkerModificationLeaveConfirmModalOpened: false,
                });

                workerModificationStore.$reset();

                router.back();
              }"
            >
              확인
            </ion-button>

            <ion-button
              expand="block"
              fill="outline"
              @click="() => {
                uiStore.$patch({
                  isWorkerModificationLeaveConfirmModalOpened: false,
                });
              }"
            >
              취소
            </ion-button>
          </div>
        </div>
      </ion-modal>

      <ion-loading
        :is-open="workerModificationStore.isUpdating"
        message="수정중..."
      />
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonButton, IonContent, IonLoading,
  IonList, IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption, IonModal, IonGrid, IonRow, IonCol, IonText,
} from '@ionic/vue';
import { Uploader as VanUploader, Stepper as VanStepper, UploaderFileListItem } from 'vant';
import firebase from 'firebase/app';

import { FIELDS } from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { uploadFile } from '@kim-pro-git/carrot-reboot-service';
import { DistrictSelect } from '@/containers';
import { useWorkerModificationStore, useUiStore } from '@/store';
import { useModal } from '@/hooks';

const router = useRouter();

const workerModificationStore = useWorkerModificationStore();

const uiStore = useUiStore();

const {
  isOpened: isDistrictModalOpened,
  setOpen: setDistrictModalOpen,
} = useModal();

/* eslint-disable no-param-reassign */
const afterReadProfileImage = async (readedFile: UploaderFileListItem | UploaderFileListItem[]) => {
  const fileItem: UploaderFileListItem = Array.isArray(readedFile) ? readedFile[0] : readedFile;

  if (!fileItem.file) {
    return;
  }

  fileItem.status = 'uploading';
  fileItem.message = '업로드중...';

  try {
    fileItem.url = await uploadFile(firebase.storage(), fileItem.file, 'workerProfileImages');

    fileItem.status = 'done';
    fileItem.message = '';
  } catch (e) {
    console.log(e);

    fileItem.status = 'failed';
    fileItem.message = '업로드 실패';
  }
};

/* eslint-disable no-param-reassign */
const afterReadCertificatImage = async (readedFile: UploaderFileListItem | UploaderFileListItem[]) => {
  const fileItem: UploaderFileListItem = Array.isArray(readedFile) ? readedFile[0] : readedFile;

  if (!fileItem.file) {
    return;
  }

  fileItem.status = 'uploading';
  fileItem.message = '업로드중...';

  try {
    fileItem.url = await uploadFile(firebase.storage(), fileItem.file, 'certificateImages');

    fileItem.status = 'done';
    fileItem.message = '';
  } catch (e) {
    console.log(e);

    fileItem.status = 'failed';
    fileItem.message = '업로드 실패';
  }
};

const onClickSubmit = async () => {
  await workerModificationStore.updateWorker();

  workerModificationStore.$reset();

  router.back();
};
</script>

<style lang="scss" scoped>
ion-item, .profile-image-wrapper, .career-wrapper, .certificate-image-wrapper {
  margin-bottom: 32px;
}

ion-item {
  --padding-start: 0;
}

.profile-image-label, .career-label, .certificat-image-label {
  margin-bottom: 8px;
}

.profile-image {
  --van-uploader-size: 120px;
  --van-uploader-icon-size: 76px;

  & :deep(.van-uploader__upload), & :deep(.van-uploader__preview) {
    margin: 0;
  }

  // & :deep(.van-uploader__upload), & :deep(.van-uploader__preview-image) {
  //   border-radius: 50%;
  // }
}

.certificate-image {
  --van-uploader-icon-size: 76px;
  --van-uploader-delete-icon-size: 36px;

  & :deep(.van-uploader__upload), & :deep(.van-uploader__preview), & :deep(.van-uploader__preview-image) {
    margin: 0;
    width: 328px;
    height: 207px;
  }
}

.modal-content {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  .modal-description {
    text-align: center;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80%;
  }

  .actions {
    width: 100%
  }
}
</style>
