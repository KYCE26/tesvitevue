<script setup>
import menuData from '../data/menu.js'; // Import data menu
</script>

<template>
  <div class="container mx-auto px-5 pt-10 pb-16">
    <h1 class="text-4xl font-bold text-center mb-12 text-theme-primary">Menu</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      <div
        v-for="menu in menuData"
        :key="menu.id"
        class="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-shadow duration-300"
      >
        <!-- Nama Menu -->
        <h2 class="text-xl font-semibold text-theme-primary mb-4">{{ menu.name }}</h2>

        <!-- Daftar Hidangan -->
        <div>
          <p class="font-semibold text-gray-700 mb-2">Isi:</p>
          <ul class="list-disc list-inside text-gray-600">
            <li v-for="(dish, index) in menu.dishes" :key="index">
              {{ dish.name }} (Stock: {{ dish.stock }})
            </li>
          </ul>
        </div>

        <!-- Informasi Tambahan -->
        <div class="mt-4 text-sm text-gray-500">
          <p><strong>Total Stock:</strong> {{ menu.stock }}</p>
          <p><strong>Tanggal:</strong> {{ menu.date }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* Custom Theme Colors */
  :root {
    --theme-primary: #4CAF50;
    --theme-secondary: #FF9800;
    --theme-light-gray: #f3f4f6;
  }
</style>
