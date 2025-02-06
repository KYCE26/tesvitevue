<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header -->
    <Header />

    <!-- Konten Sign Up -->
    <main class="flex-1 bg-gray-100 dark:bg-gray-900">
      <section class="flex flex-col bg-white items-center justify-center px-6 py-8 mx-auto h-screen">
        <div class="w-full bg-white rounded-lg shadow-lg dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
              Sign Up
            </h1>

            <form @submit.prevent="registerUser" class="space-y-4 md:space-y-6">
              <div>
                <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  <i class="fa-solid fa-user mr-2"></i> Nama
                </label>
                <input v-model="name" type="text" id="name" class="input-field" placeholder="Nama Anda" required>
              </div>

              <div>
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  <i class="fa-regular fa-envelope mr-2"></i> Email
                </label>
                <input v-model="email" type="email" id="email" class="input-field" placeholder="Email Anda" required>
              </div>

              <div>
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  <i class="fa-solid fa-lock mr-2"></i> Password
                </label>
                <div class="relative">
                  <input :type="showPassword ? 'text' : 'password'" v-model="password" id="password" placeholder="••••••••" class="input-field" required>
                  <span @click="togglePasswordVisibility" class="password-toggle">
                    <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                  </span>
                </div>
              </div>

              <!-- Role Otomatis Supplier (Hidden) -->
              <input type="hidden" v-model="role">

              <button type="submit" class="btn-primary">
                Daftar
              </button>

              <p class="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                Sudah punya akun? <router-link to="/login" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Masuk di sini</router-link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
import Header from "./Header.vue";
import Footer from "./Footer.vue";
import Swal from "sweetalert2"; // Notifikasi

export default {
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      showPassword: false,
      name: "",
      email: "",
      password: "",
      role: "supplier", // Role otomatis supplier
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async registerUser() {
      try {
        const response = await fetch("https://sidimasbe.vercel.app/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: this.name,
            email: this.email,
            password: this.password,
            role: this.role,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Registrasi Berhasil!",
            text: "Akun Anda telah terdaftar, silakan login.",
          });

          // Redirect ke halaman login setelah sukses
          this.$router.push("/login");
        } else {
          throw new Error(data.message || "Registrasi gagal. Silakan coba lagi.");
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error.message,
        });
      }
    },
  },
};
</script>

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
