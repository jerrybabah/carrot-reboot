<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" :default-href="`/workers${worker ? `?field=${worker.specialties[0]}` : ''}`" />
        </ion-buttons>

        <ion-title>기술자 상세정보</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="main">
      <ion-progress-bar v-if="isFetching" type="indeterminate" />

      <div v-else>
        <van-empty v-if="worker === null" image="error" description="기술자를 찾지 못했습니다." />

        <div v-else>
          <div class="worker-info">
            <div class="base-info">
              <ion-thumbnail class="left">
                <ion-img
                  :src="worker.profileImage ? getResizedImageUrl(worker.profileImage) : defaultProfileImage"
                  @ion-error="onError($event, worker?.profileImage || '')"
                />
              </ion-thumbnail>

              <div class="right">
                <div class="specialties">
                  <ion-chip v-for="(specialty, index) in worker.specialties" class="specialty" :key="index" color="primary">
                    {{ specialty }}
                  </ion-chip>
                </div>

                <div class="name-and-career">
                  <ion-text color="dark">
                    <h3 class="name">{{ worker.name }}</h3>
                  </ion-text>

                  <ion-text class="career" color="dark">
                    <ion-text class="label" color="medium">경력</ion-text>{{ worker.career }}년
                  </ion-text>
                </div>

                <div class="review-info">
                  <van-rate
                    class="review-score"
                    v-model="worker.averageScore"
                    readonly
                    allow-half
                  />

                  <ion-text class="review-count" color="dark">
                    <ion-text class="label" color="medium">후기</ion-text>{{ worker.reviewCount }}개
                  </ion-text>
                </div>
              </div>
            </div>

            <div class="ion-margin-top more-info">
              <ion-grid class="ion-no-padding">
                <ion-row class="ion-margin-bottom">
                  <ion-col size="3">
                    <ion-text color="medium">희망일당</ion-text>
                  </ion-col>

                  <ion-col>
                    <ion-text color="dark">
                      {{ Math.floor(worker.minWage / 10000)}} ~ {{ Math.floor(worker.maxWage / 10000)}}만원
                    </ion-text>
                  </ion-col>
                </ion-row>

                <ion-row class="ion-margin-bottom">
                  <ion-col size="3">
                    <ion-text color="medium">체결</ion-text>
                  </ion-col>

                  <ion-col>
                    <ion-text color="dark">
                      {{ worker.contractCount }}건
                    </ion-text>
                  </ion-col>
                </ion-row>
              </ion-grid>

              <ion-grid class="districts ion-no-padding">
                <ion-row class="districts-label">
                  <ion-col>
                    <ion-text color="medium">시공 가능 지역</ion-text>
                  </ion-col>
                </ion-row>

                <ion-row v-for="(smallDistricts, largeDistrict, index) in worker.districts" :key="index" class="district-group">
                  <ion-col class="large-district" size="2">
                    <ion-text color="dark">{{ largeDistrict }} -</ion-text>
                  </ion-col>

                  <ion-col>
                    <ion-text color="dark">
                      <span v-if="smallDistricts.length === DISTRICTS[largeDistrict].length">전체</span>
                      <span v-else v-for="(smallDistrict, index) in smallDistricts" :key="index">
                        {{ smallDistrict }}<span v-if="index + 1 < smallDistricts.length">, </span>
                      </span>
                    </ion-text>
                  </ion-col>
                </ion-row>
              </ion-grid>

              <div class="description">
                <div class="description-label">
                  <ion-text color="medium">자기 소개</ion-text>
                </div>

                <div class="description-value-wrapper">
                  <ion-text color="dark">
                    <p
                      class="description-value"
                      :class="{'description-value-folded': isDescFolded }"
                      ref="descriptionTemp"
                    >
                      {{ worker.description }}
                    </p>
                  </ion-text>
                </div>

                <div v-if="is3LineExceeded" class="description-more">
                  <ion-button
                    size="small"
                    fill="clear"
                    @click="() => { isDescFolded = !isDescFolded }"
                  >
                    {{ isDescFolded ? '더보기' : '접기' }}
                    <ion-icon slot="end" :icon="chevron" />
                  </ion-button>
                </div>
              </div>
            </div>
          </div>

          <ion-item-divider class="segments" color="white" sticky>
            <ion-segment
              v-model="uiStore.worker.segment"
              mode="md"
            >
              <ion-segment-button value="review">
                <ion-label>후기 ({{ worker.reviewCount }}개)</ion-label>
              </ion-segment-button>

              <ion-segment-button value="portfolio">
                <ion-label>실제 작업물 ({{ worker.portfolioCount }}개)</ion-label>
              </ion-segment-button>
            </ion-segment>
          </ion-item-divider>

          <WorkerReviewList :class="{ 'ion-hide': uiStore.worker.segment !== 'review' }" />

          <WorkerPortfolioList :class="{ 'ion-hide': uiStore.worker.segment !== 'portfolio' }" />
        </div>
      </div>

      <ion-row v-if="worker !== null && worker.isActive" class="fixed-buttons" slot="fixed">
        <ion-col class="favorite-wrapper" size="2">
          <ion-button
            class="favorite"
            expand="full"
            :disabled="isFavoriting"
            @click="onClickFavorite"
          >
            <ion-icon :icon="heart" slot="start" />
            {{ worker.favoriterCount }}
          </ion-button>
        </ion-col>

        <ion-col class="offer-wrapper" size="10">
          <ion-button
            class="offer"
            expand="full"
            @click="() => {
              if (!myStore.isLoggedIn) {
                uiStore.$patch({
                  isLoginRequiredModalOpened: true,
                });
                return;
              }

              setWorkSelectionModalOpen(true);
            }"
          >
            작업 요청
          </ion-button>
        </ion-col>
      </ion-row>

      <ion-modal
        css-class="work-selection-modal"
        :is-open="isWorkSelectionModalOpened"
        @didDismiss="() => { setWorkSelectionModalOpen(false) }"
      >
        <div class="work-selection-modal-content">
          <div class="select">
            <div class="select-title">
              <ion-text color="dark">
                <h4>작업 요청서를 선택해주세요.</h4>
              </ion-text>
            </div>

            <div class="select-description">
              <ion-text color="dark">선택한 요청서가 기술자에게 전달됩니다.</ion-text>
            </div>

            <div class="works">
              <van-empty v-if="worksStore.isRecruitingEmpty" class="empty" image="error" description="작성한 작업 요청서가 없습니다." />

              <ion-list v-else class="work-list">
                <ion-radio-group v-model="worksStore.selectedWork">
                  <ion-item v-for="(work, index) in worksStore.recruitingWorks" :key="index" class="work">
                    <ion-radio slot="start" :value="work" />
                    <ion-label>
                      <div class="field-wrapper">
                        <ion-chip class="field" color="primary">{{ work.field }}</ion-chip>
                      </div>
                      <div class="title-wrapper">
                        <ion-text class="title" color="dark">{{ work.title }}</ion-text>
                      </div>
                    </ion-label>
                  </ion-item>
                </ion-radio-group>
              </ion-list>
            </div>

            <div class="select-work">
              <ion-button
                expand="block"
                @click="() => {
                  offerWork()
                    .then(() => {
                      setWorkSelectionModalOpen(false);
                    });
                }"
              >
                선택한 요청서 전달하기
              </ion-button>
            </div>
          </div>

          <div class="create">
            <div class="create-title">
              <ion-text color="dark">
                <h6>작업 요청서를 새로 작성하시겠습니까?</h6>
              </ion-text>
            </div>

            <div class="create-description">
              <ion-text color="dark">작성이 완료되면 작성한 요청서가 기술자에게 <ion-text color="danger"><strong>자동으로</strong></ion-text> 전달됩니다.</ion-text>
            </div>

            <ion-button
              fill="clear"
              @click="() => {
                setWorkSelectionModalOpen(false);

                workCreationStore.selectWorker(worker);

                if (workCreationStore.isInputed) {
                  uiStore.$patch({
                    isWorkCreationModalOpened: true,
                  });
                  return;
                }

                router.push({ name: ROUTE_NAMES.WORK_CREATION_STEP1 })
              }"
            >
              새로운 요청서 작성하기
            </ion-button>
          </div>
        </div>
      </ion-modal>

      <ion-loading
        :is-open="isOfferingWork"
        message="요청중..."
      />
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import {
  defineProps, ref, onMounted, computed,
} from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent, IonProgressBar, IonModal, IonList, IonItem, IonRadioGroup, IonRadio,
  IonSegment, IonSegmentButton, IonLabel, IonItemDivider, IonThumbnail, IonImg, IonChip, IonText, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonLoading,
} from '@ionic/vue';
import { heart as heartFilled, heartOutline } from 'ionicons/icons';
import { Rate as VanRate, Empty as VanEmpty } from 'vant';

