import { createRouter, createWebHistory } from 'vue-router';
import Beranda from '../views/Beranda.vue';
import Tentang from '../views/Tentang.vue'; // buat komponen Tentang.vue
import Fitur from '../views/Fitur.vue';   // buat komponen Fitur.vue
import Statistik from '../views/Statistik.vue'; // buat komponen Statistik.vue

const routes = [
  {
    path: '/',
    name: 'beranda',
    component: Beranda
  },
  {
    path: '/tentang',
    name: 'tentang',
    component: Tentang
  },
  {
    path: '/fitur',
    name: 'fitur',
    component: Fitur
  },
  {
    path: '/statistik',
    name: 'statistik',
    component: Statistik
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
