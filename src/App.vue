<template>
  <div id="app">
    <Navbar />
    <LandingPage />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import LandingPage from './components/LandingPage.vue';

export default {
  name: 'App',
  components: {
    Navbar,
    LandingPage
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}
</style>
