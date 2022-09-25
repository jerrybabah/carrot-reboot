<template>
  <div>
    <ion-progress-bar v-if="recruitsStore.isContractsFirstFetching" type="indeterminate" />

    <div v-else class="list">
      <van-empty v-if="recruitsStore.isContractsEmpty" image="error" description="체결된 기술자가 없습니다." />

      <van-cell-group v-else class="worker" v-for="(contract, index) in recruitsStore.contracts" :key="index">
        <van-cell clickable :to="{ name: ROUTE_NAMES.WORKER, params: { workerId: contract.worker.id } }">
          <div class="content">
            <ion-thumbnail class="left">
              <ion-img
                :src="contract.worker.profileImage ? getResizedImageUrl(contract.worker.profileImage) : defaultProfileImage"
                @ion-error="onError($event, contract.worker.profileImage)"
              />
            </ion-thumbnail>

            <div class="right">
              <div class="specialties">
                <ion-chip class="specialty" v-for="(specialty, index) in contract.worker.specialties" :key="index" color="primary">
                  {{ specialty }}
                </ion-chip>
              </div>

              <div class="name-and-contract-time">
                <ion-text color="dark" class="name">
                  <h4 class="ion-no-margin">{{ contract.worker.name }}</h4>
                </ion-text>

                <ion-text v-if="contract.contractedAt" class="contract-time" color="medium">
                  <UseTimeAgo v-slot="{ timeAgo }" :time="contract.contractedAt" :messages="KOREAN_TIME_AGO_MSGS">
                    {{ timeAgo }}
                  </UseTimeAgo>
                </ion-text>
              </div>

              <div v-if="contract.worker.reviewCount > 0" class="review">
                <van-rate
                  class="review-score"
                  v-model="contract.worker.averageScore"
                  readonly
                  allow-half
                />

                <ion-text class="review-count" color="dark">
                  <ion-text class="label" color="medium">후기</ion-text>
                  {{ contract.worker.reviewCount }}개
                </ion-text>
              </div>

              <div class="wage-and-contract">
                <ion-text class="wage" color="dark">
                  <ion-text class="label" color="medium">희망일당</ion-text>
                  {{ Math.floor(contract.worker.minWage / 10000) }} ~ {{ Math.floor(contract.worker.maxWage / 10000) }}만원
                </ion-text>

                <ion-text class="contract" color="dark">
                  <ion-text class="label" color="medium">체결</ion-text>
                  {{ contract.worker.contractCount }}건
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
                recruitsStore.selectRecruit(contract);

                uiStore.$patch({
                  isContactModalOpened: true,
                });
              }"
            >
              <ion-row class="ion-align-items-center">
                <ion-label>연락하기</ion-label>
                <noti-badge v-if="contract.haveUnreadChatsByClient" />
              </ion-row>
            </ion-button>
          </template>

          <template #value>
            <ion-button
              fill="clear"
              size="small"
              expand="full"
              :disabled="contract.isReviewed"
              @click="() => { onClickReview(contract); }"
            >
              {{ contract.isReviewed ? '후기 등록완료' : '후기쓰기' }}
            </ion-button>
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <ion-infinite-scroll
      :disabled="recruitsStore.isContractsInfiniteDisabled"
      threhold="100px"
      @ion-infinite="infiniteFetch"
    >
      <ion-infinite-scroll-content />
    </ion-infinite-scroll>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import {
  IonThumbnail, IonImg, IonButton, IonChip, IonText, IonProgressBar, IonInfiniteScroll, IonInfiniteScrollContent, IonRow, IonLabel,
} from '@ionic/vue';
import {
  CellGroup as VanCellGroup, Cell as VanCell, Rate as VanRate, Empty as VanEmpty,
} from 'vant';
import { UseTimeAgo } from '@vueuse/components';

import { Recruit } from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { ROUTE_NAMES } from '@/router';
import { useRecruitsStore, useUiStore, useWorksStore } from '@/store';
import { NotiBadge } from '@/components';
import { getResizedImageUrl } from '@/utils';
import defaultProfileImage from '@/assets/profileImage.svg';
import { KOREAN_TIME_AGO_MSGS } from '@/config';

const router = useRouter();

const recruitsStore = useRecruitsStore();

const uiStore = useUiStore();

const worksStore = useWorksStore();

/* eslint-disable no-param-reassign */
const onError = (event: CustomEvent, profileImage: string | null) => {
  if ((event.target as any).src === profileImage) {
    return;
  }
  (event.target as any).src = profileImage;
};

const infiniteFetch = async (e: CustomEvent) => {
  try {
    await recruitsStore.fetchContracts();
  } finally {
    (e.target as any).complete();
  }
};

const onClickReview = (recruit: Recruit) => {
  if (!worksStore.isSelected) {
    return;
  }

  recruitsStore.selectRecruit(recruit);

  router.push({
    name: ROUTE_NAMES.REVIEW_CREATION,
    params: {
      workId: worksStore.selectedWork!.id,
      recruitId: recruitsStore.selectedRecruit!.id,
    },
  });
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

        .name-and-contract-time {

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
