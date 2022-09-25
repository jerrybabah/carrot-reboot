<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" default-href="/tabs/myPage" />
        </ion-buttons>

        <ion-title>즐겨찾는 기술자 목록</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content color="light">
      <FavoriteWorkerList />
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
} from '@ionic/vue';

import { FavoriteWorkerList } from '@/containers';
</script>

<style lang="scss" scoped>
</style>
