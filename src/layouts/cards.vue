<script setup lang="ts">
import { ref } from 'vue';
import { finishedProducts } from '../data/makanan.js';
import { distribusiData } from '../data/distribusi.js';
import Swal from 'sweetalert2';

interface Distribusi {
  id: number;
  menu: string;
  stok: number;
  sekolah: string;
  tanggal: string;
}

interface FinishedProduct {
  id: number;
  product: string;
  stock: number; // Stok
  category: string;
  status: string;
  date: string;
}

const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
const distribusiList = ref<Distribusi[]>(distribusiData);
const finishedProductList = ref<FinishedProduct[]>(finishedProducts);

// Fungsi untuk menambah distribusi
function openCreateModal() {
  if (currentUser?.role !== 'admin') return;

  Swal.fire({
    title: 'Tambah Distribusi',
    html: `
      <div class="text-left">
        <label class="block text-sm font-medium text-gray-700">Pilih Menu</label>
        <select id="menu" class="swal2-select">
          ${finishedProductList.value
            .map(
              (product) =>
                `<option value="${product.id}" ${
                  product.stock > 0 ? '' : 'disabled'
                }>${product.product} (Stok: ${product.stock})</option>`
            )
            .join('')}
        </select>

        <label class="block text-sm font-medium text-gray-700 mt-4">Jumlah Stok</label>
        <input id="stok" type="number" min="1" class="swal2-input" placeholder="Jumlah stok yang didistribusikan" />

        <label class="block text-sm font-medium text-gray-700 mt-4">Sekolah</label>
        <input id="sekolah" type="text" class="swal2-input" placeholder="Nama sekolah" />

        <label class="block text-sm font-medium text-gray-700 mt-4">Tanggal</label>
        <input id="tanggal" type="date" class="swal2-input" />
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Tambah',
    preConfirm: () => {
      const menuId = parseInt((document.getElementById('menu') as HTMLSelectElement).value, 10);
      const stok = parseInt((document.getElementById('stok') as HTMLInputElement).value, 10);
      const sekolah = (document.getElementById('sekolah') as HTMLInputElement).value;
      const tanggal = (document.getElementById('tanggal') as HTMLInputElement).value;

      const selectedProduct = finishedProductList.value.find((p) => p.id === menuId);

      if (!selectedProduct) {
        Swal.showValidationMessage('Menu tidak valid.');
        return null;
      }

      if (stok <= 0 || stok > selectedProduct.stock) {
        Swal.showValidationMessage(`Stok harus antara 1 hingga ${selectedProduct.stock}`);
        return null;
      }

      if (!sekolah || !tanggal) {
        Swal.showValidationMessage('Harap isi semua kolom.');
        return null;
      }

      return { menuId, menu: selectedProduct.product, stok, sekolah, tanggal };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const { menuId, menu, stok, sekolah, tanggal } = result.value;

      // Kurangi stok dari produk selesai
      const productIndex = finishedProductList.value.findIndex((p) => p.id === menuId);
      if (productIndex !== -1) {
        finishedProductList.value[productIndex].stock -= stok;
      }

      // Tambahkan distribusi baru
      distribusiList.value.push({
        id: distribusiList.value.length + 1,
        menu,
        stok,
        sekolah,
        tanggal,
      });

      Swal.fire('Berhasil!', 'Distribusi berhasil ditambahkan.', 'success');
    }
  });
}

// Fungsi untuk melihat detail distribusi
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
    confirmButtonText: 'Tutup',
  });
}

// Fungsi untuk mengedit distribusi
function openEditModal(distribusi: Distribusi) {
  if (currentUser?.role !== 'admin') return;

  Swal.fire({
    title: 'Edit Distribusi',
    html: `
      <div class="text-left">
        <label class="block text-sm font-medium text-gray-700">Menu</label>
        <input id="menu" type="text" value="${distribusi.menu}" class="swal2-input" disabled />
        
        <label class="block text-sm font-medium text-gray-700 mt-4">Jumlah Stok</label>
        <input id="stok" type="number" min="1" value="${distribusi.stok}" class="swal2-input" />
        
        <label class="block text-sm font-medium text-gray-700 mt-4">Sekolah</label>
        <input id="sekolah" type="text" value="${distribusi.sekolah}" class="swal2-input" />
        
        <label class="block text-sm font-medium text-gray-700 mt-4">Tanggal</label>
        <input id="tanggal" type="date" value="${distribusi.tanggal}" class="swal2-input" />
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Simpan',
    preConfirm: () => {
      const stok = parseInt((document.getElementById('stok') as HTMLInputElement).value, 10);
      const sekolah = (document.getElementById('sekolah') as HTMLInputElement).value;
      const tanggal = (document.getElementById('tanggal') as HTMLInputElement).value;

      if (stok <= 0) {
        Swal.showValidationMessage('Stok harus lebih dari 0');
        return null;
      }

      if (!sekolah || !tanggal) {
        Swal.showValidationMessage('Harap isi semua kolom.');
        return null;
      }

      return { stok, sekolah, tanggal };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const { stok, sekolah, tanggal } = result.value;

      // Update stok di finishedProducts jika stok diubah
      const product = finishedProductList.value.find((p) => p.product === distribusi.menu);
      if (product) {
        const stokDiff = distribusi.stok - stok; // Hitung selisih stok
        product.stock += stokDiff; // Sesuaikan stok
      }

      // Update data distribusi
      const index = distribusiList.value.findIndex((d) => d.id === distribusi.id);
      if (index !== -1) {
        distribusiList.value[index] = { ...distribusi, stok, sekolah, tanggal };
      }

      Swal.fire('Berhasil!', 'Distribusi berhasil diperbarui.', 'success');
    }
  });
}

// Fungsi untuk menghapus distribusi
function deleteDistribusi(distribusi: Distribusi) {
  Swal.fire({
    title: 'Yakin ingin menghapus?',
    text: "Data distribusi ini akan dihapus!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus!',
  }).then((result) => {
    if (result.isConfirmed) {
      // Kembalikan stok ke produk selesai
      const product = finishedProductList.value.find((p) => p.product === distribusi.menu);
      if (product) {
        product.stock += distribusi.stok;
      }

      // Hapus distribusi dari daftar
      distribusiList.value = distribusiList.value.filter((d) => d.id !== distribusi.id);

      Swal.fire('Dihapus!', 'Distribusi berhasil dihapus.', 'success');
    }
  });
}
</script>

<template>
  <div>
    <h3 class="text-2xl font-medium text-gray-700 mb-4">Distribusi Menu</h3>

    <div v-if="currentUser?.role === 'admin'" class="mb-4 text-right">
      <button
        @click="openCreateModal"
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        + Tambah Distribusi
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
                v-if="currentUser?.role === 'admin'"
                @click="openEditModal(item)"
                class="px-4 py-2 text-white bg-yellow-500 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                v-if="currentUser?.role === 'admin'"
                @click="deleteDistribusi(item)"
                class="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
              >
                Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
