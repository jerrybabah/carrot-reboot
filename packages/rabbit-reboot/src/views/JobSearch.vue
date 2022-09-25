<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          구직현황
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content color="light">
      <ion-refresher slot="fixed" @ionRefresh="refresh">
        <ion-refresher-content />
      </ion-refresher>

      <ion-item-divider color="white" sticky>
        <ion-segment
          v-model="uiStore.jobSearch.segment"
          mode="md"
        >
          <ion-segment-button value="apply">
            <ion-label>내가 지원한</ion-label>
          </ion-segment-button>

          <ion-segment-button value="offer">
            <ion-row class="ion-align-items-center ion-nowrap">
              <ion-label>내게 요청한</ion-label>
              <noti-badge v-if="myStore.currentUser?.haveUncheckedOffers" />
            </ion-row>
          </ion-segment-button>

          <ion-segment-button value="contract">
            <ion-row class="ion-align-items-center ion-nowrap">
              <ion-label>체결된 일자리</ion-label>
              <noti-badge v-if="myStore.currentUser?.haveUncheckedContracts" />
            </ion-row>
          </ion-segment-button>
        </ion-segment>
      </ion-item-divider>

      <ApplicationList v-show="uiStore.jobSearch.segment === 'apply'" />

      <OfferList v-show="uiStore.jobSearch.segment === 'offer'" />

      <ContractList v-show="uiStore.jobSearch.segment === 'contract'" />
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { onMounted, watch } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, IonRefresherContent,
  IonItemDivider, IonSegment, IonSegmentButton, IonLabel, IonRow,
} from '@ionic/vue';

import { checkOffers, checkContracts } from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { useUiStore, useMyStore, useJobSearchStore } from '@/store';
import { ApplicationList, OfferList, ContractList } from '@/containers';
import { NotiBadge } from '@/components';

const uiStore = useUiStore();

const myStore = useMyStore();

const jobSearchStore = useJobSearchStore();

const refresh = async (event: CustomEvent) => {
  jobSearchStore.$reset();

  try {
    await Promise.all([
      jobSearchStore.fetchApplications(),
      jobSearchStore.fetchOffers(),
      jobSearchStore.fetchContracts(),
    ]);
  } finally {
    (event.target as any).complete();
  }
};

watch(
  () => uiStore.jobSearch.segment,
  (newValue, oldValue) => {
    if (!myStore.isLoggedIn) {
      return;
    }

    if (oldValue !== 'offer' && newValue === 'offer' && myStore.currentUser!.haveUncheckedOffers) {
      // 비동기
      checkOffers(
        myStore.currentUser!.id,
      );

      setTimeout(() => {
        myStore.$patch({
          currentUser: {
            haveUncheckedOffers: false,
          },
        });
      }, 500);
    }

    if (oldValue !== 'contract' && newValue === 'contract' && myStore.currentUser!.haveUncheckedContracts) {
      // 비동기
      checkContracts(
        myStore.currentUser!.id,
      );

      setTimeout(() => {
        myStore.$patch({
          currentUser: {
            haveUncheckedContracts: false,
          },
        });
      }, 500);
    }
  },
);

onMounted(async () => {
  if (!myStore.isLoggedIn) {
    return;
  }

  if (uiStore.jobSearch.segment === 'offer' && myStore.currentUser!.haveUncheckedOffers) {
    // 비동기
    checkOffers(
      myStore.currentUser!.id,
    );

    setTimeout(() => {
      myStore.$patch({
        currentUser: {
          haveUncheckedOffers: false,
        },
      });
    }, 500);
  } else if (uiStore.jobSearch.segment === 'contract' && myStore.currentUser!.haveUncheckedContracts) {
    // 비동기
    checkContracts(
      myStore.currentUser!.id,
    );

    setTimeout(() => {
      myStore.$patch({
        currentUser: {
          haveUncheckedContracts: false,
        },
      });
    }, 500);
  }

  jobSearchStore.fetchApplications();
  jobSearchStore.fetchOffers();
  jobSearchStore.fetchContracts();
});
</script>

<style lang="scss" scoped>
</style>