import {
  Worker, DISTRICTS,
  getWorker, createRecruit, checkFavoriteWorker, createFavoriteWorker, deleteFavoriteWorker,
  OfferAlreadyExist, ApplicationAlreadyExist, ContractAlreadyExist,
} from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { WorkerReviewList, WorkerPortfolioList } from '@/containers';
import {
  useUiStore, useWorksStore, useWorkCreationStore, useMyStore,
} from '@/store';
import { ROUTE_NAMES } from '@/router';
import { useModal, useFoldableDesc } from '@/hooks';
import { toast, getResizedImageUrl } from '@/utils';
import defaultProfileImage from '@/assets/profileImage.svg';

const props = defineProps<{
  workerId: string,
}>();

const router = useRouter();

const uiStore = useUiStore();

const worksStore = useWorksStore();

const workCreationStore = useWorkCreationStore();

const myStore = useMyStore();

/* eslint-disable no-param-reassign */
const onError = (event: CustomEvent, profileImage: string | null) => {
  if ((event.target as any).src === profileImage) {
    return;
  }
  (event.target as any).src = profileImage;
};

const {
  isOpened: isWorkSelectionModalOpened,
  setOpen: setWorkSelectionModalOpen,
} = useModal();

const {
  descriptionTemp,
  is3LineExceeded,
  isDescFolded,
  chevron,
} = useFoldableDesc();

