<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" default-href="/portfolios" />
        </ion-buttons>

        <ion-title>
          포트폴리오 수정
        </ion-title>

        <ion-buttons slot="end">
          <ion-button
            :disabled="!portfolioModificationStore.isChanged || !portfolioModificationStore.isComplete || portfolioModificationStore.isImagesUploading"
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
          <div class="images">
            <div class="images-label">
              <ion-text color="dark">
                사진
              </ion-text>
            </div>

            <van-uploader
              v-model="portfolioModificationStore.images"
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
              v-model="portfolioModificationStore.description"
              placeholder="작업물 사진과 관련된 설명을 입력해주세요."
              auto-grow
              rows="10"
            />
          </ion-item>
        </ion-list>
      </div>

      <ion-modal
        css-class="portfolio-modification-confirm-modal"
        :is-open="uiStore.isPortfolioModificationConfirmModalOpened"
        @didDismiss="() => {
          uiStore.$patch({
            isPortfolioModificationConfirmModalOpened: false,
          });
        }"
      >
        <div class="modal-content">
          <div class="modal-description">
            <ion-text color="dark">
              수정 중인 내용이 삭제됩니다. 후기 수정을 그만하시겠습니까?
            </ion-text>
          </div>

          <div class="actions">
            <ion-button
              expand="block"
              @click="() => {
                uiStore.$patch({
                  isPortfolioModificationConfirmModalOpened: false,
                });

                portfolioModificationStore.$reset();

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
                  isPortfolioModificationConfirmModalOpened: false,
                });
              }"
            >
              취소
            </ion-button>
          </div>
        </div>
      </ion-modal>

      <ion-loading
        :is-open="portfolioModificationStore.isUpdating"
        message="수정중..."
      />
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonTextarea, IonText, IonButton, IonModal, IonLoading,
} from '@ionic/vue';
import { Uploader as VanUploader, UploaderFileListItem } from 'vant';
import firebase from 'firebase/app';

import { uploadFile } from '@kim-pro-git/carrot-reboot-service';
import {
  usePortfolioModificationStore, useUiStore, usePortfoliosStore,
} from '@/store';

const router = useRouter();

const portfolioModificationStore = usePortfolioModificationStore();

const uiStore = useUiStore();

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
  await portfolioModificationStore.updatePortfolio();

  portfoliosStore.$reset();
  portfoliosStore.fetchPortfolios(); // async

  portfolioModificationStore.$reset();

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
