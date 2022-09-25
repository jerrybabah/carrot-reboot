<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" default-href="/signup/step4" />
        </ion-buttons>

        <ion-title>프로필 설정</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-progress-bar :value="1" />

      <div class="ion-padding">
        <ion-text color="dark">
          <h1>건설업 기초안전보건교육 이수증 사진을 업로드해주세요.</h1>
        </ion-text>

        <div class="certificate-image-wrapper">
          <van-uploader
            v-model="workerSigninStore.certificateImage"
            class="certificate-image"
            :max-count="1"
            :after-read="afterRead"
          />
        </div>

        <ion-button
          :disabled="workerSigninStore.isCertificateImageUploading || !workerSigninStore.isCertificateImageUploaded || workerSigninStore.isCreatingWorker || myStore.isLoggingIn || isNavigating"
          expand="block"
          @click="() => { onClickStart(); }"
        >
          완료
        </ion-button>

        <ion-loading
          :is-open="workerSigninStore.isCreatingWorker || myStore.isLoggingIn || isNavigating"
          message="회원가입중..."
        />
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
  IonProgressBar, IonText, IonButton, IonLoading,
} from '@ionic/vue';
import { Uploader as VanUploader, UploaderFileListItem } from 'vant';
import firebase from 'firebase/app';
import { Capacitor } from '@capacitor/core';

import { uploadFile } from '@kim-pro-git/carrot-reboot-service';
import { useWorkerSigninStore, useMyStore } from '@/store';
import { ROUTE_NAMES } from '@/router';
import { addPushNotificationEventsListener } from '@/utils';

const router = useRouter();

const workerSigninStore = useWorkerSigninStore();

const myStore = useMyStore();

const isNavigating = ref(false);

/* eslint-disable no-param-reassign */
const afterRead = async (readedFile: UploaderFileListItem | UploaderFileListItem[]) => {
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

const onClickStart = async () => {
  workerSigninStore.$patch({
    isCreatingWorker: true,
  });

  myStore.$patch({
    isLoggingIn: true,
  });

  isNavigating.value = true;

  await workerSigninStore.createWorker();

  await myStore.login(workerSigninStore.token!);

  await router.push({ name: ROUTE_NAMES.HOME });

  isNavigating.value = false;

  if (Capacitor.isNativePlatform()) {
    myStore.updateRegistrationTokenIfChanged(); // 비동기
    addPushNotificationEventsListener();
  }
};
</script>

<style lang="scss" scoped>
.certificate-image-wrapper {
  padding: 32px 0;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  align-items: center;

  .certificate-image {
    --van-uploader-icon-size: 76px;
    --van-uploader-delete-icon-size: 36px;

    & :deep(.van-uploader__upload), & :deep(.van-uploader__preview), & :deep(.van-uploader__preview-image) {
      margin: 0;
      width: 328px;
      height: 207px;
    }
  }
}
</style>