const isFetching = ref(true);

const worker = ref<Worker | null>(null);

const isFavorite = ref(false);

const isFavoriting = ref(false);

const heart = computed<string>(() => (isFavorite.value ? heartFilled : heartOutline));

const onClickFavorite = async () => {
  if (!worker.value) {
    return;
  }

  if (!myStore.isLoggedIn) {
    uiStore.$patch({
      isLoginRequiredModalOpened: true,
    });
    return;
  }

  isFavoriting.value = true;

  const beforeIsFavorited = isFavorite.value;

  /**
   * 즐겨찾기가 돼있었다면.
   */
  if (beforeIsFavorited) {
    isFavorite.value = false;
    worker.value.favoriterCount -= 1;

    try {
      await deleteFavoriteWorker(
        myStore.currentUser!.id,
        props.workerId,
      );
    } catch (e) {
      console.log(e);

      isFavorite.value = true;
      worker.value.favoriterCount += 1;
    }
  /**
   * 즐겨찾기가 안돼있었다면.
   */
  } else {
    isFavorite.value = true;
    worker.value.favoriterCount += 1;

    try {
      await createFavoriteWorker(
        myStore.currentUser!.id,
        props.workerId,
      );
    } catch (e) {
      console.log(e);

      isFavorite.value = false;
      worker.value.favoriterCount -= 1;
    }
  }

  isFavoriting.value = false;
};

const isOfferingWork = ref(false);

const offerWork = async () => {
  if (!worksStore.isSelected) {
    toast('선택된 작업 요청서가 없습니다. 작업 요청서를 선택해주세요.');
    return;
  }

  isOfferingWork.value = true;

  let message: string;

  try {
    await createRecruit(
      worksStore.selectedWork!.id,
      worker.value!.id,
      true,
    );

    message = '작업요청이 완료되었습니다';
  } catch (e) {
    if (e instanceof OfferAlreadyExist) {
      message = '해당 작업요청서로 이미 작업요청을 했습니다.';
    } else if (e instanceof ApplicationAlreadyExist) {
      message = '기술자가 해당 작업요청서로 지원한 이력이 있습니다. 구인현황의 지원 목록을 확인해주세요.';
    } else if (e instanceof ContractAlreadyExist) {
      message = '기술자가 해당 작업요청서에 체결되어 있습니다. 구인현황의 체결 목록을 확인해주세요.';
    } else {
      message = '작업요청에 실패했습니다. 다시 시도해주세요.';
      console.log(e);
    }
  }

  isOfferingWork.value = false;

  toast(message);
};

