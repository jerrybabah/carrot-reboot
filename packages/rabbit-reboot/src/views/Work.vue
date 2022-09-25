<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" :default-href="`/works${work ? `?field=${work.field}` : ''}`" />
        </ion-buttons>

        <ion-title>일자리 상세</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-progress-bar v-if="isFetching" type="indeterminate" />

      <div v-else>
        <van-empty v-if="work === null" image="error" description="일자리를 찾지 못했습니다." />

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
                <h4 class="ion-no-margin"><ion-text color="danger" class="contract-mark">{{ work.isContracted ? '(구인완료) ' : '' }}</ion-text> {{ work.title }}</h4>
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

      <ion-row v-if="!isFetching && work && !(work.isContracted && !recruit)" class="fixed-button" slot="fixed">
        <ion-col class="apply-wrapper">
          <ion-button
            class="apply"
            :disabled="actionText === '수락 대기중'"
            expand="full"
            @click="() => {
              onClickAction();
            }"
          >
            {{ actionText }}
          </ion-button>
        </ion-col>
      </ion-row>

      <ion-modal
        css-class="apply-modal"
        :is-open="uiStore.isApplyModalOpened"
        @didDismiss="() => {
          uiStore.$patch({
            isApplyModalOpened: false,
          });
        }"
      >
        <div class="modal-content">
          <div class="modal-description">
            <ion-text color="dark">
              '{{ work ? work.title : '일자리' }}'에 지원하시겠습니까?
            </ion-text>
          </div>

          <div class="actions">
            <ion-button
              expand="block"
              @click="() => {
                onClickApply();
              }"
            >
              지원
            </ion-button>

            <ion-button
              expand="block"
              fill="outline"
              @click="() => {
                uiStore.$patch({
                  isApplyModalOpened: false,
                });
              }"
            >
              취소
            </ion-button>
          </div>
        </div>
      </ion-modal>

      <ion-modal
        css-class="inactive-modal"
        :is-open="uiStore.isInactiveModalOpened"
        @didDismiss="() => {
          uiStore.$patch({
            isInactiveModalOpened: false,
          });
        }"
      >
        <div class="modal-content">
          <div class="modal-description">
            <ion-text color="dark">
              최소 월 2만원의 이용료를 지불하고 일자리에 지원하거나, 작업요청을 받아보세요!
            </ion-text>
          </div>

          <div class="actions">
            <ion-button
              expand="block"
              @click="() => {
                uiStore.$patch({
                  isInactiveModalOpened: false,
                });

                // TODO: 결제 페이지 보내기
              }"
            >
              이용권 구입하기
            </ion-button>
          </div>
        </div>
      </ion-modal>

      <ion-loading
        :is-open="isApplying"
        message="지원중..."
      />
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import {
  defineProps, ref, computed, onMounted,
} from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonModal, IonLoading, IonThumbnail,
  IonSlides, IonSlide, IonChip, IonText, IonImg, IonIcon, IonGrid, IonRow, IonCol, IonProgressBar, IonButton,
} from '@ionic/vue';
import { calendarOutline, locationOutline } from 'ionicons/icons';
import { Empty as VanEmpty, ImagePreview } from 'vant';
import dayjs from 'dayjs';

import {
  Work, Recruit,
  getWork, getRecruitByPKs, createRecruit,
} from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { useMyStore, useUiStore, useJobSearchStore } from '@/store';
import defaultProfileImage from '@/assets/profileImage.svg';
import { getResizedImageUrl } from '@/utils';

const props = defineProps<{
  workId: string,
}>();

const myStore = useMyStore();

const uiStore = useUiStore();

const jobSearchStore = useJobSearchStore();

/* eslint-disable no-param-reassign */
const onError = (event: CustomEvent, profileImage: string | null) => {
  if ((event.target as any).src === profileImage) {
    return;
  }
  (event.target as any).src = profileImage;
};

const isFetching = ref(false);

const work = ref<Work | null>(null);

const recruit = ref<Recruit | null>(null);

const actionText = computed<string>(() => {
  if (!myStore.isLoggedIn || !recruit.value) {
    return '지원하기';
  }

  if (recruit.value.isContracted || recruit.value.isOffered || recruit.value.isAccepted) {
    return '연락하기';
  }

  return '수락 대기중';
});

const onClickAction = () => {
  /**
   * 로그인 안됨 -> 로그인 모달 열기
   * 로그인 됨, 지원 -> 결제 또는 지원 모달 열기
   * 연락 -> recruit 선택, 연락 모달 열기
   * 그 외 -> 반응 안함 (버튼 비활)
   */
  if (!myStore.isLoggedIn) {
    uiStore.$patch({
      isLoginRequiredModalOpened: true,
    });
    return;
  }

  if (actionText.value === '지원하기') {
    if (!myStore.currentUser!.isActive) {
      uiStore.$patch({
        isInactiveModalOpened: true,
      });
      return;
    }

    uiStore.$patch({
      isApplyModalOpened: true,
    });
    return;
  }

  if (actionText.value === '연락하기') {
    jobSearchStore.selectRecruit(recruit.value);

    uiStore.$patch({
      isContactModalOpened: true,
    });
  }
};

const isApplying = ref(false);

const apply = async () => {
  if (!myStore.isLoggedIn) {
    return;
  }

  isApplying.value = true;

  try {
    await createRecruit(
      work.value!.id,
      myStore.currentUser!.id,
      false,
    );
  } finally {
    isApplying.value = false;
  }
};

const onClickApply = async () => {
  await apply();

  uiStore.$patch({
    isApplyModalOpened: false,
  });

  isFetching.value = true;

  try {
    recruit.value = await getRecruitByPKs(
      work.value!.id,
      myStore.currentUser!.id,
    );
  } finally {
    isFetching.value = false;
  }

  jobSearchStore.$patch({
    applications: [
      recruit.value!,
      ...jobSearchStore.applications,
    ],
  });
};

onMounted(async () => {
  isFetching.value = true;

  if (myStore.isLoggedIn) {
    try {
      [work.value, recruit.value] = await Promise.all([
        getWork(props.workId),
        getRecruitByPKs(props.workId, myStore.currentUser!.id),
      ]);
    } finally {
      isFetching.value = false;
    }
  } else {
    try {
      work.value = await getWork(props.workId);
    } finally {
      isFetching.value = false;
    }
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

    .contract-mark {
      font-weight: normal;
    }
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

.fixed-button {
  padding: 0;
  width: 100vw;
  bottom: 0;

  .apply-wrapper {
    padding: 0;

    .apply {
      margin: 0;
    }
  }
}

.modal-content {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  .modal-description {
    text-align: center;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80%;
  }

  .actions {
    width: 100%
  }
}
</style>
