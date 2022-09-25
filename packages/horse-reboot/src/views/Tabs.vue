<template>
  <ion-page>
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon :icon="homeOutline" />
          <ion-label>홈</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="works" href="/tabs/works">
          <ion-icon :icon="documentTextOutline" />
          <ion-label>내 작업 요청</ion-label>
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
  IonPage, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel,
} from '@ionic/vue';
import { homeOutline, personOutline, documentTextOutline } from 'ionicons/icons';
</script>

<style lang="scss" scoped>
</style>
