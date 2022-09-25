<template>
  <div>
    <ion-progress-bar v-if="recruitsStore.isApplicationsFirstFetching" type="indeterminate" />

    <div v-else class="list">
      <van-empty v-if="recruitsStore.isApplicationsEmpty" image="error" description="지원한 기술자가 없습니다." />

      <van-cell-group v-else class="worker" v-for="(application, index) in recruitsStore.applications" :key="index">
        <van-cell clickable :to="{ name: ROUTE_NAMES.WORKER, params: { workerId: application.worker.id } }">
          <div class="content">
            <ion-thumbnail class="left">
              <ion-img
                :src="application.worker.profileImage ? getResizedImageUrl(application.worker.profileImage) : defaultProfileImage"
                @ion-error="onError($event, application.worker.profileImage)"
              />
            </ion-thumbnail>

            <div class="right">
              <div class="specialties">
                <ion-chip class="specialty" v-for="(specialty, index) in application.worker.specialties" :key="index" color="primary">
                  {{ specialty }}
                </ion-chip>
              </div>

              <div class="name-and-apply-time">
                <ion-text class="name" color="dark">
                  <h4 class="ion-no-margin">{{ application.worker.name }}</h4>
                </ion-text>

                <ion-text class="apply-time" color="medium">
                  <UseTimeAgo v-slot="{ timeAgo }" :time="application.createdAt" :messages="KOREAN_TIME_AGO_MSGS">
                    {{ timeAgo }}
                  </UseTimeAgo>
                </ion-text>
              </div>

              <div v-if="application.worker.reviewCount > 0" class="review">
                <van-rate
                  class="review-score"
                  v-model="application.worker.averageScore"
                  readonly
                  allow-half
                />

                <ion-text class="review-count" color="dark">
                  <ion-text class="label" color="medium">후기</ion-text>
                  {{ application.worker.reviewCount }}개
                </ion-text>
              </div>

              <div class="wage-and-contract">
                <ion-text class="wage" color="dark">
                  <ion-text class="label" color="medium">희망일당</ion-text>
                  {{ Math.floor(application.worker.minWage / 10000) }} ~ {{ Math.floor(application.worker.maxWage / 10000) }}만원
                </ion-text>

                <ion-text class="contract" color="dark">
                  <ion-text class="label" color="medium">체결</ion-text>
                  {{ application.worker.contractCount }}건
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
                recruitsStore.selectRecruit(application);

                uiStore.$patch({
                  isContactModalOpened: true,
                });
              }"
            >
              <ion-row class="ion-align-items-center">
                <ion-label>연락하기</ion-label>
                <noti-badge v-if="application.haveUnreadChatsByClient" />
              </ion-row>
            </ion-button>
          </template>

          <template #value>
            <ion-button
              fill="clear"
              size="small"
              expand="full"
              @click="() => {
                recruitsStore.selectRecruit(application);

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
      :disabled="recruitsStore.isApplicationsInfiniteDisabled"
      threhold="100px"
      @ion-infinite="infiniteFetch"
    >
      <ion-infinite-scroll-content />
    </ion-infinite-scroll>
  </div>
</template>

<script lang="ts" setup>
import {
  IonThumbnail, IonImg, IonButton, IonChip, IonText, IonProgressBar, IonInfiniteScroll, IonInfiniteScrollContent, IonLabel, IonRow,
} from '@ionic/vue';
import {
  CellGroup as VanCellGroup, Cell as VanCell, Rate as VanRate, Empty as VanEmpty,
} from 'vant';
import { UseTimeAgo } from '@vueuse/components';

import { useRecruitsStore, useUiStore } from '@/store';
import { ROUTE_NAMES } from '@/router';
import { NotiBadge } from '@/components';
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
    await recruitsStore.fetchApplications();
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

        .name-and-apply-time {
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
