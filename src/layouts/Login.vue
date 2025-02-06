<script setup>
import Header from '../layouts/Header.vue';
import Footer from '../layouts/Footer.vue';
import router from '../router';
import { ref } from 'vue';
import Swal from 'sweetalert2';

const username = ref('');
const password = ref('');
const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// ✅ Fungsi Login (Menggunakan Cookie)
const loginUser = async () => {
  try {
    const response = await fetch('https://sidimasbe.vercel.app/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 🔥 Wajib agar cookie login tersimpan
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // ✅ Simpan token ke localStorage
      if (data.Token) {
        localStorage.setItem('token', data.Token); // Simpan token JWT
      }

      // ✅ Simpan data user ke localStorage untuk UI
      localStorage.setItem('user', JSON.stringify({ username: data.Username, role: data.Role }));

      // 🔥 Debugging: Cek apakah token tersimpan
      console.log("Token dari Login:", data.Token);

      // ✅ Notifikasi sukses
      Swal.fire({ icon: 'success', title: 'Login Berhasil!', text: `Selamat datang, ${data.Username}!` });

      // ✅ Redirect berdasarkan role
      if (data.Role === 'admin') {
        router.push('/dashboard');
      } else if (data.Role === 'supplier') {
        router.push('/dashboard-supplier');
      }
    } else {
      throw new Error(data.Message || 'Login gagal. Periksa kembali username dan password Anda.');
    }
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'Error!', text: error.message });
  }
};

// ✅ Fungsi Logout
const logout = async () => {
  try {
    await fetch('https://sidimasbe.vercel.app/logout', {
      method: 'GET',
      credentials: 'include', // 🔥 Pastikan cookie dihapus
    });

    localStorage.removeItem('user');
    Swal.fire({ icon: 'success', title: 'Logout Berhasil!', text: 'Anda telah keluar dari sistem.' });
    router.push('/login');
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'Error!', text: 'Gagal logout' });
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
              Masuk ke Akun Anda
            </h1>

            <form @submit.prevent="loginUser" class="space-y-4 md:space-y-6">
              <div>
                <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  <i class="fa-regular fa-user mr-2"></i> Username
                </label>
                <input
                  v-model="username"
                  type="text"
                  id="username"
                  class="input-field"
                  placeholder="Masukkan Username"
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
                  <span @click="togglePasswordVisibility" class="password-toggle">
                    <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                  </span>
                </div>
              </div>
              <button type="submit" class="btn-primary">
                Masuk
              </button>
              <p class="flex items-center justify-center text-sm font-light text-gray-500 dark:text-gray-400">
                Belum punya akun?
                <router-link to="/signup" class="font-medium text-primary-600 hover:underline dark:text-primary-500 ml-1">
                  Daftar di sini
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
