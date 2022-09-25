<template>
  <div>
    <ion-progress-bar v-if="recruitsStore.isOffersFirstFetching" type="indeterminate" />

    <div v-else class="list">
      <van-empty v-if="recruitsStore.isOffersEmpty" image="error" description="요청한 기술자가 없습니다." />

      <van-cell-group v-else class="worker" v-for="(offer, index) in recruitsStore.offers" :key="index">
        <van-cell clickable :to="{ name: ROUTE_NAMES.WORKER, params: { workerId: offer.worker.id } }">
          <div class="content">
            <ion-thumbnail class="left">
              <ion-img
                :src="offer.worker.profileImage ? getResizedImageUrl(offer.worker.profileImage) : defaultProfileImage"
                @ion-error="onError($event, offer.worker.profileImage)"
              />
            </ion-thumbnail>

            <div class="right">
              <div class="specialties">
                <ion-chip class="specialty" v-for="(specialty, index) in offer.worker.specialties" :key="index" color="primary">
                  {{ specialty }}
                </ion-chip>
              </div>

              <div class="name-and-offer-time">
                <ion-text class="name" color="dark">
                  <h4 class="ion-no-margin">{{ offer.worker.name }}</h4>
                </ion-text>

                <ion-text class="offer-time" color="medium">
                  <UseTimeAgo v-slot="{ timeAgo }" :time="offer.createdAt" :messages="KOREAN_TIME_AGO_MSGS">
                    {{ timeAgo }}
                  </UseTimeAgo>
                </ion-text>
              </div>

              <div v-if="offer.worker.reviewCount > 0" class="review">
                <van-rate
                  class="review-score"
                  v-model="offer.worker.averageScore"
                  readonly
                  allow-half
                />

                <ion-text class="review-count" color="dark">
                  <ion-text class="label" color="medium">후기</ion-text>
                  {{ offer.worker.reviewCount }}개
                </ion-text>
              </div>

              <div class="wage-and-contract">
                <ion-text class="wage" color="dark">
                  <ion-text class="label" color="medium">희망일당</ion-text>
                  {{ Math.floor(offer.worker.minWage / 10000) }} ~ {{ Math.floor(offer.worker.maxWage / 10000) }}만원
                </ion-text>

                <ion-text class="contract" color="dark">
                  <ion-text class="label" color="medium">체결</ion-text>
                  {{ offer.worker.contractCount }}건
                </ion-text>
              </div>
            </div>
          </div>
        </van-cell>

        <van-cell
          class="action"
          title-class="recruit-status"
          value-class="worker-searching"
        >
          <template #title>
            <ion-button
              fill="clear"
              size="small"
              expand="full"
              @click="() => {
                recruitsStore.selectRecruit(offer);

                uiStore.$patch({
                  isContactModalOpened: true,
                });
              }"
            >
              연락하기
            </ion-button>
          </template>

          <template #value>
            <ion-button
              fill="clear"
              size="small"
              expand="full"
              @click="() => {
                recruitsStore.selectRecruit(offer);

                uiStore.$patch({
                  isContractModalOpened: true,
                });
              }"
            >
              체결하기
            </ion-button>
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <ion-infinite-scroll
      :disabled="recruitsStore.isOffersInfiniteDisabled"
      threhold="100px"
      @ion-infinite="infiniteFetch"
    >
      <ion-infinite-scroll-content />
    </ion-infinite-scroll>
  </div>
</template>

<script lang="ts" setup>
import {
  IonThumbnail, IonImg, IonButton, IonChip, IonText, IonProgressBar, IonInfiniteScroll, IonInfiniteScrollContent,
} from '@ionic/vue';
import {
  CellGroup as VanCellGroup, Cell as VanCell, Rate as VanRate, Empty as VanEmpty,
} from 'vant';
import { UseTimeAgo } from '@vueuse/components';

import { ROUTE_NAMES } from '@/router';
import { useRecruitsStore, useUiStore } from '@/store';
import { getResizedImageUrl } from '@/utils';
import defaultProfileImage from '@/assets/profileImage.svg';
import { KOREAN_TIME_AGO_MSGS } from '@/config';

const recruitsStore = useRecruitsStore();

const uiStore = useUiStore();

/* eslint-disable no-param-reassign */
const onError = (event: CustomEvent, profileImage: string | null) => {
  if ((event.target as any).src === profileImage) {
    return;
  }
  (event.target as any).src = profileImage;
};

const infiniteFetch = async (e: CustomEvent) => {
  try {
    await recruitsStore.fetchOffers();
  } finally {
    (e.target as any).complete();
  }
};
</script>

<style lang="scss" scoped>
.list {
  padding-top: 8px;

  .worker {
    margin-bottom: 16px;

    .content {
      display: flex;
      align-items: center;

      .left {
        --size: 80px;

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

        .name-and-offer-time {
          .name {
            display: inline-block;
            margin-right: 8px;
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
      }
    }

    .action {
      padding: var(--van-cell-vertical-padding) 0;

      ion-button {
        flex: 1;
        margin: 0;
        height: 1.5em;
      }

      & :deep(.recruit-status) {
        border-right: 1px solid var(--van-cell-border-color);
        display: flex;
        justify-content: center;
        align-items: center;
      }

      & :deep(.worker-searching) {
        display: flex;
        justify-content: center;
        align-items: center
      }
    }
  }
}
</style>
