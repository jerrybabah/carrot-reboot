<template>
  <ion-refresher slot="fixed" @ionRefresh="refresh">
    <ion-refresher-content />
  </ion-refresher>

  <div class="filter">
    <ion-button
      class="open-modal"
      size="small"
      fill="outline"
      shape="round"
      @click="() => { setDistrictModalOpen(true); }"
    >
      <ion-icon slot="start" :icon="locationOutline" />
      {{ parsedDistrictFilter.beautifiedDistrict }}
      <ion-icon slot="end" :icon="chevron" />
    </ion-button>

    <ion-modal
      css-class="district-modal"
      :is-open="isDistrictModalOpened"
      @didDismiss="() => { setDistrictModalOpen(false); }"
    >
      <div class="modal-content">
        <ion-button
          class="close-modal"
          fill="clear"
          color="dark"
          @click="() => { setDistrictModalOpen(false) ;}"
        >
          <ion-icon slot="icon-only" :icon="closeOutline" />
        </ion-button>

        <DistrictSelect
          v-model="districtFilter"
          @update:model-value="(payload) => {
            setDistrictModalOpen(false);

            initInfiniteState();

            firstFetch();
          }"
          clearable
        />
      </div>
    </ion-modal>
  </div>

  <ion-progress-bar v-if="isFirstFetching" type="indeterminate" />

  <div v-else>
    <van-empty v-if="isEmpty" image="error" description="기술자를 찾지 못했습니다." />

    <van-cell-group v-else class="worker-list">
      <van-cell
        v-for="(worker, index) in workers"
        :key="index"
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
          <ion-text>
            <h4 class="name">{{ worker.name }}</h4>
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

  <ion-infinite-scroll
    :disabled="isInfiniteDisabled"
    threhold="100px"
    @ion-infinite="infiniteFetch"
  >
    <ion-infinite-scroll-content />
  </ion-infinite-scroll>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  IonThumbnail, IonImg, IonChip, IonLabel, IonModal, IonButton, IonRefresher, IonRefresherContent,
  IonIcon, IonText, IonInfiniteScroll, IonInfiniteScrollContent, IonProgressBar,
} from '@ionic/vue';
import {
  closeOutline, locationOutline, chevronUp, chevronDown,
} from 'ionicons/icons';
import {
  Rate as VanRate, CellGroup as VanCellGroup, Cell as VanCell, Empty as VanEmpty,
} from 'vant';

import { SpecialtyWorker, getActiveWorkersGroupBySpecialty } from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { ROUTE_NAMES } from '@/router';
import { DistrictSelect } from '@/containers';
import { useModal, useInfiniteScroll } from '@/hooks';
import defaultProfileImage from '@/assets/profileImage.svg';
import { getResizedImageUrl, parseDistrict } from '@/utils';

const route = useRoute();

/* eslint-disable no-param-reassign */
const onError = (event: CustomEvent, profileImage: string | null) => {
  if ((event.target as any).src === profileImage) {
    return;
  }
  (event.target as any).src = profileImage;
};

const districtFilter = ref('/');

const parsedDistrictFilter = computed(() => parseDistrict(districtFilter.value));

const {
  isOpened: isDistrictModalOpened,
  setOpen: setDistrictModalOpen,
} = useModal();

const chevron = computed<string>(() => (isDistrictModalOpened.value ? chevronUp : chevronDown));

const {
  currentCursor,
  isInfiniteDisabled,
  items: workers,
  isEmpty,
  isFirstFetching,
  initInfiniteState,
  fetch,
} = useInfiniteScroll<SpecialtyWorker>();

const firstFetch = async () => {
  let filter = {};

  if (districtFilter.value !== '/') {
    filter = {
      address: {
        address1: parsedDistrictFilter.value.largeDistrict,
        address2: parsedDistrictFilter.value.smallDistrict,
      },
    };
  }

  await fetch(getActiveWorkersGroupBySpecialty(
    route.query.field as string,
    filter,
    currentCursor.value,
  ));
};

const infiniteFetch = async (event: CustomEvent) => {
  let filter = {};

  if (districtFilter.value !== '/') {
    filter = {
      address: {
        address1: parsedDistrictFilter.value.largeDistrict,
        address2: parsedDistrictFilter.value.smallDistrict,
      },
    };
  }

  try {
    await fetch(getActiveWorkersGroupBySpecialty(
      route.query.field as string,
      filter,
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
  if (route.query.district) {
    districtFilter.value = route.query.district as string;
  }

  await firstFetch();
});
</script>

<style lang="scss" scoped>
.filter {
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  padding: 4px 16px;

  .open-modal {
    --padding-start: 10px;
    --padding-end: 10px;

    margin: 0;
  }
}

.modal-content {
  position: relative;

  .close-modal {
    --padding-start: 0;
    --padding-end: 0;

    position: absolute;
    top: 0;
    right: 8px;
    height: 40px;
    margin: 0;
  }
}

.worker-list {
  padding-top: 8px;

  & :deep(.worker) {
    display: flex;
    align-items: center;

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

      .name {
        margin: 0;
        margin-bottom: 4px;
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
