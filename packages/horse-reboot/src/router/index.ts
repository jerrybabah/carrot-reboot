import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

import Tabs from '../views/Tabs.vue';
import {
  useMyStore, useWorkCreationStore, useWorksStore, useRecruitsStore, useUiStore, useReviewCreationStore,
  useWorkModificationStore, useReviewModificationStore, useClientModificationStore,
} from '../store';
import { toast } from '../utils';

export const ROUTE_NAMES: Record<string, string> = {
  ON_BOARDING: 'OnBoarding',
  LOGIN: 'Login',
  SIGNUP: 'Signup',
  TABS: 'Tabs',
  HOME: 'Home',
  WORKS: 'Works',
  MY_PAGE: 'MyPage',
  WORKERS: 'Workers',
  WORKER: 'Worker',
  WORK: 'Work',
  WORK_CREATION_STEP1: 'WorkCreationStep1',
  WORK_CREATION_STEP2: 'WorkCreationStep2',
  WORK_CREATION_STEP3: 'WorkCreationStep3',
  WORK_CREATION_STEP4: 'WorkCreationStep4',
  WORK_CREATION_STEP5: 'WorkCreationStep5',
  RECRUITS: 'Recruits',
  CHAT: 'Chat',
  SERVICE_CENTER: 'ServiceCenter',
  SETTINGS: 'Settings',
  FAVORITES: 'Favorites',
  REVIEW_CREATION: 'ReviewCreation',
  WORK_MODIFICATION: 'WorkModification',
  REVIEWS: 'Reviews',
  REVIEW_MODIFICATION: 'ReviewModification',
  CLIENT_MODIFICATION: 'ClientModification',
  REPORT: 'Report',
  FEEDBACK: 'Feedback',
  ACCOUNT_DELETION: 'AccountDeletion',
  CONSULTING: 'Consulting',
  FAQ: 'FAQ',
  USE_TERMS: 'UseTerms',
  PRIVACY: 'Privacy',
  MARKETING: 'Marketing',
};

