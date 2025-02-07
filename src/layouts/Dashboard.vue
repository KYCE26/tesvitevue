<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import Chart from 'chart.js/auto';

// ✅ API Base URL & Token
const API_URL = "https://sidimasbe.vercel.app/api";
const token = localStorage.getItem('token');

// ✅ State untuk menyimpan data dari API
const rawMaterials = ref([]); // Data Bahan Mentah dari Backend
const finishedProducts = ref([]); // Data Produk Jadi dari Backend
const charts = ref([]); // Simpan referensi Chart.js agar bisa dihapus nanti

// ✅ Fetch Data Bahan Mentah dari API
const fetchRawMaterials = async () => {
  try {
    const response = await fetch(`${API_URL}/bahan`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(`Gagal mengambil data bahan: ${response.status}`);

    const data = await response.json();
    rawMaterials.value = data.Materials || [];

    console.log("🔥 Data Bahan Mentah:", rawMaterials.value);
  } catch (error) {
    console.error("Error fetchRawMaterials:", error);
  }
};

// ✅ Fetch Data Produk Jadi dari API
const fetchFinishedProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/produk`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(`Gagal mengambil data produk: ${response.status}`);

    const data = await response.json();
    finishedProducts.value = data.Products || [];

    console.log("🔥 Data Produk Jadi:", finishedProducts.value);
  } catch (error) {
    console.error("Error fetchFinishedProducts:", error);
  }
};

// ✅ Hapus Chart Sebelum Membuat yang Baru
const destroyExistingCharts = () => {
  charts.value.forEach(chart => chart.destroy());
  charts.value = [];
};

// ✅ Render Chart setelah Data Diambil
const renderCharts = async () => {
  await nextTick(); // 🔹 Pastikan elemen sudah tersedia di DOM
  destroyExistingCharts();

  if (!rawMaterials.value.length && !finishedProducts.value.length) {
    console.warn("⚠️ Data masih kosong, tidak bisa render chart.");
    return;
  }

  // 🔹 Chart Bahan Mentah Berdasarkan Status
  const rawStatusCtx = document.getElementById("rawStatusChart") as HTMLCanvasElement;
  if (rawStatusCtx && rawMaterials.value.length) {
    const rawStatusData = rawMaterials.value.reduce((acc, material) => {
      acc[material.status] = (acc[material.status] || 0) + 1;
      return acc;
    }, {});

    charts.value.push(
      new Chart(rawStatusCtx.getContext("2d"), {
        type: "pie",
        data: {
          labels: Object.keys(rawStatusData),
          datasets: [
            {
              label: "Bahan Baku Berdasarkan Status",
              data: Object.values(rawStatusData),
              backgroundColor: ["#4CAF50", "#F44336"],
            },
          ],
        },
      })
    );
  }

  // 🔹 Chart Bahan Mentah Berdasarkan Kategori
  const rawCategoryCtx = document.getElementById("rawCategoryChart") as HTMLCanvasElement;
  if (rawCategoryCtx && rawMaterials.value.length) {
    const rawCategoryData = rawMaterials.value.reduce((acc, material) => {
      acc[material.kategori] = (acc[material.kategori] || 0) + 1;
      return acc;
    }, {});

    charts.value.push(
      new Chart(rawCategoryCtx.getContext("2d"), {
        type: "bar",
        data: {
          labels: Object.keys(rawCategoryData),
          datasets: [
            {
              label: "Jumlah Bahan Baku Berdasarkan Kategori",
              data: Object.values(rawCategoryData),
              backgroundColor: "#03A9F4",
            },
          ],
        },
      })
    );
  }

  // 🔹 Chart Produk Jadi Berdasarkan Status
  const finishedStatusCtx = document.getElementById("finishedStatusChart") as HTMLCanvasElement;
  if (finishedStatusCtx && finishedProducts.value.length) {
    const finishedStatusData = finishedProducts.value.reduce((acc, product) => {
      acc[product.status] = (acc[product.status] || 0) + 1;
      return acc;
    }, {});

    charts.value.push(
      new Chart(finishedStatusCtx.getContext("2d"), {
        type: "pie",
        data: {
          labels: Object.keys(finishedStatusData),
          datasets: [
            {
              label: "Produk Jadi Berdasarkan Status",
              data: Object.values(finishedStatusData),
              backgroundColor: ["#FF9800", "#E91E63"],
            },
          ],
        },
      })
    );
  }

  // 🔹 Chart Produk Jadi Berdasarkan Kategori
  const finishedCategoryCtx = document.getElementById("finishedCategoryChart") as HTMLCanvasElement;
  if (finishedCategoryCtx && finishedProducts.value.length) {
    const finishedCategoryData = finishedProducts.value.reduce((acc, product) => {
      if (!product.kategori) {
        console.warn(`⚠️ Produk tanpa kategori:`, product);
        return acc;
      }
      acc[product.kategori] = (acc[product.kategori] || 0) + 1;
      return acc;
    }, {});

    charts.value.push(
      new Chart(finishedCategoryCtx.getContext("2d"), {
        type: "bar",
        data: {
          labels: Object.keys(finishedCategoryData),
          datasets: [
            {
              label: "Produk Jadi Berdasarkan Kategori",
              data: Object.values(finishedCategoryData),
              backgroundColor: "#9C27B0",
            },
          ],
        },
      })
    );
  }
};

// ✅ Fetch data saat halaman dimuat & render chart setelah data diambil
onMounted(async () => {
  await fetchRawMaterials();
  await fetchFinishedProducts();
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
