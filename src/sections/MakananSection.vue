<script setup>
import { rawMaterials, finishedProducts } from '../data/makanan.js';  // Data bahan mentah dan produk jadi
</script>

<template>
  <div class="container mx-auto px-5 pt-10 pb-16">
    <h1 class="text-4xl font-bold text-center mb-12 text-theme-primary">Informasi Supplier dan Produk</h1>
    
    <!-- Table for Raw Materials -->
    <div class="mb-16">
      <h2 class="text-2xl font-semibold text-center mb-6 text-theme-secondary">Bahan Mentah</h2>
      <div class="overflow-x-auto rounded-lg shadow-lg">
        <table class="min-w-full table-auto text-left">
          <thead class="bg-theme-primary text-white">
            <tr>
              <th class="px-6 py-4 border-b">Supplier</th>
              <th class="px-6 py-4 border-b">Bahan Mentah</th>
              <th class="px-6 py-4 border-b">Jumlah</th>
              <th class="px-6 py-4 border-b">Sumber</th>
              <th class="px-6 py-4 border-b">Kategori</th>
              <th class="px-6 py-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="material in rawMaterials" :key="material.id" class="hover:bg-theme-light-gray">
              <td class="px-6 py-4 border-b">{{ material.supplier }}</td>
              <td class="px-6 py-4 border-b">{{ material.material }}</td>
              <td class="px-6 py-4 border-b">{{ material.amount }}</td>
              <td class="px-6 py-4 border-b">{{ material.source }}</td>
              <td class="px-6 py-4 border-b">{{ material.category }}</td>
              <td class="px-6 py-4 border-b">{{ material.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Table for Finished Products -->
    <div>
      <h2 class="text-2xl font-semibold text-center mb-6 text-theme-secondary">Produk Jadi</h2>
      <div class="overflow-x-auto rounded-lg shadow-lg">
        <table class="min-w-full table-auto text-left">
          <thead class="bg-theme-primary text-white">
            <tr>
              <th class="px-6 py-4 border-b">Produk</th>
              <th class="px-6 py-4 border-b">Bahan Mentah</th>
              <th class="px-6 py-4 border-b">Kategori</th>
              <th class="px-6 py-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in finishedProducts" :key="product.id" class="hover:bg-theme-light-gray">
              <td class="px-6 py-4 border-b">{{ product.product }}</td>
              <td class="px-6 py-4 border-b">{{ product.ingredients.join(', ') }}</td>
              <td class="px-6 py-4 border-b">{{ product.category }}</td>
              <td class="px-6 py-4 border-b">{{ product.status }}</td>
            </tr>
          </tbody>
        </table>
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
