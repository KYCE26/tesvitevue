<script setup>
import Header from '../layouts/Header.vue';
import Footer from '../layouts/Footer.vue';
import router from '../router';
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
  // Ambil semua user dari loginData & localStorage
  const localUsers = JSON.parse(localStorage.getItem('users')) || [];
  const allUsers = [...loginData, ...localUsers];

  // Cek apakah email & password cocok
  const user = allUsers.find(
    (user) => user.email === email.value && user.password === password.value
  );

  if (user) {
    // Simpan user ke localStorage
    localStorage.setItem('user', JSON.stringify(user));

    // Redirect berdasarkan role
    if (user.role === 'admin') {
      router.push('/dashboard');
    } else if (user.role === 'supplier') {
      router.push('/dashboard-supplier');
    }
  } else {
    // Jika tidak ditemukan, tampilkan error
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
      <div class="flex flex-col bg-white items-center justify-center px-6 py-8 mx-auto h-screen">
        <div class="w-full bg-white rounded-lg shadow-lg dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
              Sign in to your account
            </h1>

            <form @submit.prevent="loginUser" class="space-y-4 md:space-y-6">
              <p class="text-center text-red-600">{{ message }}</p>
              <div>
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  <i class="fa-regular fa-envelope mr-2"></i> Email
                </label>
                <input
                  v-model="email"
                  type="email"
                  id="email"
                  class="input-field"
                  placeholder="Your Email"
                  required
                />
              </div>
              <div>
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  <i class="fa-solid fa-lock mr-2"></i> Password
                </label>
                <div class="relative">
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    v-model="password"
                    id="password"
                    placeholder="••••••••"
                    class="input-field pr-9"
                    required
                  />
                  <span
                    @click="togglePasswordVisibility"
                    class="password-toggle"
                  >
                    <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                  </span>
                </div>
              </div>
              <button type="submit" class="btn-primary">
                Sign in
              </button>
              <p class="flex items-center justify-center text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet? 
                <router-link to="/signup" class="font-medium text-primary-600 hover:underline dark:text-primary-500 ml-1">
                  Sign up
                </router-link>
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

<style scoped>
.input-field {
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  padding: 10px;
  width: 100%;
  border-radius: 5px;
  outline: none;
}

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: gray;
}

.btn-primary {
  width: 100%;
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #45a049;
}
</style>
