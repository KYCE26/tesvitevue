<script setup lang="ts">
import { ref } from 'vue';
import { rawMaterials } from '../data/makanan.js';
import { loginData } from '../data/login.js';
import suppliers from '../data/supplier.js'; // Path harus sesuai
import Swal from 'sweetalert2';

interface RawMaterial {
  id: number;
  supplier: string;
  supplierId: number;
  material: string;
  amount: string;
  source: string;
  category: string;
  status: string;
  date: string;
}

// Data bahan mentah dan user login
const rawMaterialList = ref<RawMaterial[]>(rawMaterials);
const currentUser = JSON.parse(localStorage.getItem("user")) || null; // User yang login

// Daftar supplier
const supplierAccounts = loginData.filter((user) => user.role === 'supplier');



// Kategori dan status
const categories = ['Makanan Pokok', 'Lauk', 'Sayuran'];
const statuses = ['Tersedia', 'Habis'];

// Fungsi untuk menampilkan detail menggunakan SweetAlert
// Fungsi untuk menampilkan detail menggunakan SweetAlert
function showDetail(material: RawMaterial) {
  Swal.fire({
  title: 'Raw Material Detail',
  html: `
    <div class="text-left" style="font-size: 14px;">
      <p><strong>Supplier:</strong> ${material.supplier}</p>
      <p><strong>Material:</strong> ${material.material}</p>
      <p><strong>Amount:</strong> ${material.amount}</p>
      <p><strong>Source:</strong> ${material.source}</p>
      <p><strong>Category:</strong> ${material.category}</p>
      <p><strong>Status:</strong> ${material.status}</p>
      <p><strong>Date:</strong> ${material.date}</p>
    </div>
  `,
  showCancelButton: true,
  cancelButtonText: 'Close',
  showConfirmButton: currentUser?.role === 'admin', // Tampilkan tombol hanya untuk admin
  confirmButtonText: 'Edit',
  customClass: {
    confirmButton: 'bg-yellow-500 text-white px-4 py-2 rounded',
    cancelButton: 'bg-gray-500 text-white px-4 py-2 rounded',
  },
}).then((result) => {
  if (result.isConfirmed && currentUser?.role === 'admin') {
    openEditModal(material);
  }
});
}

// Fungsi untuk membuka modal edit
function openEditModal(material: RawMaterial) {
  Swal.fire({
    title: 'Edit Raw Material',
    html: generateMaterialForm(material),
    showCancelButton: true,
    confirmButtonText: 'Save',
    customClass: {
      popup: 'smaller-swal-popup',
    },
    preConfirm: () => getFormValues(),
  }).then((result) => {
    if (result.isConfirmed) {
      const index = rawMaterialList.value.findIndex((m) => m.id === material.id);
      if (index !== -1) {
        Object.assign(rawMaterialList.value[index], result.value);
        Swal.fire('Saved!', 'Changes have been successfully saved.', 'success');
      }
    }
  });
}

// Fungsi untuk membuka modal create
function openCreateModal() {
  const newMaterial: RawMaterial = {
    id: rawMaterialList.value.length + 1,
    supplier: '',
    supplierId: 0,
    material: '',
    amount: '',
    source: '',
    category: '',
    status: '',
    date: new Date().toISOString().split('T')[0],
  };

  Swal.fire({
    title: 'Add New Raw Material',
    html: generateMaterialForm(newMaterial, true),
    showCancelButton: true,
    confirmButtonText: 'Add',
    customClass: {
      popup: 'smaller-swal-popup',
    },
    preConfirm: () => getFormValues(),
  }).then((result) => {
    if (result.isConfirmed) {
      // Tambahkan data baru ke daftar bahan mentah
      rawMaterialList.value.push({ id: newMaterial.id, ...result.value });
      Swal.fire('Added!', 'New raw material has been successfully added.', 'success');
    }
  });
}



