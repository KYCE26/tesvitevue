<script setup lang="ts">
import { ref, computed } from 'vue';
import Swal from 'sweetalert2';
import suppliers from '../data/supplier.js';

interface Supplier {
  id: number;
  name: string;
  address: string;
  contact: string;
  certifications: string;
  verified: boolean;
  picture: string | null;
}

// Ambil data user dari localStorage
const user = JSON.parse(localStorage.getItem('user') || '{}');
const isAdmin = user.role === 'admin'; // Cek apakah user adalah admin
const suppliersData = ref<Supplier[]>(suppliers);

// Computed untuk menampilkan data sesuai role
const filteredSuppliers = computed(() => {
  if (isAdmin) {
    // Admin dapat melihat semua data
    return suppliersData.value;
  } else {
    // Supplier hanya dapat melihat data miliknya
    return suppliersData.value.filter((supplier) => supplier.id === user.id);
  }
});

// Fungsi detail modal (akses untuk semua user)
const showDetailModal = (supplier: Supplier) => {
  Swal.fire({
    title: `${supplier.name}`,
    html: `
      <div class="text-left">
        <p><strong>Address:</strong> ${supplier.address}</p>
        <p><strong>Contact:</strong> ${supplier.contact}</p>
        <p><strong>Certifications:</strong> ${supplier.certifications}</p>
        <p><strong>Verified:</strong> ${supplier.verified ? 'Yes' : 'No'}</p>
      </div>
    `,
    confirmButtonText: 'Close',
  });
};

// CRUD functions hanya untuk admin atau supplier miliknya
const openEditModal = (supplier: Supplier | null = null) => {
  const isEdit = !!supplier;
  const defaultData = supplier || {
    id: user.id,
    name: '',
    address: '',
    contact: '',
    certifications: '',
    verified: false,
    picture: null,
  };

  Swal.fire({
    title: isEdit ? 'Edit Supplier' : 'Add Supplier',
    html: `
      <label>Name</label>
      <input id="name" value="${defaultData.name}" class="swal2-input" />
      <label>Address</label>
      <input id="address" value="${defaultData.address}" class="swal2-input" />
      <label>Contact</label>
      <input id="contact" value="${defaultData.contact}" class="swal2-input" />
      <label>Certifications</label>
      <input id="certifications" value="${defaultData.certifications}" class="swal2-input" />
    `,
    showCancelButton: true,
    confirmButtonText: isEdit ? 'Save' : 'Add',
    preConfirm: () => ({
      name: (document.getElementById('name') as HTMLInputElement).value,
      address: (document.getElementById('address') as HTMLInputElement).value,
      contact: (document.getElementById('contact') as HTMLInputElement).value,
      certifications: (document.getElementById('certifications') as HTMLInputElement).value,
    }),
  }).then((result) => {
    if (result.isConfirmed) {
      if (isEdit) {
        const index = suppliersData.value.findIndex((s) => s.id === supplier?.id);
        if (index !== -1) {
          suppliersData.value[index] = { ...suppliersData.value[index], ...result.value };
          Swal.fire('Saved!', 'Supplier updated successfully.', 'success');
        }
      } else {
        // Batasi supplier hanya dapat membuat data sekali
        const supplierExists = suppliersData.value.some((s) => s.id === user.id);
        if (supplierExists) {
          Swal.fire('Error', 'You can only create one supplier profile.', 'error');
        } else {
          suppliersData.value.push({ id: defaultData.id, ...result.value });
          Swal.fire('Added!', 'New supplier added successfully.', 'success');
        }
      }
    }
  });
};

// Delete supplier (Hanya untuk admin)
const deleteSupplier = (supplier: Supplier) => {
  if (!isAdmin) return; // Batasi akses
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {
      suppliersData.value = suppliersData.value.filter((s) => s.id !== supplier.id);
      Swal.fire('Deleted!', 'Supplier deleted.', 'success');
    }
  });
};
</script>

<template>
  <div>
    <h3 class="text-3xl font-medium text-gray-700">Supplier Profiles</h3>

    <!-- Add Supplier Button -->
    <div v-if="isAdmin || !suppliersData.some(s => s.id === user.id)" class="mt-4">
      <button @click="openEditModal(null)" class="px-4 py-2 text-white bg-green-500 rounded">
        Add Supplier
      </button>
    </div>

    <!-- Supplier List -->
    <div class="mt-8">
      <h4 class="text-xl font-medium text-gray-600">Supplier List</h4>
      <div class="mt-4 overflow-x-auto">
        <table class="min-w-full bg-white border">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-6 py-3 text-left text-sm">Name</th>
              <th class="px-6 py-3 text-left text-sm">Contact</th>
              <th class="px-6 py-3 text-left text-sm">Verified</th>
              <th class="px-6 py-3 text-left text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="supplier in filteredSuppliers" :key="supplier.id" class="hover:bg-gray-100">
              <td class="px-6 py-4">{{ supplier.name }}</td>
              <td class="px-6 py-4">{{ supplier.contact }}</td>
              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 rounded"
                  :class="supplier.verified ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'"
                >
                  {{ supplier.verified ? 'Yes' : 'No' }}
                </span>
              </td>
              <td class="px-6 py-4 flex space-x-2">
                <!-- Detail Button -->
                <button
                  @click="showDetailModal(supplier)"
                  class="px-4 py-2 text-white bg-blue-500 rounded"
                >
                  Detail
                </button>
                <!-- Edit Button -->
                <button
                  v-if="isAdmin || supplier.id === user.id"
                  @click="openEditModal(supplier)"
                  class="px-4 py-2 text-white bg-yellow-500 rounded"
                >
                  Edit
                </button>
                <!-- Delete Button -->
                <button
                  v-if="isAdmin"
                  @click="deleteSupplier(supplier)"
                  class="px-4 py-2 text-white bg-red-500 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
