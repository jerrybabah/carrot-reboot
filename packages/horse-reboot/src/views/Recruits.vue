<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" default-href="/tabs/works" />
        </ion-buttons>

        <ion-title>{{ worksStore.selectedWork ? worksStore.selectedWork.title : '' }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content color="light">
      <ion-refresher slot="fixed" @ionRefresh="refresh">
        <ion-refresher-content />
      </ion-refresher>

      <ion-item-divider color="white" sticky>
        <ion-segment
          v-model="uiStore.recruits.segment"
          mode="md"
        >
          <ion-segment-button value="offer">
            <ion-label>내가 요청한</ion-label>
          </ion-segment-button>

          <ion-segment-button value="apply">
            <ion-row class="ion-align-items-center">
              <ion-label>내게 지원한</ion-label>
              <noti-badge v-if="worksStore.selectedWork?.haveUncheckedApplicants" />
            </ion-row>
          </ion-segment-button>

          <ion-segment-button value="contract">
            <ion-label>체결자</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-item-divider>

      <OfferList v-show="uiStore.recruits.segment === 'offer'" />

      <ApplicantList v-show="uiStore.recruits.segment === 'apply'" />

      <ContracterList v-show="uiStore.recruits.segment === 'contract'" />

      <ion-row v-if="worksStore.selectedWork && !worksStore.selectedWork.isContracted" class="fixed-button" slot="fixed">
        <ion-col class="contract-work-wrapper">
          <ion-button
            class="contract-work"
            expand="full"
            @click="() => {
              uiStore.$patch({
                isContractWorkModalOpened: true,
              });
            }"
          >
            구인완료
          </ion-button>
        </ion-col>
      </ion-row>

      <ion-modal
        css-class="contact-modal"
        :is-open="uiStore.isContactModalOpened"
        @didDismiss="() => {
          uiStore.$patch({
            isContactModalOpened: false,
          });
        }"
      >
        <div class="contact-modal-content">
          <ion-button
            fill="clear"
            @click="onClickCall"
          >
            <div class="button-inner">
              <ion-text class="icon" color="primary">
                <ion-icon :icon="call" />
              </ion-text>

              <ion-text class="label" color="dark">
                전화걸기
              </ion-text>
            </div>
          </ion-button>

          <ion-button
            fill="clear"
            @click="() => { openChat(); }"
          >
            <div class="button-inner">
              <ion-text class="icon" color="primary">
                <ion-icon :icon="chatboxEllipses" />
              </ion-text>

              <ion-row class="ion-align-items-center">
                <ion-text class="label" color="dark">
                  채팅하기
                </ion-text>
                <noti-badge v-if="recruitsStore.selectedRecruit?.haveUnreadChatsByClient" />
              </ion-row>
            </div>
          </ion-button>
        </div>
      </ion-modal>

      <ion-modal
        css-class="contract-modal"
        :is-open="uiStore.isContractModalOpened"
        @didDismiss="() => {
          uiStore.$patch({
            isContractModalOpened: false,
          });
        }"
      >
        <div class="contract-modal-content">
          <div class="modal-description">
            <ion-text color="dark">
              '{{ recruitsStore.selectedRecruit ? recruitsStore.selectedRecruit.worker.name : '선택한 기술자' }}'를
              '{{ worksStore.selectedWork ? worksStore.selectedWork.title : '선택된 일자리' }}'에
              체결하시겠습니까?
            </ion-text>
          </div>

          <div class="actions">
            <ion-button
              expand="block"
              @click="onClickContract"
            >
              체결
            </ion-button>

            <ion-button
              expand="block"
              fill="outline"
              @click="() => {
                uiStore.$patch({
                  isContractModalOpened: false,
                });
              }"
            >
              취소
            </ion-button>
          </div>
        </div>
      </ion-modal>

      <ion-modal
        css-class="contract-work-modal"
        :is-open="uiStore.isContractWorkModalOpened"
        @didDismiss="() => {
          uiStore.$patch({
            isContractWorkModalOpened: false,
          });
        }"
      >
        <div class="contract-work-modal-content">
          <div class="modal-description">
            <ion-text color="dark">
              {{
                worksStore.selectedWork
                  ? `설정하신 필요인원은 ${worksStore.selectedWork.requiredWorkers.length}명이며, 체결자는 ${worksStore.selectedWork.contractCount}명입니다.`
                  : ''
              }}
              <br/>
              '{{ worksStore.selectedWork ? worksStore.selectedWork.title : '작업요청서' }}'를 구인완료 처리하시겠습니까?
            </ion-text>
          </div>

          <div class="actions">
            <ion-button
              expand="block"
              @click="onClickContractWork"
            >
              구인완료
            </ion-button>

            <ion-button
              expand="block"
              fill="outline"
              @click="() => {
                uiStore.$patch({
                  isContractWorkModalOpened: false,
                });
              }"
            >
              취소
            </ion-button>
          </div>
        </div>
      </ion-modal>

      <ion-loading
        :is-open="isContracting"
        message="체결중..."
      />

      <ion-loading
        :is-open="isContractingWork"
        message="구인완료중..."
      />
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonRefresher, IonRefresherContent,
  IonItemDivider, IonSegment, IonSegmentButton, IonLabel, IonModal, IonButton, IonIcon, IonText, IonLoading, IonRow, IonCol,
} from '@ionic/vue';
import { call, chatboxEllipses } from 'ionicons/icons';