// Fungsi untuk menghasilkan form HTML
function generateMaterialForm(material: RawMaterial, isCreate = false) {
  const supplierOptions = suppliers.map(
    (supplier) =>
      `<option value="${supplier.name}" ${
        supplier.name === material.supplier ? 'selected' : ''
      }>${supplier.name}</option>`
  ).join('');

  return `
    <div class="grid grid-cols-1 gap-4">
      <div>
        <label class="block text-sm font-medium">Supplier</label>
        <select id="form-supplier" class="swal2-select">
          <option value="">-- Select Supplier --</option>
          ${supplierOptions}
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium">Material</label>
        <input id="form-material" type="text" class="swal2-input" value="${material.material}">
      </div>
      <div>
        <label class="block text-sm font-medium">Amount</label>
        <input id="form-amount" type="number" class="swal2-input" value="${material.amount}">
      </div>
      <div>
        <label class="block text-sm font-medium">Source</label>
        <input id="form-source" type="text" class="swal2-input" value="${material.source}">
      </div>
      <div>
        <label class="block text-sm font-medium">Category</label>
        <select id="form-category" class="swal2-select">
          ${categories.map((category) => `<option value="${category}" ${
            category === material.category ? 'selected' : ''
          }>${category}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium">Status</label>
        <select id="form-status" class="swal2-select">
          ${statuses.map((status) => `<option value="${status}" ${
            status === material.status ? 'selected' : ''
          }>${status}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium">Date</label>
        <input id="form-date" type="date" class="swal2-input" value="${material.date}">
      </div>
    </div>
  `;
}




function deleteMaterial(material: RawMaterial) {
  // Tampilkan konfirmasi penghapusan
  Swal.fire({
    title: 'Are you sure?',
    text: "This action cannot be undone!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    customClass: {
      popup: 'smaller-swal-popup',
    },
  }).then((result) => {
    // Jika pengguna mengonfirmasi
    if (result.isConfirmed) {
      // Hapus data dari list
      rawMaterialList.value = rawMaterialList.value.filter((m) => m.id !== material.id);
      // Tampilkan pesan berhasil
      Swal.fire({
        title: 'Deleted!',
        text: 'The material has been deleted successfully.',
        icon: 'success',
        customClass: {
          popup: 'smaller-swal-popup',
        },
      });
    }
  });
}

// Fungsi untuk mengambil nilai dari form
function getFormValues() {
  return {
    supplier: (document.getElementById('form-supplier') as HTMLSelectElement).value,
    material: (document.getElementById('form-material') as HTMLInputElement).value,
    amount: (document.getElementById('form-amount') as HTMLInputElement).value,
    source: (document.getElementById('form-source') as HTMLInputElement).value,
    category: (document.getElementById('form-category') as HTMLSelectElement).value,
    status: (document.getElementById('form-status') as HTMLSelectElement).value,
    date: (document.getElementById('form-date') as HTMLInputElement).value,
  };
}


</script>

<template>
  <div>
    <h3 class="text-3xl font-medium text-gray-700">Dashboard Supply</h3>
    <div class="mt-4" v-if="currentUser.role === 'admin'">
      <button
        @click="openCreateModal"
        class="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
      >
        Add Raw Material
      </button>
    </div>
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
            <td class="px-6 py-4 flex space-x-2">
              <button @click="showDetail(material)" class="px-4 py-2 text-white bg-blue-500 rounded">Detail</button>
              <button v-if="currentUser.role === 'admin'" @click="() => openEditModal(material)" class="px-4 py-2 text-white bg-yellow-500 rounded">Edit</button>
              <button v-if="currentUser.role === 'admin'" @click="deleteMaterial(material)" class="px-4 py-2 text-white bg-red-500 rounded">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  
</template>
<style>
.smaller-swal-popup {
  width: 400px !important; /* Mengatur lebar popup */
  font-size: 14px !important; /* Menyesuaikan ukuran font */
}

.smaller-swal-popup .swal2-input,
.smaller-swal-popup .swal2-select {
  font-size: 14px !important; /* Ukuran input */
  padding: 6px !important; /* Padding input */
}

.smaller-swal-popup .swal2-title {
  font-size: 18px !important; /* Ukuran judul */
  margin-bottom: 10px !important;
}

</style>

