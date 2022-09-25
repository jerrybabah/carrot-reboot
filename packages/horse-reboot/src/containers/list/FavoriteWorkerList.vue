<template>
  <van-empty v-if="!myStore.isLoggedIn" description="잘못된 접근입니다. 로그인을 먼저 해주세요." />

  <div v-else>
    <ion-progress-bar v-if="isFirstFetching" type="indeterminate" />

    <div v-else class="list">
      <van-empty v-if="isEmpty" image="error" description="즐겨찾기한 기술자가 없습니다." />

      <van-cell-group
        v-else
        v-for="(worker, index) in workers"
        :key="index"
      >
        <van-cell
          value-class="worker"
          clickable
          :to="{ name: ROUTE_NAMES.WORKER, params: { workerId: worker.workerId } }"
        >
          <ion-thumbnail class="left">
            <ion-img
              :src="worker.profileImage ? getResizedImageUrl(worker.profileImage) : defaultProfileImage"
              @ion-error="onError($event, worker.profileImage)"
            />
          </ion-thumbnail>

          <div class="right">
            <div class="specialties">
              <ion-chip class="specialty" v-for="(specialty, index) in worker.specialties" :key="index" color="primary">
                {{ specialty }}
              </ion-chip>
            </div>

            <ion-text>
              <h4 class="name">
                <ion-text v-if="!worker.isActive" class="inactive-mark" color="danger">(비활성화) </ion-text>
                <ion-text :color="worker.isActive ? 'dark' : 'medium'">{{ worker.name }}</ion-text></h4>
            </ion-text>

            <div v-if="worker.reviewCount" class="review">
              <van-rate
                v-model="worker.averageScore"
                class="review-score"
                readonly
                allow-half
              />

              <ion-text class="review-count" color="dark">
                <ion-text class="label" color="medium">후기</ion-text>{{ worker.reviewCount }}개
              </ion-text>
            </div>

            <div class="wage-and-contract">
              <ion-text class="wage" color="dark">
                <ion-text class="label" color="medium">희망일당</ion-text>{{ Math.floor(worker.minWage / 10000) }} ~ {{ Math.floor(worker.maxWage / 10000) }}만원
              </ion-text>

              <ion-text class="contract" color="dark">
                <ion-text class="label" color="medium">체결</ion-text>{{ worker.contractCount }}건
              </ion-text>
            </div>

            <div class="districts">
              <ion-chip v-for="(district, index) in worker.hugeDistricts" :key="index" class="district">
                <ion-label>{{ district }}</ion-label>
              </ion-chip>
            </div>
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
import {
  IonThumbnail, IonImg, IonText, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent, IonProgressBar,
} from '@ionic/vue';
import {
  Empty as VanEmpty, CellGroup as VanCellGroup, Cell as VanCell, Rate as VanRate,
} from 'vant';

import { FavoriteWorker, getFavoriteWorkers } from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { ROUTE_NAMES } from '@/router';
import { useInfiniteScroll } from '@/hooks';
import { useMyStore } from '@/store';
import { getResizedImageUrl } from '@/utils';
import defaultProfileImage from '@/assets/profileImage.svg';

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
  items: workers,
  isEmpty,
  isFirstFetching,
  fetch,
} = useInfiniteScroll<FavoriteWorker>();

const firstFetch = async () => {
  if (!myStore.isLoggedIn) {
    return;
  }

  await fetch(getFavoriteWorkers(
    myStore.currentUser!.id,
    currentCursor.value,
  ));
};

const infiniteFetch = async (event: CustomEvent) => {
  try {
    await fetch(getFavoriteWorkers(
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

  & :deep(.worker) {
    display: flex;
    align-items: center;

    .backdrop {
      position: absolute;
      background-color: #000;
    }

    .left {
      --size: 88px;
      margin-right: 16px;
      border: 1px solid var(--ion-color-light);
      border-radius: 50%;
      overflow: hidden;
    }

    .right {
      flex-grow: 1;

      .label {
        margin-right: 4px;
      }

      .specialties {
        margin-bottom: 4px;

        .specialty {
          margin: 0 4px 0 0;
          padding: 0 8px;
          height: 24px;
          font-size: 12px;
        }
      }

      .name {
        margin: 0;
        margin-bottom: 4px;

        .inactive-mark {
          font-weight: normal;
        }
      }

      .review {
        display: flex;
        align-items: center;

        .review-score {
          margin-right: 8px;
        }
      }

      .wage-and-contract {
        display: flex;
        align-items: center;

        .wage {
          margin-right: 8px;
        }
      }

      .districts {

        .district {
          margin: 0 4px 0 0;
          padding: 0 8px;
          height: 24px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
