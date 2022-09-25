<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" default-href="/signup/step3" />
        </ion-buttons>

        <ion-title>프로필 설정</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-progress-bar :value="0.8" />

      <div class="ion-padding">
        <ion-text color="dark">
          <h1>기본 정보를 입력해주세요.</h1>
        </ion-text>

        <div class="profile-image-wrapper">
          <van-uploader
            v-model="workerSigninStore.profileImage"
            class="profile-image"
            :max-count="1"
            upload-icon="smile"
            :after-read="afterRead"
          />

          <ion-text class="ion-margin-top" color="medium">
            사진을 등록해주세요.
          </ion-text>
        </div>

        <ion-list class="ion-margin-bottom">
          <ion-item mode="md">
            <ion-label position="stacked" mode="md">이름</ion-label>
            <ion-input
              v-model="workerSigninStore.name"
              placeholder="예시) 홍길동, 김철수(성실인테리어)"
              mode="md"
            />
          </ion-item>

          <ion-item mode="md">
            <ion-label position="stacked" mode="md">자기소개</ion-label>
            <ion-textarea
              v-model="workerSigninStore.description"
              placeholder="자기 소개를 입력해주세요."
              mode="md"
              auto-grow
              rows="10"
            />
          </ion-item>
        </ion-list>

        <ion-button
          :disabled="workerSigninStore.isProfileImageUploading || !workerSigninStore.isNameInputed || !workerSigninStore.isDescriptionInputed"
          expand="block"
          @click="() => { router.push({ name: ROUTE_NAMES.SIGNUP_STEP5 }); }"
        >
          다음
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
  IonProgressBar, IonText, IonButton, IonList, IonItem, IonLabel, IonInput, IonTextarea,
} from '@ionic/vue';
import { Uploader as VanUploader, UploaderFileListItem } from 'vant';
import firebase from 'firebase/app';

import { uploadFile } from '@kim-pro-git/carrot-reboot-service';
import { useWorkerSigninStore } from '@/store';
import { ROUTE_NAMES } from '@/router';

const router = useRouter();

const workerSigninStore = useWorkerSigninStore();

/* eslint-disable no-param-reassign */
const afterRead = async (readedFile: UploaderFileListItem | UploaderFileListItem[]) => {
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
</script>

<style lang="scss" scoped>
.profile-image-wrapper {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 32px;
  padding-bottom: 16px;

  .profile-image {
    --van-uploader-size: 120px;
    --van-uploader-icon-size: 76px;

    & :deep(.van-uploader__upload), & :deep(.van-uploader__preview) {
      margin: 0;
    }

    & :deep(.van-uploader__upload), & :deep(.van-uploader__preview-image) {
      border-radius: 50%;
    }
  }
}
</style>
