<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" default-href="/createWork/step4" />
        </ion-buttons>

        <ion-title>작업 요청서 작성</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-progress-bar :value="1" />

      <div class="ion-padding">
        <ion-text color="dark">
          <h1 class="ion-margin-bottom">작업 내용을 알려주세요.</h1>
        </ion-text>

        <ion-list class="ion-margin-bottom">
          <ion-item mode="md">
            <ion-label position="stacked" mode="md">제목</ion-label>
            <ion-input
              v-model="workCreationStore.title"
              placeholder="제목 입력"
              mode="md"
            />
          </ion-item>

          <ion-item mode="md">
            <ion-label position="stacked" mode="md">세부 내용</ion-label>
            <ion-textarea
              v-model="workCreationStore.description"
              placeholder="세부 작업 내용 입력"
              mode="md"
              auto-grow
              rows="10"
            />
          </ion-item>
        </ion-list>

        <van-uploader
          v-model="workCreationStore.images"
          class="ion-margin-bottom"
          multiple
          :max-count="10"
          :after-read="afterRead"
        />

        <ion-button
          :disabled="!workCreationStore.isTitleInputed || !workCreationStore.isDescriptionInputed || workCreationStore.isImagesUploading"
          expand="block"
          @click="() => { onClickComplete(); }"
        >
          완료
        </ion-button>

        <ion-loading
          :is-open="workCreationStore.isCreatingWork"
          message="등록중..."
        />
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonButton,
  IonProgressBar, IonText, IonList, IonItem, IonInput, IonLabel, IonTextarea, IonLoading,
} from '@ionic/vue';
import { Uploader as VanUploader, UploaderFileListItem } from 'vant';
import firebase from 'firebase/app';

import { createRecruit } from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { uploadFile } from '@kim-pro-git/carrot-reboot-service';
import { useWorkCreationStore } from '@/store';

const router = useRouter();

const workCreationStore = useWorkCreationStore();

/* eslint-disable no-param-reassign */
const afterRead = (readedFiles: UploaderFileListItem | UploaderFileListItem[]) => {
  const fileItems: UploaderFileListItem[] = Array.isArray(readedFiles) ? readedFiles : [readedFiles];

  Promise.all(fileItems.map(async (fileItem) => {
    if (!fileItem.file) {
      return;
    }

    fileItem.status = 'uploading';
    fileItem.message = '업로드중...';

    try {
      fileItem.url = await uploadFile(firebase.storage(), fileItem.file, 'works');

      fileItem.status = 'done';
      fileItem.message = '';
    } catch (e) {
      console.log(e);

      fileItem.status = 'failed';
      fileItem.message = '업로드 실패';
    }
  }));
};

const onClickComplete = async () => {
  const createdWork = await workCreationStore.createWork();

  if (workCreationStore.isWorkerSelected) {
    await createRecruit(
      createdWork.id,
      workCreationStore.selectedWorker!.id,
      true,
    );
  }

  workCreationStore.$reset();

  router.go(-5);
};
</script>

<style lang="scss" scoped>
</style>
