import { createRouter, createWebHistory } from 'vue-router';
import Main from '../layouts/Main.vue';
import Login from '../layouts/Login.vue';  // Import komponen Login
import signup from '../layouts/Signup.vue';  // Import komponen Register

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main,
  },
  {
    path: '/login',  // Rute untuk login
    name: 'Login',
    component: Login,  // Komponen yang akan ditampilkan
  },
  {
    path: '/signup',  // Rute untuk registrasi
    name: 'signup',
    component: signup,  // Komponen yang akan ditampilkan
  },
  // tambahkan rute lainnya
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
