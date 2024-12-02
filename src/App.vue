<template>
  <div>
    <!-- Menampilkan Header dan Footer hanya jika tidak di halaman login -->
    <Header v-if="showHeaderFooter" />
    
    <router-view />
    
    <Footer v-if="showHeaderFooter" />
  </div>
</template>

<script>
import Header from './layouts/Header.vue';
import Footer from './layouts/Footer.vue';

export default {
  components: {
    Header,
    Footer,
  },
  computed: {
    showHeaderFooter() {
      // Cek apakah rute yang sedang aktif bukan rute login
      return this.$route.path !== '';
    },
  },
};
</script>
