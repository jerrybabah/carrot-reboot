import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

import Tabs from '../views/Tabs.vue';
import {
  useMyStore, useUiStore, useJobSearchStore, usePortfoliosStore, usePortfolioCreationStore, usePortfolioModificationStore, useWorkerModificationStore,
} from '../store';
import { toast } from '../utils';

export const ROUTE_NAMES: Record<string, string> = {
  ON_BOARDING: 'OnBoarding',
  LOGIN: 'Login',
  SIGNUP_STEP1: 'SignupStep1',
  SIGNUP_STEP2: 'SignupStep2',
  SIGNUP_STEP3: 'SignupStep3',
  SIGNUP_STEP4: 'SignupStep4',
  SIGNUP_STEP5: 'SignupStep5',
  TABS: 'Tabs',
  HOME: 'Home',
  JOB_SEARCH: 'JobSearch',
  MY_PAGE: 'MyPage',
  WORKS: 'Works',
  WORK: 'Work',
  CHAT: 'Chat',
  SERVICE_CENTER: 'ServiceCenter',
  SETTINGS: 'Settings',
  REVIEWS: 'Reviews',
  PORTFOLIOS: 'Portfolios',
  PORTFOLIO_CREATION: 'PortfolioCreation',
  PORTFOLIO_MODIFICATION: 'PortfolioModification',
  WORKER_MODIFICATION: 'WorkerModification',
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
    path: '/signup/step1',
    name: ROUTE_NAMES.SIGNUP_STEP1,
    component: () => import('../views/Signup/Step1.vue'),
  },
  {
    path: '/signup/step2',
    name: ROUTE_NAMES.SIGNUP_STEP2,
    component: () => import('../views/Signup/Step2.vue'),
  },
  {
    path: '/signup/step3',
    name: ROUTE_NAMES.SIGNUP_STEP3,
    component: () => import('../views/Signup/Step3.vue'),
  },
  {
    path: '/signup/step4',
    name: ROUTE_NAMES.SIGNUP_STEP4,
    component: () => import('../views/Signup/Step4.vue'),
  },
  {
    path: '/signup/step5',
    name: ROUTE_NAMES.SIGNUP_STEP5,
    component: () => import('../views/Signup/Step5.vue'),
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
        path: 'jobSearch',
        name: ROUTE_NAMES.JOB_SEARCH,
        component: () => import('../views/JobSearch.vue'),
      },
      {
        path: 'myPage',
        name: ROUTE_NAMES.MY_PAGE,
        component: () => import('../views/MyPage.vue'),
      },
    ],
  },
  {
    path: '/works',
    name: ROUTE_NAMES.WORKS,
    component: () => import('../views/Works.vue'),
    props: (route) => {
      const { query } = route;

      if (!query.field) {
        query.field = '보통인부';
      }

      return route.query;
    },
  },
  {
    path: '/works/:workId',
    name: ROUTE_NAMES.WORK,
    component: () => import('../views/Work.vue'),
    props: true,
  },
  {
    path: '/jobSearch/:recruitId/chat',
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
    path: '/reviews',
    name: ROUTE_NAMES.REVIEWS,
    component: () => import('../views/Reviews.vue'),
  },
  {
    path: '/portfolios',
    name: ROUTE_NAMES.PORTFOLIOS,
    component: () => import('../views/Portfolios.vue'),
  },
  {
    path: '/createPortfolio',
    name: ROUTE_NAMES.PORTFOLIO_CREATION,
    component: () => import('../views/PortfolioCreation.vue'),
  },
  {
    path: '/portfolios/:portfolioId/portfolioModification',
    name: ROUTE_NAMES.PORTFOLIO_MODIFICATION,
    component: () => import('../views/PortfolioModification.vue'),
    props: true,
  },
  {
    path: '/workerModification',
    name: ROUTE_NAMES.WORKER_MODIFICATION,
    component: () => import('../views/WorkerModification.vue'),
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
   * 구직현황에서 채팅 페이지가 아닌 곳으로 이동할 때
   * 또는
   * 일자리 상세에서 채팅 페이지가 아닌 곳으로 이동할 때
   */
  if (
    (from.name === ROUTE_NAMES.JOB_SEARCH && to.name !== ROUTE_NAMES.CHAT)
    || (from.name === ROUTE_NAMES.WORK && to.name !== ROUTE_NAMES.CHAT)
  ) {
    const jobSearchStore = useJobSearchStore();

    if (jobSearchStore.isSelected) {
      jobSearchStore.selectRecruit(null);
    }
  }

  /**
   * 포트폴리오 목록에서 나올 때
   */
  if (from.name === ROUTE_NAMES.PORTFOLIOS
    && !(to.name === ROUTE_NAMES.PORTFOLIO_CREATION || to.name === ROUTE_NAMES.PORTFOLIO_MODIFICATION)) {
    const portfoliosStore = usePortfoliosStore();

    portfoliosStore.$reset();
  }

  /**
   * 포트폴리오 작성 페이지에서 나올 때
   */
  if (from.name === ROUTE_NAMES.PORTFOLIO_CREATION) {
    const portfolioCreationStore = usePortfolioCreationStore();

    if (portfolioCreationStore.isInputed) {
      toast('작성중인 포트폴리오가 임시 저장되었습니다.');
    }
  }

  /**
   * 포트폴리오 수정 페이지에서 나올 때
   */
  if (from.name === ROUTE_NAMES.PORTFOLIO_MODIFICATION) {
    const portfolioModificationStore = usePortfolioModificationStore();

    if (portfolioModificationStore.isChanged) {
      const uiStore = useUiStore();

      uiStore.$patch({
        isPortfolioModificationConfirmModalOpened: true,
      });

      next(false);
      return;
    }

    const portfoliosStore = usePortfoliosStore();

    portfoliosStore.selectPortfolio(null);
    portfolioModificationStore.$reset();
  }

  /**
   * 프로필 수정 페이지에서 나올 때
   */
  if (from.name === ROUTE_NAMES.WORKER_MODIFICATION) {
    const workerModificationStore = useWorkerModificationStore();

    if (workerModificationStore.isChanged) {
      const uiStore = useUiStore();

      uiStore.$patch({
        isWorkerModificationLeaveConfirmModalOpened: true,
      });

      next(false);
      return;
    }

    workerModificationStore.$reset();
  }

  /**
   * 로그인, 온보딩 또는 회원가입 화면으로 진입할 때
   */
  if (
    to.name === ROUTE_NAMES.LOGIN
    || to.name === ROUTE_NAMES.ON_BOARDING
    || to.name === ROUTE_NAMES.SIGNUP_STEP1
    || to.name === ROUTE_NAMES.SIGNUP_STEP2
    || to.name === ROUTE_NAMES.SIGNUP_STEP3
    || to.name === ROUTE_NAMES.SIGNUP_STEP4
    || to.name === ROUTE_NAMES.SIGNUP_STEP5
  ) {
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
  if (to.name === ROUTE_NAMES.CHAT) {
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
