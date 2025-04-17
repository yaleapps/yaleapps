import { RouteRecordRaw } from 'vue-router';
import MainLayout from 'layouts/MainLayout.vue';
import Index from 'pages/IndexPage.vue';
import About from 'pages/AboutPage.vue';
import Privacy from 'pages/PrivacyPage.vue';
import Install from 'pages/InstallPage.vue';
import Android from 'pages/AndroidPage.vue';
import Menus from 'pages/MenusPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [{ path: '', component: Index }],
  },
  {
    path: '/about',
    component: MainLayout,
    children: [{ path: '', component: About }],
  },
  {
    path: '/privacy',
    component: MainLayout,
    children: [{ path: '', component: Privacy }],
  },
  {
    path: '/menus',
    component: MainLayout,
    children: [{ path: '', component: Menus }],
  },
  {
    path: '/install',
    component: MainLayout,
    children: [{ path: '', component: Install }],
  },
  {
    path: '/android',
    component: MainLayout,
    children: [{ path: '', component: Android }],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
