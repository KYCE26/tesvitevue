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
                  <i class="fa-solid fa-user mr-2"></i> Name
                </label>
                <input v-model="name" type="text" id="name" class="input-field" placeholder="Your Name" required>
              </div>

              <div>
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  <i class="fa-regular fa-envelope mr-2"></i> Email
                </label>
                <input v-model="email" type="email" id="email" class="input-field" placeholder="Your Email" required>
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
                Sign Up
              </button>

              <p class="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                Already have an account? <router-link to="/login" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</router-link>
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
import { loginData } from "../data/login.js"; // Simpan data di lokal storage

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
    registerUser() {
      const newUser = {
        id: loginData.length + 1, // ID otomatis
        email: this.email,
        password: this.password,
        role: this.role, // Role tetap supplier
      };

      // Simpan ke localStorage (simulasi database)
      const users = JSON.parse(localStorage.getItem("users")) || [];
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      console.log("User registered:", newUser);
      alert("Registration successful! You can now login.");

      // Redirect ke login
      this.$router.push("/login");
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
