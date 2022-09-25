<template>
  <ion-progress-bar v-if="isFirstFetching" type="indeterminate" />

  <div v-else class="review-list-wrapper">
    <ion-text>
      <h4 class="ion-padding-horizontal">후기</h4>
    </ion-text>

    <van-empty v-if="isEmpty" image="error" description="등록된 후기가 없습니다." />

    <van-cell-group v-else class="review-list">
      <van-cell v-for="(review, index) in reviews" :key="index" class="review">
        <div class="score-and-meta">
          <van-rate
            v-model="review.score"
            read-only
            allow-half
          />

          <ion-text class="meta" color="medium">
            <span class="create-date">{{ review.createdAt.toLocaleDateString() }}</span>
            <span class="writer-name">{{ review.client.name }}</span>
          </ion-text>
        </div>

        <div v-if="review.images.length > 0" class="images">
          <ion-thumbnail
            v-for="(image, index) in review.images"
            :key="index"
            class="image"
            @click="() => { ImagePreview({ images: review.images, startPosition: index, closeable: true }) }"
          >
            <ion-img
              :src="image ? getResizedImageUrl(image) : defaultProfileImage"
              @ion-error="onError($event, image)"
            />
          </ion-thumbnail>
        </div>

        <div class="description">
          <ion-text color="dark">{{ review.description }}</ion-text>
        </div>
      </van-cell>
    </van-cell-group>

    <ion-infinite-scroll
      :disabled="isInfiniteDisabled"
      threhold="100px"
      @ion-infinite="infiniteFetch"
    >
      <ion-infinite-scroll-content />
    </ion-infinite-scroll>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  IonText, IonThumbnail, IonImg, IonInfiniteScroll, IonInfiniteScrollContent, IonProgressBar,
} from '@ionic/vue';
import {
  CellGroup as VanCellGroup, Cell as VanCell, Rate as VanRate, ImagePreview, Empty as VanEmpty,
} from 'vant';

import { Review, getWorkerReviews } from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { useInfiniteScroll } from '@/hooks';
import defaultProfileImage from '@/assets/profileImage.svg';
import { getResizedImageUrl } from '@/utils';

const route = useRoute();

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

const infiniteFetch = async (e: CustomEvent) => {
  try {
    await fetch(getWorkerReviews(
      route.params.workerId as string,
      currentCursor.value,
    ));
  } finally {
    (e.target as any).complete();
  }
};

onMounted(async () => {
  await fetch(getWorkerReviews(
    route.params.workerId as string,
    currentCursor.value,
  ));
});
</script>

<style lang="scss" scoped>
.review-list-wrapper {
  min-height: 50vh;
  padding: 16px 0;
  margin-bottom: 60px;

  .review-list {

    .review {

      .score-and-meta {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 8px;

        .meta {
          font-size: 11px;

          .create-date {
            margin-right: 4px;
          }
        }
      }

      .images {
        display: flex;
        overflow: scroll;
        margin-bottom: 8px;

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
    }
  }
}
</style>
