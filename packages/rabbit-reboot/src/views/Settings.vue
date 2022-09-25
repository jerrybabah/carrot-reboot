<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" default-href="/tabs/myPage" />
        </ion-buttons>

        <ion-title>환경설정</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item button @click="() => { router.push({ name: ROUTE_NAMES.USE_TERMS }); }">
          <ion-label class="menu-item-content">
            <ion-icon class="menu-item-icon" :icon="bookOutline" color="primary" />
            <ion-text color="dark">이용약관</ion-text>
          </ion-label>
        </ion-item>

        <ion-item button @click="() => { router.push({ name: ROUTE_NAMES.PRIVACY }); }">
          <ion-label class="menu-item-content">
            <ion-icon class="menu-item-icon" :icon="documentOutline" color="primary" />
            <ion-text color="dark">개인정보처리방침</ion-text>
          </ion-label>
        </ion-item>

        <ion-item button @click="() => { router.push({ name: ROUTE_NAMES.MARKETING }); }">
          <ion-label class="menu-item-content">
            <ion-icon class="menu-item-icon" :icon="documentOutline" color="primary" />
            <ion-text color="dark">구인,구직정보 및 마케팅 수신 동의</ion-text>
          </ion-label>
        </ion-item>

        <ion-item
          v-if="myStore.isLoggedIn"
          button
          @click="() => {
            if (myStore.isLoggedIn) {
              myStore.logout()
                .then(() => {
                  jobSearchStore.$reset();
                  uiStore.$reset();
                  workerSigninStore.$reset();

                  router.push({ name: ROUTE_NAMES.LOGIN });
                })
            }
          }"
        >
          <ion-label class="menu-item-content">
            <ion-icon class="menu-item-icon" :icon="logOutOutline" color="primary" />
            <ion-text color="dark">로그아웃</ion-text>
          </ion-label>
        </ion-item>

        <ion-item v-if="myStore.isLoggedIn" button @click="() => { router.push({ name: ROUTE_NAMES.ACCOUNT_DELETION }); }">
          <ion-label class="menu-item-content">
            <ion-icon class="menu-item-icon" :icon="closeCircleOutline" color="primary" />
            <ion-text color="dark">회원탈퇴</ion-text>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-label class="menu-item-content">
            <ion-icon class="menu-item-icon" :icon="informationCircleOutline" color="primary" />
            <ion-text color="dark">버전</ion-text>
          </ion-label>
          <ion-note>{{ packageJson.version }}</ion-note>
        </ion-item>
      </ion-list>

      <ion-loading
        :is-open="myStore.isLoggingOut"
        message="로그아웃중..."
      />
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, IonText, IonLoading, IonNote,
} from '@ionic/vue';
import {
  bookOutline, documentOutline, informationCircleOutline, logOutOutline, closeCircleOutline,
} from 'ionicons/icons';

import {
  useMyStore, useJobSearchStore, useUiStore, useWorkerSigninStore,
} from '@/store';
import { ROUTE_NAMES } from '@/router';
import packageJson from '../../package.json';

const router = useRouter();

const myStore = useMyStore();

const jobSearchStore = useJobSearchStore();

const uiStore = useUiStore();

const workerSigninStore = useWorkerSigninStore();
</script>

<style lang="scss" scoped>
.menu-item-content {
  display: flex;
  align-items: center;

  .menu-item-icon {
    margin-right: 6px;
  }
}
</style>