onMounted(async () => {
  try {
    [
      worker.value,
      isFavorite.value,
    ] = await Promise.all(
      [
        getWorker(props.workerId),
        (async (): Promise<boolean> => {
          if (!myStore.isLoggedIn) {
            return false;
          }

          const isFavoriteWorker = await checkFavoriteWorker(
            myStore.currentUser!.id,
            props.workerId,
          );

          return isFavoriteWorker;
        })(),
      ],
    );
  } finally {
    isFetching.value = false;
  }

  if (!worksStore.isSelected && !worksStore.isRecruitingEmpty) {
    worksStore.selectWork(worksStore.recruitingWorks[0]);
  }
});
</script>

<style lang="scss" scoped>
.worker-info {
  padding: 16px;
  border-bottom: 1px solid var(--ion-color-light);

  .base-info {
    display: flex;
    align-items: center;

    .left {
      --size: 100px;

      margin-right: 16px;
      border: 1px solid var(--ion-color-light);
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
    }

    .right {
      flex-grow: 1;

      .label {
        margin-right: 4px;
      }

      .specialties {

        .specialty {
          margin: 0 4px 4px 0;
          padding: 0 8px;
          height: 24px;
          font-size: 12px;
        }
      }

      .name-and-career {
        display: flex;
        align-items: baseline;
        margin-bottom: 4px;

        .name {
          margin: 0 8px 0 0;
        }
      }

      .review-info {
        display: flex;
        align-items: center;

        .review-score {
          margin-right: 8px;
        }
      }
    }
  }

  .more-info {

    .districts {
      margin-bottom: 16px;

      .districts-label {
        margin-bottom: 8px;
      }

      .district-group {
        margin-bottom: 4px;

        .large-district {
          font-weight: 600;
        }
      }
    }

    .description {

      .description-label {
        margin-bottom: 8px;
      }

      .description-value-wrapper {

        .description-value {
          margin: 0;
          line-height: 20px;

          &-folded {
            max-height: 60px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
        }
      }

      .description-more {
        display: flex;
        flex-direction: row-reverse;

        ion-button {
          margin: 0;
          padding: 0;
        }
      }
    }
  }
}

.segments {
  box-shadow: 0 8px 8px rgba(0, 0, 0, .04);
}

.fixed-buttons {
  padding: 0;
  width: 100vw;
  bottom: 0;
  background-color: var(--ion-background-color, #fff);

  .favorite-wrapper {
    padding: 0;
    padding-right: 1px;

    .favorite {
      margin: 0;
      font-size: 12px;
      height: 100%;
    }
  }

  .offer-wrapper {
    padding: 0;

    .offer {
      margin: 0;
    }
  }
}

.work-selection-modal-content {
  padding: 16px;
  overflow: scroll;

  .select {
    display: flex;
    flex-direction: column;
    align-items: center;

    .select-title {
      text-align: center;
    }

    .select-description {
      text-align: center;
    }

    .works {
      width: calc(100% + 32px);
      height: 200px;
      overflow: scroll;
      margin: 16px 0;
      border-top: 1px solid var(--ion-color-medium);
      border-bottom: 1px solid var(--ion-color-medium);

      .empty {
        --van-empty-padding: 0;
        --van-empty-image-size: 100px;
        --van-empty-description-padding: 0;

        height: 100%;
      }

      .work-list {

        .work {

          .field-wrapper {
            margin-bottom: 4px;

            .field {
              margin: 0 4px 0 0;
              padding: 0 8px;
              height: 24px;
              font-size: 12px;
            }
          }

          .title-wrapper {

            .title {
              font-size: 14px;
            }
          }
        }
      }
    }

    .select-work {
      width: 100%;
    }
  }

  .create {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 12px;

    .create-title {
      text-align: center;
    }

    .create-description {
      text-align: center;
      font-size: 13px;
    }
  }
}
</style>
