<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" default-href="/tabs/myPage" />
        </ion-buttons>

        <ion-title>작성한 후기 목록</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content color="light">
      <ReviewList />
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
} from '@ionic/vue';

import { ReviewList } from '@/containers';
</script>

<style lang="scss" scoped>
</style>
