<template>
  <van-empty v-if="!myStore.isLoggedIn" description="잘못된 접근입니다. 로그인을 먼저 해주세요." />

  <div v-else>
    <ion-progress-bar v-if="isFirstFetching" type="indeterminate" />

    <div v-else class="list">
      <van-empty v-if="isEmpty" image="error" description="작성한 후기가 없습니다." />

      <van-cell-group
        class="review"
        v-else
        v-for="(review, index) in reviews"
        :key="index"
      >
        <van-cell
          value-class="content"
        >
          <div class="name-and-actions">
            <div class="name-wrapper">
              <div class="name">
                <ion-text color="dark">
                  {{ review.worker.name }}
                </ion-text>
              </div>

              <ion-button
                class="name-router"
                fill="clear"
                size="small"
                color="medium"
                @click="() => { router.push({ name: ROUTE_NAMES.WORKER, params: { workerId: review.worker.id } }); }"
              >
                <ion-icon slot="icon-only" :icon="chevronForward" />
              </ion-button>
            </div>

            <div class="actions">
              <ion-button
                v-if="review.createdAt >= threeDaysAgo"
                class="update"
                fill="outline"
                shape="round"
                size="small"
                @click="() => {
                  reviewModificationStore.init(review);
                  router.push({ name: ROUTE_NAMES.REVIEW_MODIFICATION, params: { reviewId: review.id } });
                }"
              >
                수정
              </ion-button>

              <ion-button
                class="delete"
                fill="outline"
                shape="round"
                size="small"
                @click="() => {
                  selectedReview = review;
                  setReviewDeleteModalOpen(true);
                }"
              >
                삭제
              </ion-button>
            </div>
          </div>

          <div class="score-and-create-time">
            <div class="score">
              <van-rate
                v-model="review.score"
                readonly
                :size="24"
              />
            </div>

            <div class="create-time">
              <ion-text color="medium">
                {{ review.createdAt.toLocaleDateString() }}
              </ion-text>
            </div>
          </div>

          <div v-if="review.images.length > 0" class="images">
            <ion-thumbnail
              v-for="(image, index) in review.images"
              :key="index"
              class="image"
              @click="() => { ImagePreview({ images: review.images, startPosition: index, closeable: true }); }"
            >
              <ion-img
                :src="image ? getResizedImageUrl(image) : defaultProfileImage"
                @ion-error="onError($event, image)"
              />
            </ion-thumbnail>
          </div>

          <div class="description">
            <ion-text color="dark">
              {{ review.description }}
            </ion-text>
          </div>

          <div class="work-info-wrapper">
            <div class="work-info">
              <div class="field-wrapper">
                <ion-chip class="field" color="primary">
                  {{ review.work.field }}
                </ion-chip>
              </div>

              <div class="title">
                <ion-text>
                  {{ review.work.title }}
                </ion-text>
              </div>
            </div>

            <ion-button
              class="work-router"
              fill="clear"
              size="small"
              color="medium"
              @click="() => { router.push({ name: ROUTE_NAMES.WORK, params: { workId: review.work.id } }); }"
            >
              <ion-icon slot="icon-only" :icon="chevronForward" />
            </ion-button>
          </div>
        </van-cell>
      </van-cell-group>
    </div>
  </div>

  <ion-infinite-scroll
    :disabled="isInfiniteDisabled"
    threhold="100px"
    @ion-infinite="infiniteFetch"
  >
    <ion-infinite-scroll-content />
  </ion-infinite-scroll>

  <ion-modal
    css-class="review-delete-modal"
    :is-open="isReviewDeleteModalOpened"
    @didDismiss="() => {
      selectedReview = null;
      setReviewDeleteModalOpen(false);
    }"
  >
    <div class="modal-content">
      <div class="modal-description">
        <ion-text color="dark">
          후기를 삭제하시면 재작성이 불가합니다. 삭제하시겠습니까?
        </ion-text>
      </div>

      <div class="actions">
        <ion-button
          expand="block"
          @click="onClickDelete"
        >
          확인
        </ion-button>

        <ion-button
          expand="block"
          fill="outline"
          @click="() => {
            selectedReview = null;
            setReviewDeleteModalOpen(false);
          }"
        >
          취소
        </ion-button>
      </div>
    </div>
  </ion-modal>

  <ion-loading
    :is-open="isDeleting"
    message="삭제중..."
  />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonButton, IonChip, IonText, IonIcon, IonProgressBar, IonThumbnail, IonImg,
  IonInfiniteScroll, IonInfiniteScrollContent, IonModal, IonLoading,
} from '@ionic/vue';
import { chevronForward } from 'ionicons/icons';
import {
  CellGroup as VanCellGroup, Cell as VanCell, Empty as VanEmpty, Rate as VanRate, ImagePreview,
} from 'vant';

