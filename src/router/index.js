import { createRouter, createWebHistory } from 'vue-router';
import Main from '../layouts/Main.vue';
import Login from '../layouts/Login.vue';  // Import komponen Login
import signup from '../layouts/Signup.vue';  // Import komponen Register
import Dashboard from '../layouts/Dashboard.vue';
import Tables from '../layouts/Tables.vue';
import Profile from '../layouts/Profile.vue';
import Supplier from '../layouts/Supplier.vue';
import Makanan from '../sections/MakananSection.vue';
import TableMakanan from '../layouts/Table-Makanan.vue';
import Produkjadi from '../layouts/produkjadi.vue';
import Cards from '../layouts/cards.vue';


const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main,
    meta: { layout: 'empty' },
  },
  {
    path: '/login',  // Rute untuk login
    name: 'Login',
    component: Login,  // Komponen yang akan ditampilkan
    meta: { layout: 'empty' },
  },
  {
    path: '/signup',  // Rute untuk registrasi
    name: 'signup',
    component: signup,  // Komponen yang akan ditampilkan
    meta: { layout: 'empty' },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/tables',
    name: 'Tables',
    component: Tables,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
  },
  {
    path: '/profile-supplier',
    name: 'Supplier',
    component: Supplier,
    meta: { layout: 'empty' },
  },
  {
    path: '/table-makanan',
    name: 'Table-Makanan',
    component: TableMakanan,
    meta: { layout: 'empty' },
  },
  {
    path: '/produkjadi',
    name: 'ProdukJadi',
    component: Produkjadi,
  },
  {
    path: '/cards',
    name: 'Cards',
    component: Cards,
  },
  // tambahkan rute lainnya
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
