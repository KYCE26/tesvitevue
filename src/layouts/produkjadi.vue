<script setup lang="ts">
import { ref } from 'vue';
import { finishedProducts } from '../data/makanan.js';

interface FinishedProduct {
  id: number;
  product: string;
  ingredients: string[];
  category: string;  // New field for category
  status: string;    // New field for status
}

const finishedProductList = ref<FinishedProduct[]>(finishedProducts);

const isProductModalOpen = ref(false);
const selectedFinishedProduct = ref<FinishedProduct | null>(null);

const categories = ['Makanan Pokok', 'Lauk', 'Minuman', 'Sayuran'];  // List of categories
const statuses = ['Tersedia', 'Habis'];   // List of statuses

function openEditProductModal(product: FinishedProduct) {
  selectedFinishedProduct.value = { ...product };
  isProductModalOpen.value = true;
}

function saveProductChanges() {
  if (selectedFinishedProduct.value) {
    const index = finishedProductList.value.findIndex(
      (p) => p.id === selectedFinishedProduct.value!.id
    );
    if (index !== -1) {
      finishedProductList.value[index] = { ...selectedFinishedProduct.value };
    }
    closeEditProductModal();
  }
}

function closeEditProductModal() {
  isProductModalOpen.value = false;
  selectedFinishedProduct.value = null;
}
</script>

<template>
  <div>
    <h3 class="text-3xl font-medium text-gray-700">Dashboard Supply</h3>

    <!-- Table for Finished Products -->
    <h4 class="mt-8 text-xl font-medium text-gray-600">Finished Products</h4>
    <div class="mt-4">
      <table class="min-w-full border">
        <thead>
          <tr class="bg-gray-50">
            <th class="px-6 py-3 border">Product</th>
            <th class="px-6 py-3 border">Ingredients</th>
            <th class="px-6 py-3 border">Category</th>
            <th class="px-6 py-3 border">Status</th>
            <th class="px-6 py-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="product in finishedProductList"
            :key="product.id"
            class="bg-white"
          >
            <td class="px-6 py-4 border">{{ product.product }}</td>
            <td class="px-6 py-4 border">
              <ul>
                <li v-for="ingredient in product.ingredients" :key="ingredient">
                  {{ ingredient }}
                </li>
              </ul>
            </td>
            <td class="px-6 py-4 border">{{ product.category }}</td>
            <td class="px-6 py-4 border">{{ product.status }}</td>
            <td class="px-6 py-4 border">
              <button
                @click="openEditProductModal(product)"
                class="px-4 py-2 text-white bg-blue-500 rounded"
              >
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit Modal for Finished Products -->
    <div
      v-if="isProductModalOpen"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="w-1/3 p-6 bg-white rounded shadow">
        <h2 class="mb-4 text-lg font-medium text-gray-700">Edit Finished Product</h2>
        <div class="mb-4">
          <label class="block text-sm font-medium">Product</label>
          <input
            v-model="selectedFinishedProduct.product"
            type="text"
            class="w-full px-3 py-2 border rounded"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">Ingredients</label>
          <textarea
            v-model="selectedFinishedProduct.ingredients"
            class="w-full px-3 py-2 border rounded"
          ></textarea>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">Category</label>
          <select
            v-model="selectedFinishedProduct.category"
            class="w-full px-3 py-2 border rounded"
          >
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">Status</label>
          <select
            v-model="selectedFinishedProduct.status"
            class="w-full px-3 py-2 border rounded"
          >
            <option v-for="status in statuses" :key="status" :value="status">
              {{ status }}
            </option>
          </select>
        </div>
        <div class="flex justify-end space-x-4">
          <button @click="closeEditProductModal" class="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button @click="saveProductChanges" class="px-4 py-2 text-white bg-blue-500 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
