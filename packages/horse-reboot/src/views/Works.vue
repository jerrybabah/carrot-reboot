<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>내 작업 요청</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content color="light">
      <ion-item-divider color="white" sticky>
        <ion-segment
          v-model="uiStore.works.segment"
          mode="md"
        >
          <ion-segment-button value="recruiting">
            <ion-label>구인중</ion-label>
          </ion-segment-button>

          <ion-segment-button value="recruited">
            <ion-label>구인완료</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-item-divider>

      <RecruitingWorkList v-show="uiStore.works.segment === 'recruiting'" />

      <RecruitedWorkList v-show="uiStore.works.segment === 'recruited'" />

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button
          @click="() => {
            if (!myStore.isLoggedIn) {
              uiStore.$patch({
                isLoginRequiredModalOpened: true,
              });
              return;
            }

            if (workCreationStore.isInputed) {
              uiStore.$patch({
                isWorkCreationModalOpened: true,
              });
              return;
            }

            router.push({ name: ROUTE_NAMES.WORK_CREATION_STEP1 });
          }"
        >
          <ion-icon :icon="add" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonSegment, IonSegmentButton, IonLabel, IonItemDivider, IonFab, IonFabButton, IonIcon,
} from '@ionic/vue';
import { add } from 'ionicons/icons';

import { RecruitingWorkList, RecruitedWorkList } from '@/containers';
import { useUiStore, useWorkCreationStore, useMyStore } from '@/store';
import { ROUTE_NAMES } from '@/router';

const router = useRouter();

const uiStore = useUiStore();

const workCreationStore = useWorkCreationStore();

const myStore = useMyStore();
</script>

<style lang="scss" scoped>
</style>
