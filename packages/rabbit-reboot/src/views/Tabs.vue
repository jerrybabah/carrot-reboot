<template>
  <ion-page>
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon :icon="homeOutline" />
          <ion-label>홈</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="works" href="/tabs/jobSearch">
          <ion-icon :icon="constructOutline" />
          <ion-row class="ion-align-items-center">
            <ion-label>구직현황</ion-label>
            <noti-badge v-if="myStore.currentUser?.haveUncheckedOffers || myStore.currentUser?.haveUncheckedContracts" />
          </ion-row>
        </ion-tab-button>

        <ion-tab-button tab="myPage" href="/tabs/myPage">
          <ion-icon :icon="personOutline" />
          <ion-label>마이 페이지</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts" setup>
import {
  IonPage, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRow,
} from '@ionic/vue';
import { homeOutline, constructOutline, personOutline } from 'ionicons/icons';

import { useMyStore } from '@/store';
import { NotiBadge } from '@/components';

const myStore = useMyStore();
</script>

<style lang="scss" scoped>
</style>
