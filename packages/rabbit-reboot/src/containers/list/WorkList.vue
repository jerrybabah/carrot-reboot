<template>
  <ion-refresher slot="fixed" @ionRefresh="refresh">
    <ion-refresher-content />
  </ion-refresher>

  <div class="filter">
    <ion-select
      v-model="uiStore.works.filter.largeDistricts"
      @update:model-value="() => {
        initInfiniteState();

        firstFetch();
      }"
      multiple
      ok-text="완료"
      cancel-text="취소"
      placeholder="전국"
      interface="alert"
      :interface-options="{
        header: '지역선택 (최대 10개)',
      }"
    >
      <ion-select-option
        v-for="(_, largeDistrict, index) in DISTRICTS"
        :key="index"
        :value="largeDistrict"
      >
        {{ largeDistrict }}
      </ion-select-option>
    </ion-select>
  </div>

  <ion-progress-bar v-if="isFirstFetching" type="indeterminate" />

  <div v-else class="list">
    <van-empty v-if="isEmpty" image="error" description="일자리를 찾지 못했습니다." />

    <van-cell-group v-else class="work" v-for="(work, index) in works" :key="index">
      <van-cell class="content" clickable :to="{ name: ROUTE_NAMES.WORK, params: { workId: work.id } }">
        <div class="create-time-wrapper">
          <ion-text class="create-time" color="medium">
            <UseTimeAgo v-slot="{ timeAgo }" :time="work.createdAt" :messages="KOREAN_TIME_AGO_MSGS">
              {{ timeAgo }}
            </UseTimeAgo>
          </ion-text>
        </div>

        <div class="title">
          <ion-chip v-if="work.isContracted" color="danger">구인완료</ion-chip>
          <ion-text :color="work.isContracted ? 'medium' : 'dark'">
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

        <div class="required-worker-wages">
          <ion-text color="dark">
            <ion-text class="required-worker-wages-label" color="medium">일당</ion-text>
            <span v-for="(requiredWorkerInfo, index) in work.requiredWorkers" :key="index">
              {{ Math.floor(requiredWorkerInfo.wage / 10000) }}만원<span v-if="index + 1 < work.requiredWorkers.length">, </span>
            </span>
          </ion-text>
        </div>
      </van-cell>
    </van-cell-group>
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
import { useRoute } from 'vue-router';
import {
  IonSelect, IonSelectOption, IonProgressBar, IonRefresher, IonRefresherContent, IonChip,
} from '@ionic/vue';
import { calendarOutline, locationOutline } from 'ionicons/icons';
import {
  Empty as VanEmpty, CellGroup as VanCellGroup, Cell as VanCell,
} from 'vant';
import dayjs from 'dayjs';
import { UseTimeAgo } from '@vueuse/components';

import {
  Work, DISTRICTS,
  getWorksGroupByField,
} from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { useUiStore } from '@/store';
import { useInfiniteScroll } from '@/hooks';
import { ROUTE_NAMES } from '@/router';
import { KOREAN_TIME_AGO_MSGS } from '@/config';

const route = useRoute();

const uiStore = useUiStore();

const {
  currentCursor,
  isInfiniteDisabled,
  items: works,
  isEmpty,
  isFirstFetching,
  initInfiniteState,
  fetch,
} = useInfiniteScroll<Work>();

const firstFetch = async () => {
  await fetch(getWorksGroupByField(
    route.query.field as string,
    {
      address1s: uiStore.works.filter.largeDistricts,
    },
    currentCursor.value,
  ));
};

const infiniteFetch = async (event: CustomEvent) => {
  try {
    await fetch(getWorksGroupByField(
      route.query.field as string,
      {
        address1s: uiStore.works.filter.largeDistricts,
      },
      currentCursor.value,
    ));
  } finally {
    (event.target as any).complete();
  }
};

const refresh = async (event: CustomEvent) => {
  initInfiniteState();

  try {
    await firstFetch();
  } finally {
    (event.target as any).complete();
  }
};

onMounted(async () => {
  await firstFetch();
});
</script>

<style lang="scss" scoped>
.filter {
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  padding: 4px 16px;
  display: flex;

  ion-select {
    --placeholder-opacity: 1;

    display: flex;
    padding: 0 10px;
    font-size: 13px;
    height: 2.1em;
    border: 1px solid var(--ion-color-primary);
    border-radius: 64px;

    &::part(text), &::part(placeholder), &::part(icon) {
      color: var(--ion-color-primary)
    }
  }
}

.list {

  .work {
    margin-bottom: 16px;

    .content {

      .create-time-wrapper {

        .create-time {

        }
      }

      .title {
        margin-bottom: 4px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;

        ion-chip {
          margin: 4px 8px 4px 0;
          padding: 0 8px;
          height: 24px;
          font-size: 12px;
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
