<script setup lang="ts">
import { ref } from 'vue';
import { rawMaterials } from '../data/makanan.js';
import { loginData } from '../data/login.js';
import suppliers from '../data/supplier.js'; // Pastikan path sesuai
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

// Daftar supplier dari loginData
const supplierAccounts = loginData.filter((user) => user.role === 'supplier');

// Kategori dan status
const categories = ['Makanan Pokok', 'Lauk', 'Sayuran'];
const statuses = ['Tersedia', 'Habis'];

// Fungsi untuk menampilkan detail menggunakan SweetAlert
function showDetail(material: RawMaterial) {
  Swal.fire({
    title: 'Detail Bahan Mentah',
    html: `
      <div class="text-left" style="font-size: 14px;">
        <p><strong>Supplier:</strong> ${material.supplier}</p>
        <p><strong>Bahan Mentah:</strong> ${material.material}</p>
        <p><strong>Jumlah:</strong> ${material.amount} kg</p>
        <p><strong>Sumber:</strong> ${material.source}</p>
        <p><strong>Kategori:</strong> ${material.category}</p>
        <p><strong>Status:</strong> ${material.status}</p>
        <p><strong>Tanggal:</strong> ${material.date}</p>
      </div>
    `,
    showCancelButton: true,
    cancelButtonText: 'Tutup',
    showConfirmButton: currentUser?.role === 'admin',
    confirmButtonText: 'Edit',
  }).then((result) => {
    if (result.isConfirmed && currentUser?.role === 'admin') {
      openEditModal(material);
    }
  });
}

// Fungsi untuk membuka modal edit
function openEditModal(material: RawMaterial) {
  Swal.fire({
    title: 'Edit Bahan Mentah',
    html: generateMaterialForm(material),
    showCancelButton: true,
    confirmButtonText: 'Simpan',
    preConfirm: () => getFormValues(),
  }).then((result) => {
    if (result.isConfirmed) {
      const index = rawMaterialList.value.findIndex((m) => m.id === material.id);
      if (index !== -1) {
        Object.assign(rawMaterialList.value[index], result.value);
        Swal.fire('Tersimpan!', 'Perubahan telah berhasil disimpan.', 'success');
      }
    }
  });
}

// Fungsi untuk membuka modal tambah
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
    title: 'Tambah Bahan Mentah',
    html: generateMaterialForm(newMaterial, true),
    showCancelButton: true,
    confirmButtonText: 'Tambah',
    preConfirm: () => getFormValues(),
  }).then((result) => {
    if (result.isConfirmed) {
      rawMaterialList.value.push({ id: newMaterial.id, ...result.value });
      Swal.fire('Berhasil!', 'Bahan mentah berhasil ditambahkan.', 'success');
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
          <option value="">-- Pilih Supplier --</option>
          ${supplierOptions}
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium">Bahan Mentah</label>
        <input id="form-material" type="text" class="swal2-input" value="${material.material}">
      </div>
      <div>
        <label class="block text-sm font-medium">Jumlah (kg)</label>
        <input id="form-amount" type="number" class="swal2-input" value="${material.amount}">
      </div>
      <div>
        <label class="block text-sm font-medium">Sumber</label>
        <input id="form-source" type="text" class="swal2-input" value="${material.source}">
      </div>
      <div>
        <label class="block text-sm font-medium">Kategori</label>
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
        <label class="block text-sm font-medium">Tanggal</label>
        <input id="form-date" type="date" class="swal2-input" value="${material.date}">
      </div>
    </div>
  `;
}

// Fungsi untuk menghapus bahan mentah
function deleteMaterial(material: RawMaterial) {
  Swal.fire({
    title: 'Hapus Bahan Mentah?',
    text: "Data ini tidak dapat dikembalikan!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal',
  }).then((result) => {
    if (result.isConfirmed) {
      rawMaterialList.value = rawMaterialList.value.filter((m) => m.id !== material.id);
      Swal.fire('Terhapus!', 'Bahan mentah telah dihapus.', 'success');
    }
  });
}

// Fungsi untuk mengambil nilai dari form
function getFormValues() {
  return {
    supplier: (document.getElementById('form-supplier') as HTMLSelectElement).value,
    material: (document.getElementById('form-material') as HTMLInputElement).value,
    amount: `${(document.getElementById('form-amount') as HTMLInputElement).value} kg`,
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
      <button @click="openCreateModal" class="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">
        Tambah Bahan Mentah
      </button>
    </div>
    <h4 class="mt-8 text-xl font-medium text-gray-600">Bahan Mentah</h4>
    <div class="mt-4">
      <table class="min-w-full border">
        <thead>
          <tr class="bg-gray-50">
            <th class="px-6 py-3 border">Bahan Mentah</th>
            <th class="px-6 py-3 border">Jumlah (kg)</th>
            <th class="px-6 py-3 border">Status</th>
            <th class="px-6 py-3 border">Tanggal</th>
            <th class="px-6 py-3 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="material in rawMaterialList" :key="material.id" class="hover:bg-gray-100 border-b">
            <td class="px-6 py-4">{{ material.material }}</td>
            <td class="px-6 py-4">{{ material.amount }}</td>
            <td class="px-6 py-4">{{ material.status }}</td>
            <td class="px-6 py-4">{{ material.date }}</td>
            <td class="px-6 py-4 flex space-x-2">
              <button @click="showDetail(material)" class="px-4 py-2 text-white bg-blue-500 rounded">Detail</button>
              <button v-if="currentUser.role === 'admin'" @click="() => openEditModal(material)" class="px-4 py-2 text-white bg-yellow-500 rounded">Edit</button>
              <button v-if="currentUser.role === 'admin'" @click="deleteMaterial(material)" class="px-4 py-2 text-white bg-red-500 rounded">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
