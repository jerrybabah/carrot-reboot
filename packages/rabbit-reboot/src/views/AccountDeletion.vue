<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" default-href="/settings" />
        </ion-buttons>

        <ion-title>
          회원탈퇴
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSdMwnQ6K8VcqkLTpB5vfck6z8Q0IW6TgECQ-Qz42AvIw0JHfw/viewform?embedded=true"
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