import {
  getWork, contractRecruit, contractWork, checkApplicants, acceptApplication,
} from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { ApplicantList, ContracterList, OfferList } from '@/containers';
import { useUiStore, useWorksStore, useRecruitsStore } from '@/store';
import { ROUTE_NAMES } from '@/router';
import { toast } from '@/utils';
import { NotiBadge } from '@/components';

const route = useRoute();
const router = useRouter();

const uiStore = useUiStore();

const worksStore = useWorksStore();

const recruitsStore = useRecruitsStore();

const onClickCall = () => {
  if (recruitsStore.isSelected) {
    // 비동기
    acceptApplication(
      recruitsStore.selectedRecruit!.id,
    );

    window.open(`tel:${recruitsStore.selectedRecruit!.worker.phoneNumber}`, '_self');
  }
};

const openChat = () => {
  if (worksStore.isSelected && recruitsStore.isSelected) {
    uiStore.$patch({
      isContactModalOpened: false,
    });

    router.push({
      name: ROUTE_NAMES.CHAT,
      params: {
        workId: worksStore.selectedWork!.id,
        recruitId: recruitsStore.selectedRecruit!.id,
      },
    });
  }
};

const isContracting = ref(false);

const onClickContract = async () => {
  if (!recruitsStore.isSelected || !worksStore.isSelected) {
    return;
  }

  isContracting.value = true;

  try {
    await contractRecruit(
      recruitsStore.selectedRecruit!.id,
    );
  } catch (e) {
    console.log(e);
    toast('체결에 실패했습니다. 다시 한번 시도해주세요.');
    return;
  } finally {
    uiStore.$patch({
      isContractModalOpened: false,
    });

    isContracting.value = false;
  }

  uiStore.$patch({
    recruits: {
      segment: 'contract',
    },
  });

  recruitsStore.$reset();
  worksStore.initRecruitingState();

  await Promise.all([
    recruitsStore.fetchOffers(),
    recruitsStore.fetchApplications(),
    recruitsStore.fetchContracts(),
    worksStore.fetchRecruitings(),
  ]);

  worksStore.$patch({
    selectedWork: {
      contractCount: worksStore.selectedWork!.contractCount + 1,
    },
  });

  if (!worksStore.selectedWork!.isContracted && worksStore.selectedWork!.contractCount >= worksStore.selectedWork!.requiredWorkers.length) {
    uiStore.$patch({
      isContractWorkModalOpened: true,
    });
  }
};

const isContractingWork = ref(false);

const onClickContractWork = async () => {
  if (!worksStore.isSelected) {
    return;
  }

  isContractingWork.value = true;

  try {
    await contractWork(
      worksStore.selectedWork!.id,
    );
  } catch (e) {
    console.log(e);
    toast('구인완료 처리에 실패했습니다. 다시 한번 시도해주세요.');
  } finally {
    uiStore.$patch({
      isContractWorkModalOpened: false,
    });

    isContractingWork.value = false;
  }

  uiStore.$patch({
    works: {
      segment: 'recruited',
    },
  });

  worksStore.$patch({
    workStatusFilter: 'all',
  });

  worksStore.initRecruitingState();
  worksStore.initRecruitedState();

  await Promise.all([
    worksStore.fetchRecruitings(),
    worksStore.fetchRecruiteds(),
  ]);

  worksStore.$patch({
    selectedWork: {
      isContracted: true,
    },
  });
};

const refresh = async (event: CustomEvent) => {
  recruitsStore.$reset();

  try {
    await Promise.all([
      recruitsStore.fetchOffers(),
      recruitsStore.fetchApplications(),
      recruitsStore.fetchContracts(),
    ]);
  } finally {
    (event.target as any).complete();
  }
};

watch(
  () => uiStore.recruits.segment,
  (newValue, oldValue) => {
    if (!worksStore.isSelected) {
      return;
    }

    if (oldValue !== 'apply' && newValue === 'apply' && worksStore.selectedWork!.haveUncheckedApplicants) {
      // 비동기
      checkApplicants(
        worksStore.selectedWork!.id,
      );

      setTimeout(() => {
        worksStore.$patch({
          selectedWork: {
            haveUncheckedApplicants: false,
          },
        });
      }, 500);
    }
  },
);

onMounted(async () => {
  if (!worksStore.isSelected) {
    const work = await getWork(
      route.params.workId as string,
    );

    worksStore.selectWork(work);
  }

  if (uiStore.recruits.segment === 'apply' && worksStore.selectedWork?.haveUncheckedApplicants) {
    // 비동기
    checkApplicants(
      worksStore.selectedWork!.id,
    );

    setTimeout(() => {
      worksStore.$patch({
        selectedWork: {
          haveUncheckedApplicants: false,
        },
      });
    }, 500);
  }

  recruitsStore.fetchOffers();
  recruitsStore.fetchApplications();
  recruitsStore.fetchContracts();
});
</script>

<style lang="scss" scoped>
ion-title {
  padding: 0 60px;
}

.fixed-button {
  padding: 0;
  width: 100vw;
  bottom: 0;

  .contract-work-wrapper {
    padding: 0;

    .contract-work {
      margin: 0;
    }
  }
}

.contact-modal-content {
  height: 100%;
  display: flex;
  align-items: center;

  ion-button {
    height: 100%;
    flex-grow: 1;

    .button-inner {
      display: flex;
      flex-direction: column;

      .icon {
        font-size: 52px;
      }

      .label {
        font-size: 20px;
        font-weight: 600;
      }
    }
  }
}

.contract-modal-content {
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

.contract-work-modal-content {
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
