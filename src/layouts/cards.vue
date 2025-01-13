<script setup lang="ts">
import { ref } from 'vue';
import { distribusiData } from '../data/distribusi.js';
import Swal from 'sweetalert2';

interface Distribusi {
  id: number;
  menu: string;
  stok: number;
  sekolah: string;
  tanggal: string;
}

const distribusiList = ref<Distribusi[]>(distribusiData);

// Fungsi untuk menampilkan detail menggunakan SweetAlert
function openDetailModal(distribusi: Distribusi) {
  Swal.fire({
    title: 'Detail Distribusi',
    html: `
      <div class="text-left">
        <p><strong>Menu:</strong> ${distribusi.menu}</p>
        <p><strong>Stok:</strong> ${distribusi.stok}</p>
        <p><strong>Sekolah:</strong> ${distribusi.sekolah}</p>
        <p><strong>Tanggal:</strong> ${distribusi.tanggal}</p>
      </div>
    `,
    showCancelButton: true,
    cancelButtonText: 'Close',
    confirmButtonText: 'Edit',
  }).then((result) => {
    if (result.isConfirmed) {
      openEditModal(distribusi);
    }
  });
}

// Fungsi untuk membuka modal edit
function openEditModal(distribusi: Distribusi) {
  Swal.fire({
    title: 'Edit Distribusi',
    html: `
      <div class="text-left">
        <label class="block text-sm font-medium text-gray-700">Menu</label>
        <input id="menu" type="text" value="${distribusi.menu}" class="swal2-input">
        
        <label class="block text-sm font-medium text-gray-700">Stok</label>
        <input id="stok" type="number" value="${distribusi.stok}" class="swal2-input">
        
        <label class="block text-sm font-medium text-gray-700">Sekolah</label>
        <input id="sekolah" type="text" value="${distribusi.sekolah}" class="swal2-input">
        
        <label class="block text-sm font-medium text-gray-700">Tanggal</label>
        <input id="tanggal" type="date" value="${distribusi.tanggal}" class="swal2-input">
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Save',
    cancelButtonText: 'Cancel',
    preConfirm: () => {
      const menu = (document.getElementById('menu') as HTMLInputElement).value;
      const stok = parseInt((document.getElementById('stok') as HTMLInputElement).value, 10);
      const sekolah = (document.getElementById('sekolah') as HTMLInputElement).value;
      const tanggal = (document.getElementById('tanggal') as HTMLInputElement).value;

      return { menu, stok, sekolah, tanggal };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const index = distribusiList.value.findIndex((item) => item.id === distribusi.id);
      if (index !== -1) {
        distribusiList.value[index] = { ...distribusi, ...result.value };
        Swal.fire('Saved!', 'Distribusi berhasil diperbarui.', 'success');
      }
    }
  });
}

// Fungsi untuk membuka modal tambah data
function openCreateModal() {
  Swal.fire({
    title: 'Tambah Distribusi',
    html: `
      <div class="text-left">
        <label class="block text-sm font-medium text-gray-700">Menu</label>
        <input id="menu" type="text" class="swal2-input">
        
        <label class="block text-sm font-medium text-gray-700">Stok</label>
        <input id="stok" type="number" class="swal2-input">
        
        <label class="block text-sm font-medium text-gray-700">Sekolah</label>
        <input id="sekolah" type="text" class="swal2-input">
        
        <label class="block text-sm font-medium text-gray-700">Tanggal</label>
        <input id="tanggal" type="date" class="swal2-input">
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Add',
    cancelButtonText: 'Cancel',
    preConfirm: () => {
      const menu = (document.getElementById('menu') as HTMLInputElement).value;
      const stok = parseInt((document.getElementById('stok') as HTMLInputElement).value, 10);
      const sekolah = (document.getElementById('sekolah') as HTMLInputElement).value;
      const tanggal = (document.getElementById('tanggal') as HTMLInputElement).value;

      return { menu, stok, sekolah, tanggal };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      distribusiList.value.push({
        id: distribusiList.value.length + 1,
        ...result.value,
      });
      Swal.fire('Added!', 'Distribusi berhasil ditambahkan.', 'success');
    }
  });
}

// Fungsi untuk menghapus data
function deleteDistribusi(distribusi: Distribusi) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    if (result.isConfirmed) {
      distribusiList.value = distribusiList.value.filter((item) => item.id !== distribusi.id);
      Swal.fire('Deleted!', 'Distribusi berhasil dihapus.', 'success');
    }
  });
}
</script>

<template>
  <div>
    <h3 class="text-2xl font-medium text-gray-700 mb-4">Distribusi Menu</h3>
    <div class="mb-4 text-right">
      <button
        @click="openCreateModal"
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        + Add Distribusi
      </button>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-200 shadow rounded-lg">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Menu</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Stok</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Sekolah</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Tanggal</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in distribusiList"
            :key="item.id"
            class="hover:bg-gray-100 border-b border-gray-200"
          >
            <td class="px-6 py-4 text-sm text-gray-700">{{ item.menu }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ item.stok }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ item.sekolah }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ item.tanggal }}</td>
            <td class="px-6 py-4 text-sm text-gray-700 flex space-x-2">
              <button
                @click="openDetailModal(item)"
                class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Detail
              </button>
              <button
                @click="deleteDistribusi(item)"
                class="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
