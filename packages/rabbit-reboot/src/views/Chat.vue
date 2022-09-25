<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" default-href="/tabs/jobSearch" />
        </ion-buttons>

        <ion-title>{{ jobSearchStore.selectedRecruit?.client.name || '' }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div v-if="isWorkInfoShowed" class="work-info-wrapper">
        <div class="work-info">
          <div v-if="jobSearchStore.selectedRecruit" class="work-info-content">
            <ion-chip class="field" color="primary">{{ jobSearchStore.selectedRecruit.work.field }}</ion-chip>
            <ion-text class="title" color="dark">{{ jobSearchStore.selectedRecruit.work.title }}</ion-text>
          </div>
        </div>
      </div>
      <div id="talkjs-chatbox">불러오는 중...</div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, ref } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonChip, IonText,
} from '@ionic/vue';
import Talk from 'talkjs';

import { getRecruit, readChats } from '@kim-pro-git/carrot-reboot-backend/lib/firestore';
import { useJobSearchStore, useMyStore } from '@/store';

const props = defineProps<{
  recruitId: string,
}>();

const jobSearchStore = useJobSearchStore();

const myStore = useMyStore();

const isWorkInfoShowed = ref(false);

onMounted(async () => {
  if (!myStore.isLoggedIn) {
    return;
  }

  if (!jobSearchStore.isSelected) {
    const recruit = await getRecruit(
      props.recruitId,
    );

    jobSearchStore.selectRecruit(recruit);
  }

  await Talk.ready;

  const me = new Talk.User({
    id: myStore.currentUser!.id,
    name: myStore.currentUser!.name,
    phone: `+82${myStore.currentUser!.phoneNumber.slice(1)}`,
    role: 'worker',
  });

  /**
   * INFO
   * 구독 계정: naver
   * 구독 안한 계정: gmail
   *
   * naver 계정의 production appId: _
   * naver 계정의 develop appId: _
   *
   * gmail 계정의 develop appId: _
   */
  const session = new Talk.Session({
    appId: process.env.NODE_ENV === 'production' ? '' : '', // TODO: 안전하게 보관하기
    me,
  });

  const other = new Talk.User({
    id: `${jobSearchStore.selectedRecruit!.client.id}/${jobSearchStore.selectedRecruit!.work.id}`,
    name: jobSearchStore.selectedRecruit!.client.name,
    phone: `+82${jobSearchStore.selectedRecruit!.client.phoneNumber.slice(1)}`,
    role: 'client',
  });

  const conversation = session.getOrCreateConversation(Talk.oneOnOneId(me, other));

  conversation.setParticipant(me);
  conversation.setParticipant(other);

  conversation.setAttributes({
    // example: 목수 / 서울 강남구 상세주소 어쩌고 저쩌고 / 2021.09.09. ~ 2021.09.10.
    subject: `${jobSearchStore.selectedRecruit!.work.field} / ${jobSearchStore.selectedRecruit!.work.address1} ${jobSearchStore.selectedRecruit!.work.address2} / ${jobSearchStore.selectedRecruit!.work.startDate.toLocaleDateString()} ~ ${jobSearchStore.selectedRecruit!.work.endDate.toLocaleDateString()}`,
    custom: {
      recruitId: jobSearchStore.selectedRecruit!.id,
    },
  });

  const chatbox = session.createChatbox(conversation, {
    showChatHeader: false,
  });

  await chatbox.mount(document.getElementById('talkjs-chatbox'));

  isWorkInfoShowed.value = true;

  if (jobSearchStore.selectedRecruit!.haveUnreadChatsByWorker) {
    // 비동기
    readChats(
      jobSearchStore.selectedRecruit!.id,
      'Worker',
    );

    jobSearchStore.$patch({
      selectedRecruit: {
        haveUnreadChatsByWorker: false,
      },
    });
  }
});
</script>

<style lang="scss" scoped>
#talkjs-chatbox {
  height: 100%;
}

.work-info-wrapper {
  position: absolute;
  height: 3.2rem;
  width: 100%;
  background-color: transparent;

  .work-info {
    height: 100%;
    width: 100%;
    max-width: 420px;
    margin: 0 auto;
    background-color: #fcfcfc;
    border-bottom: 1px solid #eeeeee;
    padding: 8px;

    .work-info-content {
      height: 100%;
      display: flex;
      align-items: center;

      .field {
        margin: 0 8px 0 0;
        padding: 0 8px;
        height: 24px;
        font-size: 12px;
        flex-shrink: 0;
      }

      .title {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
}
</style>
