<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" default-href="/serviceCenter" />
        </ion-buttons>

        <ion-title>
          1:1 채팅 문의
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <iframe
        src="https://pf.kakao.com/_xaydxcxb"
        width="100%"
        height="100%"
        frameborder="0"
        marginheight="0"
        marginwidth="0"
      >
        로드 중…
      </iframe>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
} from '@ionic/vue';
</script>

<style lang="scss" scoped>
</style>
