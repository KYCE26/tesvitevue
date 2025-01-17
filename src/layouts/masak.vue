<script setup lang="ts">
import { ref } from 'vue';
import { rawMaterials } from '../data/makanan.js'; // Data bahan mentah
import cookedDishes from '../data/masak.js'; // Data masakan
import Swal from 'sweetalert2';

interface RawMaterial {
  id: number;
  material: string;
  amount: string; // Jumlah bahan mentah, dalam kg
}

interface CookedDish {
  id: number;
  name: string;
  category: string;
  materials: { material: string; amount: string }[]; // Array bahan mentah dan jumlahnya
  status: string; // Status masakan, "Tersedia" atau "Belum"
  date: string;
}

// Simulasi data pengguna yang login
const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
const isAdmin = currentUser.role === 'admin';

// Data bahan mentah dan masakan
const rawMaterialList = ref<RawMaterial[]>(rawMaterials);
const cookedDishList = ref<CookedDish[]>(cookedDishes);

// Fungsi untuk menambahkan masakan baru (Hanya Admin)
const createDish = () => {
  if (!isAdmin) return; // Batasi akses hanya untuk admin

  Swal.fire({
  title: 'Add New Dish',
  html: `
    <div class="flex flex-col items-center space-y-4" style="max-width: 400px; margin: auto;">
      <div class="w-full">
        <label class="block text-sm font-medium text-center">Dish Name</label>
        <input id="dish-name" type="text" class="swal2-input" style="max-width: 100%; text-align: center;" placeholder="Enter dish name" />
      </div>
      <div class="w-full">
        <label class="block text-sm font-medium text-center mt-2">Category</label>
        <input id="dish-category" type="text" class="swal2-input" style="max-width: 100%; text-align: center;" placeholder="Enter category" />
      </div>
      <div class="w-full">
        <label class="block text-sm font-medium text-center mt-4">Select Raw Materials</label>
        <div id="raw-material-container" class="grid grid-cols-1 gap-y-3 mt-2 justify-center" style="width: 100%;">
          ${rawMaterialList.value
            .map(
              (raw) => `
              <div class="flex items-center justify-between space-x-2">
                <div class="flex items-center">
                  <input type="checkbox" class="raw-material-checkbox" value="${raw.id}" />
                  <span class="ml-2">${raw.material} (${raw.amount})</span>
                </div>
                <input
                  type="number"
                  class="raw-material-amount border rounded px-2"
                  style="width: 100px;"
                  placeholder="Amount"
                  disabled
                />
              </div>
            `
            )
            .join('')}
        </div>
      </div>
      <div class="w-full">
        <label class="block text-sm font-medium text-center mt-4">Status</label>
        <select id="dish-status" class="swal2-select" style="text-align-last: center;">
          <option value="Tersedia">Tersedia</option>
          <option value="Belum">Belum</option>
        </select>
      </div>
    </div>
  `,
  showCancelButton: true,
  confirmButtonText: 'Add',
    didOpen: () => {
      const checkboxes = document.querySelectorAll('.raw-material-checkbox');
      checkboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', () => {
          const amountInput = document.querySelectorAll('.raw-material-amount')[index] as HTMLInputElement;
          amountInput.disabled = !(checkbox as HTMLInputElement).checked;
        });
      });
    },
    preConfirm: () => {
      const name = (document.getElementById('dish-name') as HTMLInputElement).value;
      const category = (document.getElementById('dish-category') as HTMLInputElement).value;
      const status = (document.getElementById('dish-status') as HTMLSelectElement).value;

      const selectedMaterials: { material: string; amount: string }[] = [];
      document.querySelectorAll('.raw-material-checkbox').forEach((checkbox, index) => {
        if ((checkbox as HTMLInputElement).checked) {
          const rawMaterial = rawMaterialList.value.find(
            (raw) => raw.id === parseInt((checkbox as HTMLInputElement).value, 10)
          );
          const amountInput = document.querySelectorAll('.raw-material-amount')[index] as HTMLInputElement;
          const amount = parseFloat(amountInput.value);

          if (!rawMaterial || isNaN(amount) || amount <= 0) {
            Swal.showValidationMessage(`Invalid amount for ${rawMaterial?.material || 'selected material'}`);
            return null;
          }

          selectedMaterials.push({ material: rawMaterial.material, amount: `${amount} kg` });
        }
      });

      if (!name || !category || selectedMaterials.length === 0) {
        Swal.showValidationMessage('Please fill in all fields and select at least one raw material');
        return null;
      }

      return { name, category, status, materials: selectedMaterials };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const { name, category, status, materials } = result.value;

      // Tambahkan masakan ke daftar
      cookedDishList.value.push({
        id: cookedDishList.value.length + 1,
        name,
        category,
        materials,
        status,
        date: new Date().toISOString().split('T')[0],
      });

      Swal.fire('Added!', 'New dish has been successfully added.', 'success');
    }
  });
};

// Fungsi untuk menampilkan detail masakan (Akses Semua User)
const showDishDetails = (dish: CookedDish) => {
  const materialsDetails = dish.materials
    .map((item) => `${item.amount} (${item.material})`)
    .join(', ');

  Swal.fire({
    title: dish.name,
    html: `
      <div class="text-left">
        <p><strong>Category:</strong> ${dish.category}</p>
        <p><strong>Amount:</strong> ${materialsDetails}</p>
        <p><strong>Status:</strong> ${dish.status}</p>
        <p><strong>Date:</strong> ${dish.date}</p>
      </div>
    `,
    confirmButtonText: 'Close',
  });
};

// Fungsi untuk menghapus masakan (Hanya Admin)
const deleteDish = (dish: CookedDish) => {
  if (!isAdmin) return; // Batasi akses hanya untuk admin

  Swal.fire({
    title: 'Are you sure?',
    text: `Delete "${dish.name}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {
      // Hapus masakan dari daftar
      const index = cookedDishList.value.findIndex((d) => d.id === dish.id);
      if (index !== -1) {
        cookedDishList.value.splice(index, 1);
      }

      Swal.fire('Deleted!', 'Dish has been deleted.', 'success');
    }
  });
};
</script>

<template>
  <div class="space-y-4">
    <!-- Tombol Tambah (Hanya Admin) -->
    <button
      v-if="isAdmin"
      @click="createDish"
      class="fixed bottom-6 right-6 w-16 h-16 bg-green-500 text-white text-4xl font-bold rounded-full shadow-xl hover:bg-green-600"
      title="Add Dish"
    >
      +
    </button>

    <!-- Daftar Masakan -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="dish in cookedDishList"
        :key="dish.id"
        class="bg-white shadow-md rounded-lg p-4"
      >
        <h3 class="text-lg font-bold">{{ dish.name }}</h3>
        <p class="text-sm text-gray-600">Category: {{ dish.category }}</p>
        <p class="text-sm text-gray-600">
          Amount:
          <span v-for="(material, index) in dish.materials" :key="index">
            {{ material.amount }} ({{ material.material }})<span v-if="index < dish.materials.length - 1">, </span>
          </span>
        </p>
        <p class="text-sm text-gray-600">Status: {{ dish.status }}</p>
        <p class="text-sm text-gray-600">Date: {{ dish.date }}</p>
        <div class="mt-4 flex justify-between">
          <!-- Detail Button (Akses Semua User) -->
          <button
            @click="showDishDetails(dish)"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Detail
          </button>

          <!-- Delete Button (Hanya Admin) -->
          <button
            v-if="isAdmin"
            @click="deleteDish(dish)"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
