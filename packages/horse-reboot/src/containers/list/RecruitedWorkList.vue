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
      <div class="filter">
        <WorkStatusRadio
          v-model="worksStore.workStatusFilter"
          @update:model-value="(payload) => {
            worksStore.initRecruitedState();

            worksStore.fetchRecruiteds();
          }"
        />
      </div>

      <ion-progress-bar v-if="worksStore.isRecruitedFirstFetching" type="indeterminate" />

      <div v-else class="list">
        <van-empty v-if="worksStore.isRecruitedEmpty" image="error" description="구인완료된 작업 요청서가 없습니다." />

        <van-cell-group v-else class="work" v-for="(work, index) in worksStore.recruitedWorks" :key="index">
          <van-cell class="content" clickable :to="{ name: ROUTE_NAMES.WORK, params: { workId: work.id } }">
            <div class="fields">
              <ion-chip class="field" color="primary">
                {{ work.field }}
              </ion-chip>
            </div>

            <div class="title">
              <ion-text color="dark">
                <h4 class="ion-no-margin">{{ work.title }}</h4>
              </ion-text>
            </div>

            <div class="date-range">
              <ion-text color="dark">
                <ion-text color="medium">
                  <ion-icon :icon="calendarOutline" />
                </ion-text>
                {{
                  dayjs(work.startDate).isSame(work.endDate, 'date')
                    ? dayjs(work.startDate).format('YYYY.MM.DD(dd)')
                    : `${dayjs(work.startDate).format('YYYY.MM.DD(dd)')} ~ ${dayjs(work.endDate).format('YYYY.MM.DD(dd)')}`
                }}
              </ion-text>
            </div>

            <div class="address">
              <ion-text color="dark">
                <ion-text color="medium">
                  <ion-icon :icon="locationOutline" />
                </ion-text>
                {{ work.address1 }} {{ work.address2 }} {{ work.addressDetail || '' }}
              </ion-text>
            </div>

            <div class="total-cost">
              <ion-text color="dark">
                <ion-text class="total-cost-label" color="medium">총액</ion-text>
                {{ Math.floor(work.totalCost / 10000) }}만원
              </ion-text>
            </div>
          </van-cell>

          <van-cell
            class="action"
          >
            <ion-button
              fill="clear"
              size="small"
              expand="full"
              @click="() => {
                worksStore.selectWork(work);
                router.push({ name: ROUTE_NAMES.RECRUITS, params: { workId: work.id } });
              }"
            >
              <ion-row class="ion-align-items-center">
                <ion-label>구인현황</ion-label>
                <noti-badge v-if="work.haveUncheckedApplicants" />
              </ion-row>
            </ion-button>
          </van-cell>
        </van-cell-group>
      </div>
    </div>

    <ion-infinite-scroll
      :disabled="worksStore.isRecruitedInfiniteDisabled"
      threhold="100px"
      @ion-infinite="infiniteFetch"
    >
      <ion-infinite-scroll-content />
    </ion-infinite-scroll>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonButton, IonChip, IonText, IonIcon, IonProgressBar, IonInfiniteScroll, IonInfiniteScrollContent, IonRow, IonLabel,
} from '@ionic/vue';
import { calendarOutline, locationOutline } from 'ionicons/icons';
import { Cell as VanCell, CellGroup as VanCellGroup, Empty as VanEmpty } from 'vant';
import dayjs from 'dayjs';

import { ROUTE_NAMES } from '@/router';
import { WorkStatusRadio } from '@/containers';
import { useWorksStore, useMyStore } from '@/store';
import { NotiBadge } from '@/components';

const router = useRouter();

const worksStore = useWorksStore();

const myStore = useMyStore();

const infiniteFetch = async (e: CustomEvent) => {
  try {
    await worksStore.fetchRecruiteds();
  } finally {
    (e.target as any).complete();
  }
};

onMounted(async () => {
  if (myStore.isLoggedIn) {
    await worksStore.fetchRecruiteds();
  }
});
</script>

<style lang="scss" scoped>
.filter {
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  padding: 4px 16px;
}

.list {

  .work {
    margin-bottom: 16px;

    .content {

      .fields {
        margin-bottom: 4px;

        .field {
          margin: 0 4px 0 0;
          padding: 0 8px;
          height: 24px;
          font-size: 12px;
        }
      }

      .title {
        margin-bottom: 4px;
      }

      .total-cost {

        .total-cost-label {
          margin-right: 4px;
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
    }
  }
}
</style>
