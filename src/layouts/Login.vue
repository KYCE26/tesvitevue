<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header -->
    <Header />

    <!-- Konten Login -->
    <main class="flex-1 bg-gray-100 dark:bg-gray-900">
      <div class="flex flex-col bg-white items-center justify-center px-6 py-8 mx-auto h-screen md:h-screen lg:h-screen">
        <div class="w-full bg-white rounded-lg shadow-lg dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
              Sign in to your account
            </h1>

            <form @submit.prevent="loginUser" class="space-y-4 md:space-y-6">
              <p class="text-center text-red-600">{{ message }}</p>
              <div>
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  <i class="fa-regular fa-envelope mr-2"></i>
                  Email
                </label>
                <input v-model="email" type="email" name="email" id="email" class="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-theme-primary focus:border-theme-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your Email" required>
              </div>
              <div>
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  <i class="fa-solid fa-lock mr-2"></i>
                  Password
                </label>
                <div class="relative">
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    v-model="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pr-9"
                    required
                  />
                  <span
                    @click="togglePasswordVisibility"
                    class="absolute inset-y-0 right-0 flex items-center px-2 focus:outline-none text-gray-500 cursor-pointer dark:text-gray-400 ml-2"
                  >
                    <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                  </span>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input id="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800">
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="remember" class="text-gray-500 dark:text-gray-300">Remember me</label>
                  </div>
                </div>
                <router-link to="/dashboard" class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</router-link>
              </div>
              <button type="submit" class="w-full text-white bg-theme-primary hover:bg-theme-primary-light focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-theme-primary dark:hover:bg-theme-primary-light dark:focus:ring-primary-800">
                Sign in
              </button>
              <p class="flex items-center justify-center text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet? <router-link to="/signup" class="font-medium text-primary-600 hover:underline dark:text-primary-500 ml-1">Sign up</router-link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import Header from '../layouts/Header.vue';
import Footer from '../layouts/Footer.vue';
import router from '../router';  // Router untuk navigasi
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const message = ref('');
const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const loginUser = async () => {
  try {
    // Asumsikan ada backend endpoint untuk login
    await axios.post('http://localhost:4000/login', {
      email: email.value,
      password: password.value,
    });
    router.push('/dashboard'); // Redirect ke dashboard setelah login berhasil
  } catch (error) {
    if (error.response) {
      message.value = error.response.data.message;
    }
  }
};
</script>
