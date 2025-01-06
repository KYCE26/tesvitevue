<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { rawMaterials, finishedProducts } from '../data/makanan.js';
import Chart from 'chart.js/auto';

const rawMaterialList = ref(rawMaterials);
const finishedProductList = ref(finishedProducts);

const renderCharts = () => {
  const rawStatusData = rawMaterialList.value.reduce((acc, material) => {
    acc[material.status] = (acc[material.status] || 0) + 1;
    return acc;
  }, {});

  new Chart(document.getElementById('rawStatusChart') as HTMLCanvasElement, {
    type: 'pie',
    data: {
      labels: Object.keys(rawStatusData),
      datasets: [
        {
          label: 'Bahan Baku Berdasarkan Status',
          data: Object.values(rawStatusData),
          backgroundColor: ['#4CAF50', '#F44336'],
        },
      ],
    },
  });

  const rawCategoryData = rawMaterialList.value.reduce((acc, material) => {
    acc[material.category] = (acc[material.category] || 0) + 1;
    return acc;
  }, {});

  new Chart(document.getElementById('rawCategoryChart') as HTMLCanvasElement, {
    type: 'bar',
    data: {
      labels: Object.keys(rawCategoryData),
      datasets: [
        {
          label: 'Jumlah Bahan Baku Berdasarkan Kategori',
          data: Object.values(rawCategoryData),
          backgroundColor: '#03A9F4',
        },
      ],
    },
  });

  const finishedStatusData = finishedProductList.value.reduce((acc, product) => {
    acc[product.status] = (acc[product.status] || 0) + 1;
    return acc;
  }, {});

  new Chart(document.getElementById('finishedStatusChart') as HTMLCanvasElement, {
    type: 'pie',
    data: {
      labels: Object.keys(finishedStatusData),
      datasets: [
        {
          label: 'Produk Jadi Berdasarkan Status',
          data: Object.values(finishedStatusData),
          backgroundColor: ['#FF9800', '#E91E63'],
        },
      ],
    },
  });

  const finishedCategoryData = finishedProductList.value.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  new Chart(document.getElementById('finishedCategoryChart') as HTMLCanvasElement, {
    type: 'bar',
    data: {
      labels: Object.keys(finishedCategoryData),
      datasets: [
        {
          label: 'Produk Jadi Berdasarkan Kategori',
          data: Object.values(finishedCategoryData),
          backgroundColor: '#9C27B0',
        },
      ],
    },
  });
};

onMounted(() => {
  renderCharts();
});
</script>

<template>
  <div class="min-h-screen bg-gray-100 py-8 px-4">
    <h1 class="text-4xl font-bold text-gray-800 text-center mb-8">Dashboard Supply</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Card Bahan Baku Berdasarkan Status -->
      <div class="bg-white shadow-md rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">Bahan Baku Berdasarkan Status</h2>
        <canvas id="rawStatusChart"></canvas>
      </div>

      <!-- Card Bahan Baku Berdasarkan Kategori -->
      <div class="bg-white shadow-md rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">Bahan Baku Berdasarkan Kategori</h2>
        <canvas id="rawCategoryChart"></canvas>
      </div>

      <!-- Card Produk Jadi Berdasarkan Status -->
      <div class="bg-white shadow-md rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">Produk Jadi Berdasarkan Status</h2>
        <canvas id="finishedStatusChart"></canvas>
      </div>

      <!-- Card Produk Jadi Berdasarkan Kategori -->
      <div class="bg-white shadow-md rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">Produk Jadi Berdasarkan Kategori</h2>
        <canvas id="finishedCategoryChart"></canvas>
      </div>
    </div>
  </div>
</template>

<style>
/* Tambahkan gaya opsional jika diperlukan */
</style>
