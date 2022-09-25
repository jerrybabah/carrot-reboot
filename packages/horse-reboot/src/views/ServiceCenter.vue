<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" default-href="/tabs/myPage" />
        </ion-buttons>

        <ion-title>고객센터</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item button @click="() => { router.push({ name: ROUTE_NAMES.FAQ }); }">
          <ion-label class="menu-item-content">
            <ion-icon class="menu-item-icon" :icon="chatbubblesOutline" color="primary" />
            <ion-text color="dark">자주 묻는 질문</ion-text>
          </ion-label>
        </ion-item>

        <ion-item button @click="() => { router.push({ name: ROUTE_NAMES.CONSULTING }); }">
          <ion-label class="menu-item-content">
            <ion-icon class="menu-item-icon" :icon="helpCircleOutline" color="primary" />
            <ion-text color="dark">1:1 채팅 문의</ion-text>
          </ion-label>
        </ion-item>

        <ion-item button @click="() => { router.push({ name: ROUTE_NAMES.FEEDBACK }); }">
          <ion-label class="menu-item-content">
            <ion-icon class="menu-item-icon" :icon="shareOutline" color="primary" />
            <ion-text color="dark">의견 전달하기</ion-text>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, IonText,
} from '@ionic/vue';
import {
  chatbubblesOutline, helpCircleOutline, shareOutline,
} from 'ionicons/icons';

import { ROUTE_NAMES } from '@/router';

const router = useRouter();
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