import { Review, getClientReviews, deleteReview } from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { useMyStore, useReviewModificationStore } from '@/store';
import { useInfiniteScroll, useModal } from '@/hooks';
import { ROUTE_NAMES } from '@/router';
import defaultProfileImage from '@/assets/profileImage.svg';
import { getResizedImageUrl } from '@/utils';

const router = useRouter();

const myStore = useMyStore();

const reviewModificationStore = useReviewModificationStore();

/* eslint-disable no-param-reassign */
const onError = (event: CustomEvent, profileImage: string | null) => {
  if ((event.target as any).src === profileImage) {
    return;
  }
  (event.target as any).src = profileImage;
};

const now = new Date();
const threeDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3);

const {
  isOpened: isReviewDeleteModalOpened,
  setOpen: setReviewDeleteModalOpen,
} = useModal();

const selectedReview = ref<Review | null>(null);

const {
  currentCursor,
  isInfiniteDisabled,
  items: reviews,
  isEmpty,
  isFirstFetching,
  initInfiniteState,
  fetch,
} = useInfiniteScroll<Review>();

const firstFetch = async () => {
  if (!myStore.isLoggedIn) {
    return;
  }

  await fetch(getClientReviews(
    myStore.currentUser!.id,
    currentCursor.value,
  ));
};

const infiniteFetch = async (event: CustomEvent) => {
  if (!myStore.isLoggedIn) {
    return;
  }

  try {
    await fetch(getClientReviews(
      myStore.currentUser!.id,
      currentCursor.value,
    ));
  } finally {
    (event.target as any).complete();
  }
};

const isDeleting = ref(false);

const onClickDelete = async () => {
  if (!selectedReview.value) {
    return;
  }

  isDeleting.value = true;

  try {
    await deleteReview(
      selectedReview.value.id,
    );
  } finally {
    isDeleting.value = false;
  }

  isReviewDeleteModalOpened.value = false;

  initInfiniteState();

  await firstFetch();
};

onMounted(async () => {
  await firstFetch();
});
</script>

<style lang="scss" scoped>
.list {
  padding-top: 8px;

  .review {
    margin-bottom: 16px;

    & :deep(.content) {
      display: flex;
      flex-direction: column;

      .name-and-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .name-wrapper {
          display: flex;
          align-items: center;
          overflow: hidden;

          .name {
            font-size: 1.2em;
            font-weight: 600;
            margin-right: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            ion-text {
              white-space: nowrap;
            }
          }

          .name-router {
            --padding-start: 0;
            --padding-end: 0;
          }
        }

        .actions {
          flex-shrink: 0;

          .update, .delete {
            --padding-start: 8px;
            --padding-end: 8px;

            height: 1.8em;
          }
        }
      }

      .score-and-create-time {
        display: flex;
        align-items: center;
        margin-bottom: 12px;

        .score {
          margin-right: 8px;
        }

        .create-time {
        }
      }

      .images {
        display: flex;
        overflow: scroll;
        margin-bottom: 12px;

        &::-webkit-scrollbar {
          display: none;
        }

        .image {
          --size: 60px;

          flex-shrink: 0;
          margin-right: 12px;
          border: 1px solid var(--ion-color-light);
          border-radius: 8px;
          overflow: hidden;
        }
      }

      .description {
        margin-bottom: 16px;
      }

      .work-info-wrapper {
        display: flex;
        align-items: center;
        border: 1px solid var(--ion-color-light);
        border-radius: 8px;
        padding: 8px 16px;

        .work-info {
          flex-grow: 1;

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

        .work-router {
          --padding-start: 0;
          --padding-end: 0;
        }
      }
    }
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
