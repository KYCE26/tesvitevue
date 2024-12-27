<script setup lang="ts">
import { ref } from 'vue';
import { rawMaterials, finishedProducts } from '../data/makanan.js';

interface RawMaterial {
  id: number;
  supplier: string;
  material: string;
  amount: string;
  source: string;
  category: string;  // New field for category
  status: string;    // New field for status
}

interface FinishedProduct {
  id: number;
  product: string;
  ingredients: string[];
  category: string;  // New field for category
  status: string;    // New field for status
}

const rawMaterialList = ref<RawMaterial[]>(rawMaterials);
const finishedProductList = ref<FinishedProduct[]>(finishedProducts);

const isEditModalOpen = ref(false);
const isProductModalOpen = ref(false);

const selectedRawMaterial = ref<RawMaterial | null>(null);
const selectedFinishedProduct = ref<FinishedProduct | null>(null);

const categories = ['Makanan Pokok', 'Lauk', 'Minuman', 'Sayuran'];  // List of categories
const statuses = ['Tersedia', 'Habis'];   // List of statuses

function openEditRawModal(material: RawMaterial) {
  selectedRawMaterial.value = { ...material };
  isEditModalOpen.value = true;
}

function saveRawMaterialChanges() {
  if (selectedRawMaterial.value) {
    const index = rawMaterialList.value.findIndex(
      (m) => m.id === selectedRawMaterial.value!.id
    );
    if (index !== -1) {
      rawMaterialList.value[index] = { ...selectedRawMaterial.value };
    }
    closeEditRawModal();
  }
}

function closeEditRawModal() {
  isEditModalOpen.value = false;
  selectedRawMaterial.value = null;
}

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

    <!-- Table for Raw Materials -->
    <h4 class="mt-8 text-xl font-medium text-gray-600">Raw Materials</h4>
    <div class="mt-4">
      <table class="min-w-full border">
        <thead>
          <tr class="bg-gray-50">
            <th class="px-6 py-3 border">Supplier</th>
            <th class="px-6 py-3 border">Material</th>
            <th class="px-6 py-3 border">Amount</th>
            <th class="px-6 py-3 border">Source</th>
            <th class="px-6 py-3 border">Category</th>
            <th class="px-6 py-3 border">Status</th>
            <th class="px-6 py-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="material in rawMaterialList"
            :key="material.id"
            class="bg-white"
          >
            <td class="px-6 py-4 border">{{ material.supplier }}</td>
            <td class="px-6 py-4 border">{{ material.material }}</td>
            <td class="px-6 py-4 border">{{ material.amount }}</td>
            <td class="px-6 py-4 border">{{ material.source }}</td>
            <td class="px-6 py-4 border">{{ material.category }}</td>
            <td class="px-6 py-4 border">{{ material.status }}</td>
            <td class="px-6 py-4 border">
              <button
                @click="openEditRawModal(material)"
                class="px-4 py-2 text-white bg-blue-500 rounded"
              >
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

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

    <!-- Edit Modal for Raw Materials -->
    <div
      v-if="isEditModalOpen"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="w-1/3 p-6 bg-white rounded shadow">
        <h2 class="mb-4 text-lg font-medium text-gray-700">Edit Raw Material</h2>
        <div class="mb-4">
          <label class="block text-sm font-medium">Supplier</label>
          <input
            v-model="selectedRawMaterial.supplier"
            type="text"
            class="w-full px-3 py-2 border rounded"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">Material</label>
          <input
            v-model="selectedRawMaterial.material"
            type="text"
            class="w-full px-3 py-2 border rounded"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">Amount</label>
          <input
            v-model="selectedRawMaterial.amount"
            type="text"
            class="w-full px-3 py-2 border rounded"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">Source</label>
          <input
            v-model="selectedRawMaterial.source"
            type="text"
            class="w-full px-3 py-2 border rounded"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">Category</label>
          <select
            v-model="selectedRawMaterial.category"
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
            v-model="selectedRawMaterial.status"
            class="w-full px-3 py-2 border rounded"
          >
            <option v-for="status in statuses" :key="status" :value="status">
              {{ status }}
            </option>
          </select>
        </div>
        <div class="flex justify-end space-x-4">
          <button @click="closeEditRawModal" class="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button @click="saveRawMaterialChanges" class="px-4 py-2 text-white bg-blue-500 rounded">
            Save
          </button>
        </div>
      </div>
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
