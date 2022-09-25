<template>
  <ion-page>
    <ion-content>
      <ion-slides :pager="true">
        <ion-slide>
          <div class="slide-wrapper">
            <div class="img-wrapper">
              <img :src="img1" />
            </div>
            <div class="empty"></div>
          </div>
        </ion-slide>

        <ion-slide>
          <div class="slide-wrapper">
            <div class="img-wrapper">
              <img :src="img2" />
            </div>
            <div class="empty"></div>
          </div>
        </ion-slide>

        <ion-slide>
          <div class="slide-wrapper">
            <div class="img-wrapper">
              <img :src="img3" />
            </div>
            <div class="empty"></div>
          </div>
        </ion-slide>

        <ion-slide>
          <div class="slide-wrapper">
            <div class="img-wrapper">
              <img :src="img4" />
            </div>
            <div class="empty"></div>
          </div>
        </ion-slide>

        <ion-slide>
          <div class="slide-wrapper">
            <div class="img-wrapper">
              <img :src="img5" />
            </div>
            <div class="empty"></div>
          </div>
        </ion-slide>
      </ion-slides>

      <div class="actions" slot="fixed">
        <div class="main-btn-wrapper">
          <ion-button
            expand="block"
            @click="() => { router.push({ name: ROUTE_NAMES.LOGIN }) }"
          >
            전화번호로 간편하게 시작하기
          </ion-button>
        </div>

        <ion-button
          fill="clear"
          size="small"
          @click="() => { router.push({ name: ROUTE_NAMES.HOME }) }"
        >
          둘러보기
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import {
  IonPage, IonContent, IonSlides, IonSlide, IonButton,
} from '@ionic/vue';

import { ROUTE_NAMES } from '@/router';
import img1 from '@/assets/onBoarding/onboarding_1.png';
import img2 from '@/assets/onBoarding/onboarding_2.png';
import img3 from '@/assets/onBoarding/onboarding_3.png';
import img4 from '@/assets/onBoarding/onboarding_4.png';
import img5 from '@/assets/onBoarding/onboarding_5.png';

const router = useRouter();
</script>

<style lang="scss" scoped>
ion-slides {
  height: 100%;

  ion-slide {
    align-items: flex-start;

    .slide-wrapper {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: stretch;

      .img-wrapper {
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .empty {
        height: 168px;
      }
    }
  }

  & :deep(.swiper-pagination) {
    bottom: 150px;
  }
}

.actions {
  width: 100%;
  bottom: 0;
  padding: 0 16px;
  padding-bottom: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .main-btn-wrapper {
    width: 100%;
    max-width: 400px;
  }
}
</style>
