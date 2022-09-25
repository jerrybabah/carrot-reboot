<template>
  <ion-progress-bar v-if="isFirstFetching" type="indeterminate" />

  <div v-else class="portfolio-list-wrapper">
    <ion-text>
      <h4>사진</h4>
    </ion-text>

    <van-empty v-if="isEmpty" image="error" description="등록한 작업물이 없습니다." />

    <ion-grid v-else class="ion-no-padding">
      <ion-row v-for="(rowIndex) in rowCount" :key="rowIndex" class="ion-margin-bottom">
        <ion-col
          size="4"
          v-for="(portfolio, colIndex) in portfolios.slice(3 * rowIndex - 3, 3 * rowIndex)"
          :key="colIndex"
        >
          <ion-thumbnail
            class="representative"
            @click="() => {
              isPortfolioPreviewOpened = true;
              portfolioDescription = portfolio.description;

              ImagePreview({
                images: portfolios[((rowIndex - 1) * 3) + colIndex].images,
                closeable: true,
                onClose: () => {
                  isPortfolioPreviewOpened = false;
                  portfolioDescription = null;
                },
              });
            }"
          >
            <ion-icon v-if="portfolio.images.length > 1" class="multiple" :icon="albums" />

            <ion-img
              :src="portfolio.images[0] ? getResizedImageUrl(portfolio.images[0]) : defaultProfileImage"
              @ion-error="onError($event, portfolio.images[0])"
            />
          </ion-thumbnail>
        </ion-col>
      </ion-row>
    </ion-grid>

    <ion-infinite-scroll
      :disabled="isInfiniteDisabled"
      threhold="100px"
      @ion-infinite="infiniteFetch"
    >
      <ion-infinite-scroll-content />
    </ion-infinite-scroll>

    <teleport to="body">
      <div v-if="isPortfolioPreviewOpened && portfolioDescription" class="portfolio-description-wrapper" teleport>
        <div class="portfolio-description">
          <ion-text color="dark">
            {{ portfolioDescription }}
          </ion-text>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  IonText, IonGrid, IonRow, IonCol, IonThumbnail, IonImg, IonProgressBar, IonInfiniteScroll, IonInfiniteScrollContent, IonIcon,
} from '@ionic/vue';
import { albums } from 'ionicons/icons';
import { ImagePreview, Empty as VanEmpty } from 'vant';

import { Portfolio, getWorkerPortfolios } from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
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

const isPortfolioPreviewOpened = ref(false);

const portfolioDescription = ref<string | null>(null);

const {
  currentCursor,
  isInfiniteDisabled,
  items: portfolios,
  isEmpty,
  isFirstFetching,
  fetch,
} = useInfiniteScroll<Portfolio>();

const rowCount = computed(() => Math.ceil(portfolios.length / 3));

const infiniteFetch = async (event: CustomEvent) => {
  try {
    await fetch(getWorkerPortfolios(
      route.params.workerId as string,
      currentCursor.value,
    ));
  } finally {
    (event.target as any).complete();
  }
};

onMounted(async () => {
  await fetch(getWorkerPortfolios(
    route.params.workerId as string,
    currentCursor.value,
  ));
});
</script>

<style lang="scss" scoped>
.portfolio-list-wrapper {
  min-height: 50vh;
  padding: 16px;
  margin-bottom: 60px;

  .representative {
    --size: calc((100vw - 32px) * 3 / 10);

    margin: 0 auto;
    border: 1px solid var(--ion-color-light);
    border-radius: 8px;
    overflow: hidden;
    position: relative;

    .multiple {
      color: white;
      position: absolute;
      top: 4px;
      right: 4px;
    }
  }
}

.portfolio-description-wrapper {
  position: fixed;
  background-color: transparent;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 9999;

  .portfolio-description {
    min-width: 280px;
    max-width: 768px;
    width: 90%;
    max-height: 100px;
    overflow: scroll;
    margin: 0 auto;
    background-color: white;
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
    padding: 8px 16px;
  }
}
</style>