const routes: Array<RouteRecordRaw> = [
  {
    path: '/onBoarding',
    name: ROUTE_NAMES.ON_BOARDING,
    component: () => import('../views/OnBoarding.vue'),
  },
  {
    path: '/login',
    name: ROUTE_NAMES.LOGIN,
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/signup',
    name: ROUTE_NAMES.SIGNUP,
    component: () => import('../views/Signup.vue'),
  },
  {
    path: '/',
    redirect: { name: ROUTE_NAMES.ON_BOARDING },
  },
  {
    path: '/tabs',
    component: Tabs,
    children: [
      {
        path: '',
        name: ROUTE_NAMES.TABS,
        redirect: { name: ROUTE_NAMES.HOME },
      },
      {
        path: 'home',
        name: ROUTE_NAMES.HOME,
        component: () => import('../views/Home.vue'),
      },
      {
        path: 'works',
        name: ROUTE_NAMES.WORKS,
        component: () => import('../views/Works.vue'),
      },
      {
        path: 'myPage',
        name: ROUTE_NAMES.MY_PAGE,
        component: () => import('../views/MyPage.vue'),
      },
    ],
  },
  {
    path: '/workers',
    name: ROUTE_NAMES.WORKERS,
    component: () => import('../views/Workers.vue'),
    props: (route) => {
      const { query } = route;

      if (!query.field) {
        query.field = '보통인부';
      }

      return route.query;
    },
  },
  {
    path: '/workers/:workerId',
    name: ROUTE_NAMES.WORKER,
    component: () => import('../views/Worker.vue'),
    props: true,
  },
  {
    path: '/works/:workId',
    name: ROUTE_NAMES.WORK,
    component: () => import('../views/Work.vue'),
    props: true,
  },
  {
    path: '/createWork/step1',
    name: ROUTE_NAMES.WORK_CREATION_STEP1,
    component: () => import('../views/WorkCreation/Step1.vue'),
  },
  {
    path: '/createWork/step2',
    name: ROUTE_NAMES.WORK_CREATION_STEP2,
    component: () => import('../views/WorkCreation/Step2.vue'),
  },
  {
    path: '/createWork/step3',
    name: ROUTE_NAMES.WORK_CREATION_STEP3,
    component: () => import('../views/WorkCreation/Step3.vue'),
  },
  {
    path: '/createWork/step4',
    name: ROUTE_NAMES.WORK_CREATION_STEP4,
    component: () => import('../views/WorkCreation/Step4.vue'),
  },
  {
    path: '/createWork/step5',
    name: ROUTE_NAMES.WORK_CREATION_STEP5,
    component: () => import('../views/WorkCreation/Step5.vue'),
  },
  {
    path: '/works/:workId/recruits',
    name: ROUTE_NAMES.RECRUITS,
    component: () => import('../views/Recruits.vue'),
  },
  {
    path: '/works/:workId/recruits/:recruitId/chat',
    name: ROUTE_NAMES.CHAT,
    component: () => import('../views/Chat.vue'),
    props: true,
  },
  {
    path: '/serviceCenter',
    name: ROUTE_NAMES.SERVICE_CENTER,
    component: () => import('../views/ServiceCenter.vue'),
  },
  {
    path: '/settings',
    name: ROUTE_NAMES.SETTINGS,
    component: () => import('../views/Settings.vue'),
  },
  {
    path: '/favorites',
    name: ROUTE_NAMES.FAVORITES,
    component: () => import('../views/Favorites.vue'),
  },
  {
    path: '/works/:workId/recruits/:recruitId/reviewCreation',
    name: ROUTE_NAMES.REVIEW_CREATION,
    component: () => import('../views/ReviewCreation.vue'),
    props: true,
  },
  {
    path: '/works/:workId/workModification',
    name: ROUTE_NAMES.WORK_MODIFICATION,
    component: () => import('../views/WorkModification.vue'),
    props: true,
  },
  {
    path: '/reviews',
    name: ROUTE_NAMES.REVIEWS,
    component: () => import('../views/Reviews.vue'),
  },
  {
    path: '/reviews/:reviewId/reviewModification',
    name: ROUTE_NAMES.REVIEW_MODIFICATION,
    component: () => import('../views/ReviewModification.vue'),
    props: true,
  },
  {
    path: '/clientModification',
    name: ROUTE_NAMES.CLIENT_MODIFICATION,
    component: () => import('../views/ClientModification.vue'),
  },
  {
    path: '/report',
    name: ROUTE_NAMES.REPORT,
    component: () => import('../views/Report.vue'),
  },
  {
    path: '/feedback',
    name: ROUTE_NAMES.FEEDBACK,
    component: () => import('../views/Feedback.vue'),
  },
  {
    path: '/accountDeletion',
    name: ROUTE_NAMES.ACCOUNT_DELETION,
    component: () => import('../views/AccountDeletion.vue'),
  },
  {
    path: '/consulting',
    name: ROUTE_NAMES.CONSULTING,
    component: () => import('../views/Consulting.vue'),
  },
  {
    path: '/faq',
    name: ROUTE_NAMES.FAQ,
    component: () => import('../views/FAQ.vue'),
  },
  {
    path: '/useTerms',
    name: ROUTE_NAMES.USE_TERMS,
    component: () => import('../views/UseTerms.vue'),
  },
  {
    path: '/privacy',
    name: ROUTE_NAMES.PRIVACY,
    component: () => import('../views/Privacy.vue'),
  },
  {
    path: '/marketing',
    name: ROUTE_NAMES.MARKETING,
    component: () => import('../views/Marketing.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  /**
   * INFO: 작업 요청서를 작성하다가 나왔을 때
   */
  if (from.path.startsWith('/createWork') && !to.path.startsWith('/createWork')) {
    const workCreationStore = useWorkCreationStore();

    if (workCreationStore.isWorkerSelected) {
      workCreationStore.selectWorker(null);
    }

    if (workCreationStore.isInputed) {
      toast('작업 요청서가 임시 저장되었습니다.');
    }
  }

  /**
   * 구인현황에서 (채팅, 기술자 상세, 리뷰 작성)가 아닌 곳으로 나올 때
   * 또는 (기술자 목록, 기술자 상세)에서 (기술자 목록, 기술자 상세, 구인현황)이 아닌 곳으로 나갈 때
   */
  const isFromRecruits = from.name === ROUTE_NAMES.RECRUITS
    && !(to.name === ROUTE_NAMES.CHAT || to.name === ROUTE_NAMES.WORKER || to.name === ROUTE_NAMES.REVIEW_CREATION);

  const isFromWorkersOrWorker = (from.name === ROUTE_NAMES.WORKERS || from.name === ROUTE_NAMES.WORKER)
    && !(to.name === ROUTE_NAMES.WORKERS || to.name === ROUTE_NAMES.WORKER || to.name === ROUTE_NAMES.RECRUITS);

  if (isFromRecruits || isFromWorkersOrWorker) {
    const worksStore = useWorksStore();

    if (worksStore.isSelected) {
      worksStore.selectWork(null);
    }
  }

  /**
   * 구인현황에서 (채팅, 기술자 상세, 리뷰 작성) 페이지가 아닌 곳으로 이동할 때
   */
  if (isFromRecruits) {
    const recruitsStore = useRecruitsStore();

    recruitsStore.$reset();
  }

  /**
   * 리뷰 작성 페이지에서 나올 때
   */
  if (from.name === ROUTE_NAMES.REVIEW_CREATION) {
    const reviewCreationStore = useReviewCreationStore();

    if (reviewCreationStore.isInputed) {
      const uiStore = useUiStore();

      uiStore.$patch({
        isReviewLeaveConfirmModalOpened: true,
      });

      next(false);
      return;
    }
  }

  /**
   * 작업요청서 수정 페이지에서 나올 때
   */
  if (from.name === ROUTE_NAMES.WORK_MODIFICATION) {
    const workModificationStore = useWorkModificationStore();

    if (workModificationStore.isChanged) {
      const uiStore = useUiStore();

      uiStore.$patch({
        isWorkModificationLeaveConfirmModalOpened: true,
      });

      next(false);
      return;
    }

    workModificationStore.$reset();
  }

  /**
   * 후기 수정 페이지에서 나올 때
   */
  if (from.name === ROUTE_NAMES.REVIEW_MODIFICATION) {
    const reviewModificationStore = useReviewModificationStore();

    if (reviewModificationStore.isChanged) {
      const uiStore = useUiStore();

      uiStore.$patch({
        isReviewModificationLeaveConfirmModalOpened: true,
      });

      next(false);
      return;
    }

    reviewModificationStore.$reset();
  }

  /**
   * 프로필 수정 페이지에서 나올 때
   */
  if (from.name === ROUTE_NAMES.CLIENT_MODIFICATION) {
    const clientModificationStore = useClientModificationStore();

    if (clientModificationStore.isChanged) {
      const uiStore = useUiStore();

      uiStore.$patch({
        isClientModificationLeaveConfirmModalOpened: true,
      });

      next(false);
      return;
    }

    clientModificationStore.$reset();
  }

  /**
   * 로그인 또는 온보딩 화면으로 진입할 때
   */
  if (to.name === ROUTE_NAMES.LOGIN || to.name === ROUTE_NAMES.ON_BOARDING) {
    const myStore = useMyStore();

    // INFO: 자동로그인 중이라면 끝날 때까지 기다린다. (로그인 여부를 그 후에 알 수 있다.)
    await myStore.waitForAutoLogin();

    if (myStore.isLoggedIn) {
      next({ name: ROUTE_NAMES.HOME });
      return;
    }
  }

  /**
   * 로그인 안된 사용자가 진입하면 안되는 페이지
   */
  if (
    to.name === ROUTE_NAMES.WORK
    || to.name === ROUTE_NAMES.WORK_CREATION_STEP1
    || to.name === ROUTE_NAMES.WORK_CREATION_STEP2
    || to.name === ROUTE_NAMES.WORK_CREATION_STEP3
    || to.name === ROUTE_NAMES.WORK_CREATION_STEP4
    || to.name === ROUTE_NAMES.WORK_CREATION_STEP5
    || to.name === ROUTE_NAMES.RECRUITS
    || to.name === ROUTE_NAMES.CHAT
    || to.name === ROUTE_NAMES.FAVORITES
    || to.name === ROUTE_NAMES.REVIEW_CREATION
  ) {
    const myStore = useMyStore();

    // INFO: 자동로그인 중이라면 끝날 때까지 기다린다. (로그인 여부를 그 후에 알 수 있다.)
    await myStore.waitForAutoLogin();

    if (!myStore.isLoggedIn) {
      next({ name: ROUTE_NAMES.LOGIN });
      return;
    }
  }

  next();
});

export default router;
