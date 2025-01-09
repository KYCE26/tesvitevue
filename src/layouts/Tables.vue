<script setup lang="ts">
import { ref } from 'vue';
import { rawMaterials } from '../data/makanan.js';
import { loginData } from '../data/login.js';
import Swal from 'sweetalert2';

interface RawMaterial {
  id: number;
  supplier: string;
  supplierId: number; // Menambahkan supplierId
  material: string;
  amount: string;
  source: string;
  category: string;
  status: string;
  date: string;
}

// Data bahan mentah dan user login
const rawMaterialList = ref<RawMaterial[]>(rawMaterials);
const selectedRawMaterial = ref<RawMaterial | null>(null);
const isDetailModalOpen = ref(false);
const isCreateModalOpen = ref(false);
const isEditMode = ref(false);
const currentUser = JSON.parse(localStorage.getItem("user")) || null; // User yang login

// Kategori dan status
const categories = ['Makanan Pokok', 'Lauk', 'Sayuran'];
const statuses = ['Tersedia', 'Habis'];

// Fungsi membuka modal detail
function openDetailModal(material: RawMaterial) {
  selectedRawMaterial.value = { ...material };
  isDetailModalOpen.value = true;
  isEditMode.value = false;
}

// Fungsi membuka modal create
function openCreateModal() {
  selectedRawMaterial.value = {
    id: rawMaterialList.value.length + 1,
    supplier: currentUser.email,
    supplierId: currentUser.id, // Supplier ID diatur otomatis
    material: '',
    amount: '',
    source: '',
    category: '',
    status: '',
    date: new Date().toISOString().split('T')[0], // Default tanggal hari ini
  };
  isCreateModalOpen.value = true;
}

// Fungsi menyimpan bahan mentah baru
function saveNewMaterial() {
  if (selectedRawMaterial.value) {
    rawMaterialList.value.push({ ...selectedRawMaterial.value });
    isCreateModalOpen.value = false;
    Swal.fire({
      title: 'Saved!',
      text: 'New raw material has been successfully added.',
      icon: 'success',
      confirmButtonText: 'OK',
    });
  }
}

// Fungsi mengaktifkan mode edit
function enableEditMode() {
  if (
    currentUser.role === "admin" ||
    selectedRawMaterial.value?.supplierId === currentUser.id
  ) {
    isEditMode.value = true;
  } else {
    Swal.fire({
      title: 'Access Denied',
      text: 'You are not authorized to edit this material.',
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }
}

// Fungsi menyimpan perubahan
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

// Fungsi menutup modal create atau detail
function closeModal() {
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
        isCreateModalOpen.value = false;
        selectedRawMaterial.value = null;
        isEditMode.value = false;
      }
    });
  } else {
    isDetailModalOpen.value = false;
    isCreateModalOpen.value = false;
    selectedRawMaterial.value = null;
  }
}

// Fungsi menghapus data
function deleteMaterial(material: RawMaterial) {
  if (
    currentUser.role === "admin" ||
    material.supplierId === currentUser.id
  ) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        rawMaterialList.value = rawMaterialList.value.filter((m) => m.id !== material.id);
        Swal.fire('Deleted!', 'The material has been deleted.', 'success');
      }
    });
  } else {
    Swal.fire({
      title: 'Access Denied',
      text: 'You are not authorized to delete this material.',
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }
}
</script>

<template>
  <div>
    <h3 class="text-3xl font-medium text-gray-700">Dashboard Supply</h3>

    <!-- Tombol Tambah Bahan Mentah -->
    <div class="mt-4">
      <button
        @click="openCreateModal"
        class="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
      >
        Add Raw Material
      </button>
    </div>

    <!-- Tabel Bahan Mentah -->
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
            class="hover:bg-gray-100 border-b"
          >
            <td class="px-6 py-4">{{ material.material }}</td>
            <td class="px-6 py-4">{{ material.amount }}</td>
            <td class="px-6 py-4">{{ material.status }}</td>
            <td class="px-6 py-4">{{ material.date }}</td>
            <td class="px-6 py-4">
              <button
                @click="openDetailModal(material)"
                class="px-4 py-2 text-white bg-blue-500 rounded"
              >
                Detail
              </button>
              <button
                v-if="currentUser.role === 'admin' || material.supplierId === currentUser.id"
                @click="deleteMaterial(material)"
                class="px-4 py-2 text-white bg-red-500 rounded ml-2"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Create dan Detail -->
    <div
      v-if="isCreateModalOpen || isDetailModalOpen"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="w-1/3 p-6 bg-white rounded shadow">
        <h2 class="mb-4 text-lg font-medium text-gray-700">
          {{ isCreateModalOpen ? "Add Raw Material" : "Detail Raw Material" }}
        </h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium">Supplier</label>
            <input
              v-model="selectedRawMaterial.supplier"
              type="text"
              class="w-full px-3 py-2 border rounded"
              :disabled="true"
            />
          </div>
          <div>
            <label class="block text-sm font-medium">Material</label>
            <input
              v-model="selectedRawMaterial.material"
              type="text"
              class="w-full px-3 py-2 border rounded"
              placeholder="Enter material name"
            />
          </div>
          <div>
            <label class="block text-sm font-medium">Amount</label>
            <input
              v-model="selectedRawMaterial.amount"
              type="number"
              class="w-full px-3 py-2 border rounded"
              placeholder="Enter amount"
            />
          </div>
          <div>
            <label class="block text-sm font-medium">Source</label>
            <input
              v-model="selectedRawMaterial.source"
              type="text"
              class="w-full px-3 py-2 border rounded"
              placeholder="Enter source"
            />
          </div>
          <div>
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
          <div>
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
          <div>
            <label class="block text-sm font-medium">Date</label>
            <input
              v-model="selectedRawMaterial.date"
              type="date"
              class="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
        <div class="flex justify-end mt-4 space-x-4">
          <button
            @click="closeModal"
            class="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            v-if="isCreateModalOpen"
            @click="saveNewMaterial"
            class="px-4 py-2 text-white bg-green-500 rounded"
          >
            Save
          </button>
          <button
            v-if="isDetailModalOpen && isEditMode"
            @click="saveChanges"
            class="px-4 py-2 text-white bg-blue-500 rounded"
          >
            Save
          </button>
          <button
            v-if="isDetailModalOpen && !isEditMode"
            @click="enableEditMode"
            class="px-4 py-2 text-white bg-yellow-500 rounded"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
