<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" default-href="/portfolios" />
        </ion-buttons>

        <ion-title>
          포트폴리오 추가
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="ion-padding ion-vertical-margin">
        <ion-list>
          <div class="images">
            <div class="images-label">
              <ion-text color="dark">
                사진
              </ion-text>
            </div>

            <van-uploader
              v-model="portfolioCreationStore.images"
              multiple
              :max-count="10"
              :after-read="afterRead"
            />
          </div>

          <ion-item mode="md" class="description">
            <ion-label position="stacked">
              내용
            </ion-label>

            <ion-textarea
              v-model="portfolioCreationStore.description"
              placeholder="작업물 사진과 관련된 설명을 입력해주세요."
              auto-grow
              rows="10"
            />
          </ion-item>
        </ion-list>

        <div class="btn-wrapper">
          <ion-button
            expand="block"
            :disabled="!portfolioCreationStore.isCompleted || portfolioCreationStore.isImagesUploading"
            @click="onClickSubmit"
          >
            완료
          </ion-button>
        </div>
      </div>

      <ion-loading
        :is-open="portfolioCreationStore.isCreating"
        message="포트폴리오 등록중..."
      />
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonTextarea, IonText, IonButton, IonLoading,
} from '@ionic/vue';
import { Uploader as VanUploader, UploaderFileListItem } from 'vant';
import firebase from 'firebase/app';

import { uploadFile } from '@kim-pro-git/carrot-reboot-service';
import { usePortfolioCreationStore, usePortfoliosStore } from '@/store';

const router = useRouter();

const portfolioCreationStore = usePortfolioCreationStore();

const portfoliosStore = usePortfoliosStore();

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
      fileItem.url = await uploadFile(firebase.storage(), fileItem.file, 'portfolios');

      fileItem.status = 'done';
      fileItem.message = '';
    } catch (e) {
      console.log(e);

      fileItem.status = 'failed';
      fileItem.message = '업로드 실패';
    }
  }));
};

const onClickSubmit = async () => {
  await portfolioCreationStore.createPortfolio();

  portfoliosStore.$reset();
  portfoliosStore.fetchPortfolios(); // async

  portfolioCreationStore.$reset();

  router.back();
};
</script>

<style lang="scss" scoped>
.images {
  margin-bottom: 16px;

  .images-label {
    margin-bottom: 8px;
  }
}

.description {
  --padding-start: 0;

  margin-bottom: 16px;
}

.btn-wrapper {
  width: 100%;
}
</style>
