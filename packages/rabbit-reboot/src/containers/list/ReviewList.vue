<template>
  <van-empty v-if="!myStore.isLoggedIn" description="잘못된 접근입니다. 로그인을 먼저 해주세요." />

  <div v-else>
    <ion-progress-bar v-if="isFirstFetching" type="indeterminate" />

    <div v-else class="list">
      <van-empty v-if="isEmpty" image="error" description="작성된 후기가 없습니다." />

      <van-cell-group
        class="review"
        v-else
        v-for="(review, index) in reviews"
        :key="index"
      >
        <van-cell
          value-class="content"
        >
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
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonButton, IonChip, IonText, IonIcon, IonProgressBar, IonThumbnail, IonImg,
  IonInfiniteScroll, IonInfiniteScrollContent,
} from '@ionic/vue';
import { chevronForward } from 'ionicons/icons';
import {
  CellGroup as VanCellGroup, Cell as VanCell, Empty as VanEmpty, Rate as VanRate, ImagePreview,
} from 'vant';

import { Review, getWorkerReviews } from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { useMyStore } from '@/store';
import { useInfiniteScroll } from '@/hooks';
import { ROUTE_NAMES } from '@/router';
import { getResizedImageUrl } from '@/utils';
import defaultProfileImage from '@/assets/profileImage.svg';

const router = useRouter();

const myStore = useMyStore();

/* eslint-disable no-param-reassign */
const onError = (event: CustomEvent, profileImage: string | null) => {
  if ((event.target as any).src === profileImage) {
    return;
  }
  (event.target as any).src = profileImage;
};

const {
  currentCursor,
  isInfiniteDisabled,
  items: reviews,
  isEmpty,
  isFirstFetching,
  fetch,
} = useInfiniteScroll<Review>();

const firstFetch = async () => {
  if (!myStore.isLoggedIn) {
    return;
  }

  await fetch(getWorkerReviews(
    myStore.currentUser!.id,
    currentCursor.value,
  ));
};

const infiniteFetch = async (event: CustomEvent) => {
  if (!myStore.isLoggedIn) {
    return;
  }

  try {
    await fetch(getWorkerReviews(
      myStore.currentUser!.id,
      currentCursor.value,
    ));
  } finally {
    (event.target as any).complete();
  }
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
</style>
