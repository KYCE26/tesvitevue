<script setup lang="ts">
import { ref } from 'vue';
import suppliers from '../data/supplier.js';

interface Supplier {
  id: number;
  name: string;
  address: string;
  contact: string;
  certifications: string;
  details: {
    picture: string | null;
  };
}

const suppliersData = ref<Supplier[]>(suppliers); // Menyimpan data supplier dalam reactive variable

const editModalOpen = ref(false);
const selectedSupplier = ref<Supplier | null>(null);
const imagePreview = ref<string | null>(null);

// Function untuk membuka modal edit
const openEditModal = (supplier: Supplier) => {
  selectedSupplier.value = { ...supplier };
  imagePreview.value = supplier.details.picture; // Set image preview from existing data
  editModalOpen.value = true;
};

// Function untuk menangani upload gambar
const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input && input.files?.length) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      imagePreview.value = e.target?.result as string;
      if (selectedSupplier.value) {
        selectedSupplier.value.details.picture = imagePreview.value;
      }
    };
    reader.readAsDataURL(file);
  }
};

// Function untuk menyimpan perubahan
const saveChanges = () => {
  if (selectedSupplier.value) {
    const index = suppliersData.value.findIndex(s => s.id === selectedSupplier.value.id);
    if (index !== -1) {
      suppliersData.value[index] = { ...selectedSupplier.value }; // Update data supplier
    }
  }
  editModalOpen.value = false; // Close modal after save
};

// Function untuk menutup modal
const closeModal = () => {
  editModalOpen.value = false; // Close modal without saving
};
</script>

<template>
  <div>
    <h3 class="text-3xl font-medium text-gray-700">
      Supplier Profiles
    </h3>

    <div class="mt-8">
      <h4 class="text-gray-600">
        Supplier List
      </h4>

      <div class="mt-6">
        <div class="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8">
          <div class="inline-block min-w-full overflow-hidden rounded-lg shadow">
            <table class="min-w-full leading-normal">
              <thead>
                <tr>
                  <th
                    class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                  >
                    Name
                  </th>
                  <th
                    class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                  >
                    Address
                  </th>
                  <th
                    class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                  >
                    Contact
                  </th>
                  <th
                    class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                  >
                    Certifications
                  </th>
                  <th
                    class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="supplier in suppliersData" :key="supplier.id">
  <td class="px-5 py-5">{{ supplier.name }}</td>
  <td class="px-5 py-5">{{ supplier.details.address }}</td> <!-- Mengakses address dari details -->
  <td class="px-5 py-5">{{ supplier.details.contact }}</td> <!-- Mengakses contact dari details -->
  <td class="px-5 py-5">{{ supplier.details.certifications.join(', ') }}</td> <!-- Mengakses certifications dari details dan menggabungkannya -->
  <td class="px-5 py-5">
    <button
      @click="openEditModal(supplier)"
      class="px-4 py-2 text-white bg-blue-500 rounded"
    >
      Edit
    </button>
  </td>
</tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Edit Supplier -->
    <div v-if="editModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="w-1/3 p-6 bg-white rounded shadow">
        <h2 class="mb-4 text-lg font-medium text-gray-700">Edit Supplier</h2>
        <div class="mb-4">
          <label class="block text-sm font-medium">Name</label>
          <input
            v-model="selectedSupplier.name"
            type="text"
            class="w-full px-3 py-2 border rounded"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">Address</label>
          <input
            v-model="selectedSupplier.details.address"
            type="text"
            class="w-full px-3 py-2 border rounded"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">Contact</label>
          <input
            v-model="selectedSupplier.details.contact"
            type="text"
            class="w-full px-3 py-2 border rounded"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">Certifications</label>
          <input
            v-model="selectedSupplier.details.certifications"
            type="text"
            class="w-full px-3 py-2 border rounded"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">Picture</label>
          <input
            type="file"
            accept="image/*"
            @change="handleImageUpload"
            class="w-full px-3 py-2 border rounded"
          />
          <div v-if="imagePreview" class="mt-2">
            <img :src="imagePreview" alt="Image preview" class="w-32 h-32 object-cover rounded" />
          </div>
        </div>
        <div class="flex justify-end space-x-4">
          <button @click="closeModal" class="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button @click="saveChanges" class="px-4 py-2 text-white bg-blue-500 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
