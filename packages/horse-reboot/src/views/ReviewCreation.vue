<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" :default-href="`/works/${props.workId}/recruits`" />
        </ion-buttons>

        <ion-title>후기 작성</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <van-empty v-if="recruitsStore.selectedRecruit && recruitsStore.selectedRecruit.isReviewed" description="후기를 이미 작성하였습니다." />

      <div v-else class="ion-padding">
        <div class="work-info">
          <div v-if="recruitsStore.selectedRecruit" class="field-wrapper">
            <ion-chip class="field" color="primary">
              {{ recruitsStore.selectedRecruit.work.field }}
            </ion-chip>
          </div>

          <div v-if="recruitsStore.selectedRecruit" class="title">
            <ion-text color="dark">
              {{ recruitsStore.selectedRecruit.work.title }}
            </ion-text>
          </div>
        </div>

        <div class="form">
          <ion-text color="dark">
            <h3 class="head">시공은 어떠셨나요?</h3>
          </ion-text>

          <div class="worker-name-wrapper">
            <div v-if="recruitsStore.selectedRecruit" class="worker-name">
              <ion-text color="dark">
                {{ recruitsStore.selectedRecruit.worker.name }}
              </ion-text>
            </div>
          </div>

          <div class="review">
            <van-rate
              v-model="reviewCreationStore.score"
              :size="44"
            />
          </div>

          <div class="score-description">
            <ion-text color="medium">{{ reviewCreationStore.scoreDescription }}</ion-text>
          </div>

          <ion-item class="description" mode="md">
            <ion-label mode="md" position="stacked">
              후기 내용
            </ion-label>
            <ion-textarea
              v-model="reviewCreationStore.description"
              mode="md"
              placeholder="시공 내용, 기술자 등에 대한 솔직한 후기를 남겨주세요."
              auto-grow
              rows="10"
            />
          </ion-item>

          <div class="images">
            <div class="images-label">
              <ion-text color="dark">현장사진</ion-text>
            </div>

            <van-uploader
              v-model="reviewCreationStore.images"
              multiple
              :max-count="10"
              :after-read="afterRead"
            />
          </div>

          <div class="btn-wrapper">
            <ion-button
              expand="block"
              :disabled="!reviewCreationStore.isCompleted || reviewCreationStore.isImagesUploading"
              @click="onClickSubmit"
            >
              완료
            </ion-button>
          </div>
        </div>
      </div>

      <ion-modal
        css-class="review-leave-confirm-modal"
        :is-open="uiStore.isReviewLeaveConfirmModalOpened"
        @didDismiss="() => {
          uiStore.$patch({
            isReviewLeaveConfirmModalOpened: false,
          });
        }"
      >
        <div class="modal-content">
          <div class="modal-description">
            <ion-text color="dark">
              작성 중인 내용이 삭제됩니다. 후기 작성을 그만하시겠습니까?
            </ion-text>
          </div>

          <div class="actions">
            <ion-button
              expand="block"
              @click="() => {
                uiStore.$patch({
                  isReviewLeaveConfirmModalOpened: false,
                });

                reviewCreationStore.$reset();

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
                  isReviewLeaveConfirmModalOpened: false,
                });
              }"
            >
              취소
            </ion-button>
          </div>
        </div>
      </ion-modal>

      <ion-loading
        :is-open="reviewCreationStore.isCreating"
        message="후기 등록중..."
      />
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { defineProps, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
  IonChip, IonText, IonItem, IonLabel, IonTextarea, IonButton, IonModal, IonLoading,
} from '@ionic/vue';
import {
  Rate as VanRate, Uploader as VanUploader, UploaderFileListItem, Empty as VanEmpty,
} from 'vant';
import firebase from 'firebase/app';

import { getWork, getRecruit } from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { uploadFile } from '@kim-pro-git/carrot-reboot-service';
import {
  useMyStore, useWorksStore, useRecruitsStore, useReviewCreationStore, useUiStore,
} from '@/store';

const props = defineProps<{
  workId: string,
  recruitId: string,
}>();

const router = useRouter();

const myStore = useMyStore();

const worksStore = useWorksStore();

const recruitsStore = useRecruitsStore();

const reviewCreationStore = useReviewCreationStore();

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
  await reviewCreationStore.createReview();

  recruitsStore.initContracsState();
  recruitsStore.fetchContracts(); // async

  reviewCreationStore.$reset();

  router.back();
};

onMounted(async () => {
  if (!myStore.isLoggedIn) {
    return;
  }

  if (!worksStore.isSelected) {
    const work = await getWork(
      props.workId,
    );

    worksStore.selectWork(work);

    uiStore.$patch({
      recruits: {
        segment: 'contract',
      },
    });
  }

  if (!recruitsStore.isSelected) {
    const recruit = await getRecruit(
      props.recruitId,
    );

    recruitsStore.selectRecruit(recruit);

    uiStore.$patch({
      recruits: {
        segment: 'contract',
      },
    });
  }
});
</script>

<style lang="scss" scoped>
.work-info {
  border: 1px solid var(--ion-color-light);
  border-radius: 8px;
  padding: 8px 16px;
  min-height: 64px;
  margin-bottom: 24px;

  .field-wrapper {
    margin-bottom: 4px;

    .field {
      margin: 0 4px 0 0;
      padding: 0 8px;
      height: 24px;
      font-size: 12px;
    }
  }

  .title {
  }
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;

  .head {
  }

  .worker-name-wrapper {
    min-height: 20px;
    margin-bottom: 10px;

    .worker-name {

    }
  }

  .review {
    margin-bottom: 8px;
  }

  .score-description {
    margin-bottom: 36px;
  }

  .description {
    --padding-start: 0;

    width: 100%;
    margin-bottom: 16px;
  }

  .images {
    width: 100%;
    margin-bottom: 16px;

    .images-label {
      font-size: 16px;
      margin-bottom: 8px;
    }
  }

  .btn-wrapper {
    width: 100%;
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
