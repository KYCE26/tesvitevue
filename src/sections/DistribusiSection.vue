<script setup>
import { distribusiData } from '../data/distribusi.js'; // Import data distribusi
</script>

<template>
  <div class="container mx-auto px-5 pt-10 pb-16">
    <h1 class="text-4xl font-bold text-center mb-12 text-theme-primary">Distribusi Menu</h1>

    <!-- Table for Distribusi -->
    <div class="overflow-x-auto rounded-lg shadow-lg">
      <table class="min-w-full table-auto text-left">
        <thead class="bg-theme-primary text-white">
          <tr>
            <th class="px-6 py-4 border-b">ID</th>
            <th class="px-6 py-4 border-b">Menu</th>
            <th class="px-6 py-4 border-b">Stok</th>
            <th class="px-6 py-4 border-b">Sekolah</th>
            <th class="px-6 py-4 border-b">Tanggal</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="distribusi in distribusiData"
            :key="distribusi.id"
            class="hover:bg-theme-light-gray transition-all"
          >
            <td class="px-6 py-4 border-b">{{ distribusi.id }}</td>
            <td class="px-6 py-4 border-b">{{ distribusi.menu }}</td>
            <td class="px-6 py-4 border-b">{{ distribusi.stok }}</td>
            <td class="px-6 py-4 border-b">{{ distribusi.sekolah }}</td>
            <td class="px-6 py-4 border-b">{{ distribusi.tanggal }}</td>
          </tr>
        </tbody>
      </table>
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

  table {
    border-collapse: collapse;
    width: 100%;
  }

  th, td {
    text-align: left;
  }

  th {
    font-size: 1rem;
    font-weight: bold;
    padding: 1rem;
  }

  td {
    padding: 1rem;
  }

  .hover\:bg-theme-light-gray:hover {
    background-color: var(--theme-light-gray);
  }
</style>
