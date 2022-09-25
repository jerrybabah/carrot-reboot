<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" default-href="/tabs/works" />
        </ion-buttons>

        <ion-title>작업요청 상세 정보</ion-title>

        <ion-buttons v-if="work !== null" slot="end">
          <ion-button
            @click="() => {
              if (!work) {
                return;
              }

              workModificationStore.init(work);

              router.push({ name: ROUTE_NAMES.WORK_MODIFICATION, params: { workId: props.workId } });
            }"
          >
            <ion-icon slot="icon-only" :icon="createOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-progress-bar v-if="isFetching" type="indeterminate" />

      <div v-else>
        <van-empty v-if="work === null" image="error" description="작업 요청서를 찾지 못했습니다." />

        <div v-else>
          <ion-slides
            v-if="work.images.length > 0"
            class="images"
            pager
          >
            <ion-slide v-for="(image, index) in work.images" :key="index">
              <ion-thumbnail
                class="image-wrapper"
                @click="() => {
                  if (!work) {
                    return;
                  }

                  ImagePreview({ images: work.images, startPosition: index, closeable: true });
                }"
              >
                <ion-img
                  :src="image ? getResizedImageUrl(image) : defaultProfileImage"
                  @ion-error="onError($event, image)"
                />
              </ion-thumbnail>
            </ion-slide>
          </ion-slides>

          <div class="base-info">
            <div class="field">
              <ion-chip color="primary">{{ work.field }}</ion-chip>
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
          </div>

          <div class="required-workers-info">
            <div class="required-workers-info-label">
              <ion-text color="medium">필요 인력 정보</ion-text>
            </div>

            <ion-grid class="ion-no-padding">
              <ion-row v-for="(worker, index) in work.requiredWorkers" :key="index" class="required-worker-info">
                <ion-col class="type" size="2">
                  <ion-text>{{ worker.type }}</ion-text>
                </ion-col>

                <ion-col class="wage" size="10">
                  <ion-text>{{ Math.floor(worker.wage / 10000) }}만원</ion-text>
                </ion-col>
              </ion-row>
            </ion-grid>
          </div>

          <div class="description">
            <ion-text>{{ work.description }}</ion-text>
          </div>
        </div>
      </div>

      <ion-row v-if="work" class="fixed-buttons" slot="fixed">
        <ion-col class="recruit-wrapper">
          <ion-button
            class="recruit"
            expand="full"
            @click="() => {
              worksStore.selectWork(work);

              router.push({ name: ROUTE_NAMES.RECRUITS, params: { workId: work?.id } });
            }"
          >
            구인현황
          </ion-button>
        </ion-col>

        <ion-col v-if="!work.isContracted" class="search-wrapper">
          <ion-button
            class="search"
            expand="full"
            @click="() => {
              router.push({ name: ROUTE_NAMES.WORKERS, query: { field: work?.field, district: `${work?.address1}/${work?.address2}` } });
            }"
          >
            기술자 찾기
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { defineProps, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonThumbnail,
  IonSlides, IonSlide, IonChip, IonText, IonButton, IonImg, IonIcon, IonGrid, IonRow, IonCol, IonProgressBar,
} from '@ionic/vue';
import { calendarOutline, locationOutline, createOutline } from 'ionicons/icons';
import { Empty as VanEmpty, ImagePreview } from 'vant';
import dayjs from 'dayjs';

import { Work, getWork } from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { ROUTE_NAMES } from '@/router';
import { useWorksStore, useWorkModificationStore } from '@/store';
import defaultProfileImage from '@/assets/profileImage.svg';
import { getResizedImageUrl } from '@/utils';

const props = defineProps<{
  workId: string,
}>();

const worksStore = useWorksStore();

const workModificationStore = useWorkModificationStore();

const router = useRouter();

/* eslint-disable no-param-reassign */
const onError = (event: CustomEvent, profileImage: string | null) => {
  if ((event.target as any).src === profileImage) {
    return;
  }
  (event.target as any).src = profileImage;
};

const isFetching = ref(true);

const work = ref<Work | null>(null);

onMounted(async () => {
  try {
    work.value = await getWork(props.workId);
  } finally {
    isFetching.value = false;
  }
});
</script>

<style lang="scss" scoped>
.images {
  border-bottom: 2px solid var(--ion-color-light);

  .image-wrapper {
    width: 100%;
    height: 40vh;
  }
}

.base-info {
  padding: 16px;
  border-bottom: 4px solid var(--ion-color-light);

  .field {
    margin-bottom: 4px;

    ion-chip {
      margin: 0 4px 0 0;
      padding: 0 8px;
      height: 24px;
      font-size: 12px;
    }
  }

  .title {
    margin-bottom: 4px;
  }

  .date-range {
    margin-bottom: 4px;
  }

  .address {
    margin-bottom: 4px;
  }

  .total-cost {

    .tatal-cost-label {
      margin-right: 4px;
    }
  }
}

.required-workers-info {
  padding: 16px;
  border-bottom: 4px solid var(--ion-color-light);

  .required-workers-info-label {
    margin-bottom: 12px;
  }

  .required-worker-info {
    margin-bottom: 8px;

    .wage {
      font-weight: 500;
    }
  }
}

.description {
  min-height: 500px;
  padding: 16px;
}

.fixed-buttons {
  padding: 0;
  width: 100vw;
  bottom: 0;
  background-color: var(--ion-background-color, #fff);

  .recruit-wrapper {
    padding: 0;

    .recruit {
      margin: 0;
    }
  }

  .search-wrapper {
    padding: 0;
    padding-left: 1px;

    .search {
      margin: 0;
    }
  }
}
</style>
