<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" default-href="/reviews" />
        </ion-buttons>

        <ion-title>후기 수정</ion-title>

        <ion-buttons slot="end">
          <ion-button
            :disabled="!reviewModificationStore.isChanged || !reviewModificationStore.isCompleted || reviewModificationStore.isImagesUploading"
            @click="onClickSubmit"
          >
            완료
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="ion-padding ion-margin-vertical">
        <ion-list>
          <div class="score">
            <div class="label">
              <ion-text color="dark">
                별점
              </ion-text>
            </div>

            <van-rate
              v-model="reviewModificationStore.score"
              :size="24"
            />
          </div>

          <ion-item class="description">
            <ion-label position="stacked">
              내용
            </ion-label>

            <ion-textarea
              v-model="reviewModificationStore.description"
              placeholder="시공 내용, 기술자 등에 대한 솔직한 후기를 남겨주세요."
              auto-grow
              rows="10"
            />
          </ion-item>

          <div class="images">
            <div class="label">
              <ion-text color="dark">
                현장사진
              </ion-text>
            </div>

            <van-uploader
              v-model="reviewModificationStore.images"
              multiple
              :max-count="10"
              :after-read="afterRead"
            />
          </div>
        </ion-list>
      </div>

      <ion-modal
        css-class="review-modification-leave-confirm-modal"
        :is-open="uiStore.isReviewModificationLeaveConfirmModalOpened"
        @didDismiss="() => {
          uiStore.$patch({
            isReviewModificationLeaveConfirmModalOpened: false,
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
                  isReviewModificationLeaveConfirmModalOpened: false,
                });

                reviewModificationStore.$reset();

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
                  isReviewModificationLeaveConfirmModalOpened: false,
                });
              }"
            >
              취소
            </ion-button>
          </div>
        </div>
      </ion-modal>

      <ion-loading
        :is-open="reviewModificationStore.isUpdating"
        message="수정중..."
      />
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonButton, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonTextarea, IonText, IonModal, IonLoading,
} from '@ionic/vue';
import { Rate as VanRate, Uploader as VanUploader, UploaderFileListItem } from 'vant';
import firebase from 'firebase/app';

import { uploadFile } from '@kim-pro-git/carrot-reboot-service';
import { useReviewModificationStore, useUiStore } from '@/store';

const router = useRouter();

const reviewModificationStore = useReviewModificationStore();

const uiStore = useUiStore();

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
      fileItem.url = await uploadFile(firebase.storage(), fileItem.file, 'reviews');

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
  await reviewModificationStore.updateReview();

  reviewModificationStore.$reset();

  router.back();
};
</script>

<style lang="scss" scoped>
.score, .description, .images {
  margin-bottom: 16px;

  .label {
    margin-bottom: 8px;
  }
}

.description {
  --padding-start: 0;
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
