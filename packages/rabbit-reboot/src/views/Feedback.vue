<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" default-href="/serviceCenter" />
        </ion-buttons>

        <ion-title>
          의견전달
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSejCfnSU6T-XBivXp_oVVRHWlyVoSKPSyfKCiqO5l1ROnQlZw/viewform?embedded=true"
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
