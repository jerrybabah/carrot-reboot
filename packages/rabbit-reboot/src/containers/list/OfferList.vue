<template>
  <div>
    <van-empty v-if="!myStore.isLoggedIn" description="로그인을 먼저 해주세요.">
      <ion-button
        fill="clear"
        @click="() => {
          router.push({ name: ROUTE_NAMES.LOGIN })
        }"
      >
        로그인 하러가기
      </ion-button>
    </van-empty>

    <div v-else>
      <ion-progress-bar v-if="jobSearchStore.isOffersFirstFetching" type="indeterminate" />

      <div v-else class="list">
        <van-empty v-if="jobSearchStore.isOffersEmpty" image="error" description="기술자님에게 요청한 일자리가 없습니다." />

        <van-cell-group v-else class="work" v-for="(offer, index) in jobSearchStore.offers" :key="index">
          <van-cell class="content" clickable :to="{ name: ROUTE_NAMES.WORK, params: { workId: offer.work.id } }">
            <div class="field-and-offer-time">
              <ion-chip class="field" color="primary">
                {{ offer.work.field }}
              </ion-chip>

              <ion-text class="offer-time" color="medium">
                <UseTimeAgo v-slot="{ timeAgo }" :time="offer.createdAt" :messages="KOREAN_TIME_AGO_MSGS">
                  {{ timeAgo }}
                </UseTimeAgo>
              </ion-text>
            </div>

            <div class="title">
              <ion-text color="dark">
                <h4 class="ion-no-margin">
                  <ion-text color="danger" class="contract-mark">{{ offer.work.isContracted ? '(구인완료)' : '' }}</ion-text>
                  {{ offer.work.title }}
                </h4>
              </ion-text>
            </div>

            <div class="date-range">
              <ion-text color="dark">
                <ion-text color="medium">
                  <ion-icon :icon="calendarOutline" />
                </ion-text>
                {{
                  dayjs(offer.work.startDate).isSame(offer.work.endDate, 'date')
                    ? dayjs(offer.work.startDate).format('YYYY.MM.DD(dd)')
                    : `${dayjs(offer.work.startDate).format('YYYY.MM.DD(dd)')} ~ ${dayjs(offer.work.endDate).format('YYYY.MM.DD(dd)')}`
                }}
              </ion-text>
            </div>

            <div class="address">
              <ion-text color="dark">
                <ion-text color="medium">
                  <ion-icon :icon="locationOutline" />
                </ion-text>
                {{ offer.work.address1 }} {{ offer.work.address2 }} {{ offer.work.addressDetail || '' }}
              </ion-text>
            </div>

            <div class="required-worker-wages">
              <ion-text color="dark">
                <ion-text class="required-worker-wages-label" color="medium">일당</ion-text>
                <span v-for="(requiredWorkerInfo, index) in offer.work.requiredWorkers" :key="index">
                  {{ Math.floor(requiredWorkerInfo.wage / 10000) }}만원<span v-if="index + 1 < offer.work.requiredWorkers.length">, </span>
                </span>
              </ion-text>
            </div>
          </van-cell>

          <van-cell class="action">
            <ion-button
              fill="clear"
              size="small"
              expand="full"
              @click="() => {
                jobSearchStore.selectRecruit(offer);

                uiStore.$patch({
                  isContactModalOpened: true,
                });
              }"
            >
              <ion-row class="ion-align-items-center">
                <ion-label>연락하기</ion-label>
                <noti-badge v-if="offer.haveUnreadChatsByWorker" />
              </ion-row>
            </ion-button>
          </van-cell>
        </van-cell-group>
      </div>

      <ion-infinite-scroll
        :disabled="jobSearchStore.isOffersInfiniteDisabled"
        threhold="100px"
        @ion-infinite="infiniteFetch"
      >
        <ion-infinite-scroll-content />
      </ion-infinite-scroll>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import {
  IonProgressBar, IonInfiniteScroll, IonInfiniteScrollContent, IonChip, IonButton, IonText, IonIcon,
} from '@ionic/vue';
import { CellGroup as VanCellGroup, Cell as VanCell, Empty as VanEmpty } from 'vant';
import { calendarOutline, locationOutline } from 'ionicons/icons';
import dayjs from 'dayjs';
import { UseTimeAgo } from '@vueuse/components';

import { useJobSearchStore, useMyStore, useUiStore } from '@/store';
import { ROUTE_NAMES } from '@/router';
import { KOREAN_TIME_AGO_MSGS } from '@/config';

const router = useRouter();

const jobSearchStore = useJobSearchStore();

const myStore = useMyStore();

const uiStore = useUiStore();

const infiniteFetch = async (e: CustomEvent) => {
  try {
    await jobSearchStore.fetchOffers();
  } finally {
    (e.target as any).complete();
  }
};
</script>

<style lang="scss" scoped>
.list {
  padding-top: 8px;

  .work {
    margin-bottom: 16px;

    .content {

      .field-and-offer-time {
        margin-bottom: 4px;

        .field {
          margin: 0 4px 0 0;
          padding: 0 8px;
          height: 24px;
          font-size: 12px;
          margin-right: 8px;
        }

        .offer-time {

        }
      }

      .title {
        margin-bottom: 4px;

        .contract-mark {
          font-weight: normal;
        }
      }

      .date-range {

      }

      .address {

      }

      .required-worker-wages {

        .required-worker-wages-label {
          margin-right: 4px;
        }
      }
    }

    .action {
      padding: var(--van-cell-vertical-padding) 0;

      ion-button {
        margin: 0;
        height: 1.5em;
      }
    }
  }
}
</style>
