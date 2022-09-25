<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text="" default-href="/tabs/home"/>
        </ion-buttons>

        <ion-title>{{ props.field }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content color="light">
      <WorkList />
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent,
} from '@ionic/vue';
import { WorkList } from '@/containers';

const props = defineProps<{
  field: string,
  district?: string,
}>();
</script>

<style lang="scss" scoped>
</style>
