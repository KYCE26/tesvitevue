<script setup>
import Header from '../layouts/Header.vue';
import Footer from '../layouts/Footer.vue';
import router from '../router'; // Router untuk navigasi
import { ref } from 'vue';
import { loginData } from '../data/login.js'; // Impor dummy data login

const email = ref('');
const password = ref('');
const message = ref('');
const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const loginUser = () => {
  // Cari data user berdasarkan email dan password
  const user = loginData.find(
    (user) => user.email === email.value && user.password === password.value
  );

  if (user) {
    // Simpan informasi user ke localStorage/sessionStorage (opsional)
    localStorage.setItem('user', JSON.stringify(user));

    // Redirect berdasarkan role
    if (user.role === 'admin') {
      router.push('/dashboard');
    } else if (user.role === 'supplier') {
      router.push('/dashboard');
    }
  } else {
    // Tampilkan pesan error jika login gagal
    message.value = 'Invalid email or password. Please try again.';
  }
};
</script>

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
                <input
                  v-model="email"
                  type="email"
                  name="email"
                  id="email"
                  class="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-theme-primary focus:border-theme-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Your Email"
                  required
                />
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
              <button
                type="submit"
                class="w-full text-white bg-theme-primary hover:bg-theme-primary-light focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-theme-primary dark:hover:bg-theme-primary-light dark:focus:ring-primary-800"
              >
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
