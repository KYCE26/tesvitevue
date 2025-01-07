<script setup lang="ts">
import { ref } from 'vue';
import { rawMaterials } from '../data/makanan.js';
import Swal from 'sweetalert2';

interface RawMaterial {
  id: number;
  supplier: string;
  material: string;
  amount: string;
  source: string;
  category: string;
  status: string;
  date: string;
}

const rawMaterialList = ref<RawMaterial[]>(rawMaterials);
const selectedRawMaterial = ref<RawMaterial | null>(null);
const isDetailModalOpen = ref(false);
const isEditMode = ref(false);

const categories = ['Makanan Pokok', 'Lauk', 'Sayuran'];
const statuses = ['Tersedia', 'Habis'];

function openDetailModal(material: RawMaterial) {
  selectedRawMaterial.value = { ...material };
  isDetailModalOpen.value = true;
  isEditMode.value = false;
}

function enableEditMode() {
  isEditMode.value = true;
}

function saveChanges() {
  if (selectedRawMaterial.value) {
    const index = rawMaterialList.value.findIndex(
      (m) => m.id === selectedRawMaterial.value?.id
    );
    if (index !== -1) {
      rawMaterialList.value[index] = { ...selectedRawMaterial.value };
    }
    isEditMode.value = false;
    Swal.fire({
      title: 'Saved!',
      text: 'Changes have been successfully saved.',
      icon: 'success',
      confirmButtonText: 'OK',
    });
  }
}

function closeDetailModal() {
  if (isEditMode.value) {
    Swal.fire({
      title: 'Unsaved Changes',
      text: 'You have unsaved changes. Are you sure you want to close?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, close it',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        isDetailModalOpen.value = false;
        selectedRawMaterial.value = null;
        isEditMode.value = false;
      }
    });
  } else {
    isDetailModalOpen.value = false;
    selectedRawMaterial.value = null;
  }
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
            <th class="px-6 py-3 border">Material</th>
            <th class="px-6 py-3 border">Amount</th>
            <th class="px-6 py-3 border">Status</th>
            <th class="px-6 py-3 border">Date</th>
            <th class="px-6 py-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="material in rawMaterialList"
            :key="material.id"
            class="bg-white"
          >
            <td class="px-6 py-4 border">{{ material.material }}</td>
            <td class="px-6 py-4 border">{{ material.amount }}</td>
            <td class="px-6 py-4 border">{{ material.status }}</td>
            <td class="px-6 py-4 border">{{ material.date }}</td>
            <td class="px-6 py-4 border">
              <button
                @click="openDetailModal(material)"
                class="px-4 py-2 text-white bg-blue-500 rounded"
              >
                Detail
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Detail Modal -->
    <div
      v-if="isDetailModalOpen"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="w-1/3 p-6 bg-white rounded shadow">
        <h2 class="mb-4 text-lg font-medium text-gray-700">Detail Raw Material</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium">Supplier</label>
            <input
              v-if="isEditMode"
              v-model="selectedRawMaterial.supplier"
              type="text"
              class="w-full px-3 py-2 border rounded"
            />
            <p v-else class="text-gray-700">{{ selectedRawMaterial?.supplier }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium">Material</label>
            <input
              v-if="isEditMode"
              v-model="selectedRawMaterial.material"
              type="text"
              class="w-full px-3 py-2 border rounded"
            />
            <p v-else class="text-gray-700">{{ selectedRawMaterial?.material }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium">Amount</label>
            <input
              v-if="isEditMode"
              v-model="selectedRawMaterial.amount"
              type="text"
              class="w-full px-3 py-2 border rounded"
            />
            <p v-else class="text-gray-700">{{ selectedRawMaterial?.amount }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium">Source</label>
            <input
              v-if="isEditMode"
              v-model="selectedRawMaterial.source"
              type="text"
              class="w-full px-3 py-2 border rounded"
            />
            <p v-else class="text-gray-700">{{ selectedRawMaterial?.source }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium">Category</label>
            <select
              v-if="isEditMode"
              v-model="selectedRawMaterial.category"
              class="w-full px-3 py-2 border rounded"
            >
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
            <p v-else class="text-gray-700">{{ selectedRawMaterial?.category }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium">Status</label>
            <select
              v-if="isEditMode"
              v-model="selectedRawMaterial.status"
              class="w-full px-3 py-2 border rounded"
            >
              <option v-for="status in statuses" :key="status" :value="status">
                {{ status }}
              </option>
            </select>
            <p v-else class="text-gray-700">{{ selectedRawMaterial?.status }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium">Date</label>
            <input
              v-if="isEditMode"
              v-model="selectedRawMaterial.date"
              type="date"
              class="w-full px-3 py-2 border rounded"
            />
            <p v-else class="text-gray-700">{{ selectedRawMaterial?.date }}</p>
          </div>
        </div>
        <div class="flex justify-end mt-4 space-x-4">
          <button
            v-if="!isEditMode"
            @click="enableEditMode"
            class="px-4 py-2 text-white bg-yellow-500 rounded"
          >
            Edit
          </button>
          <button
            v-if="isEditMode"
            @click="saveChanges"
            class="px-4 py-2 text-white bg-blue-500 rounded"
          >
            Save
          </button>
          <button @click="closeDetailModal" class="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
