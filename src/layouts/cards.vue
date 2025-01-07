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
const selectedDistribusi = ref<Distribusi | null>(null);
const isEditMode = ref(false);

// Buka modal detail
function openDetailModal(distribusi: Distribusi) {
  selectedDistribusi.value = { ...distribusi };
  isEditMode.value = false;
  Swal.fire({
    title: "Detail Distribusi",
    html: `
      <div class="text-left">
        <p><strong>Menu:</strong> ${selectedDistribusi.value?.menu}</p>
        <p><strong>Stok:</strong> ${selectedDistribusi.value?.stok}</p>
        <p><strong>Sekolah:</strong> ${selectedDistribusi.value?.sekolah}</p>
        <p><strong>Tanggal:</strong> ${selectedDistribusi.value?.tanggal}</p>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Edit",
    cancelButtonText: "Close",
  }).then((result) => {
    if (result.isConfirmed) {
      openEditModal(selectedDistribusi.value as Distribusi);
    }
  });
}

// Buka modal edit
function openEditModal(distribusi: Distribusi) {
  selectedDistribusi.value = { ...distribusi };
  isEditMode.value = true;
  Swal.fire({
    title: "Edit Distribusi",
    html: `
      <div class="text-left">
        <label class="block text-sm font-medium text-gray-700">Menu</label>
        <input id="menu" type="text" value="${selectedDistribusi.value?.menu}" class="swal2-input">
        
        <label class="block text-sm font-medium text-gray-700">Stok</label>
        <input id="stok" type="number" value="${selectedDistribusi.value?.stok}" class="swal2-input">
        
        <label class="block text-sm font-medium text-gray-700">Sekolah</label>
        <input id="sekolah" type="text" value="${selectedDistribusi.value?.sekolah}" class="swal2-input">
        
        <label class="block text-sm font-medium text-gray-700">Tanggal</label>
        <input id="tanggal" type="date" value="${selectedDistribusi.value?.tanggal}" class="swal2-input">
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Save",
    cancelButtonText: "Cancel",
    preConfirm: () => {
      const menu = (document.getElementById("menu") as HTMLInputElement).value;
      const stok = parseInt((document.getElementById("stok") as HTMLInputElement).value, 10);
      const sekolah = (document.getElementById("sekolah") as HTMLInputElement).value;
      const tanggal = (document.getElementById("tanggal") as HTMLInputElement).value;

      return { menu, stok, sekolah, tanggal };
    },
  }).then((result) => {
    if (result.isConfirmed && selectedDistribusi.value) {
      const { menu, stok, sekolah, tanggal } = result.value;
      const index = distribusiList.value.findIndex((item) => item.id === selectedDistribusi.value?.id);
      if (index !== -1) {
        distribusiList.value[index] = { ...selectedDistribusi.value, menu, stok, sekolah, tanggal };
        Swal.fire("Saved!", "Distribusi berhasil diperbarui.", "success");
      }
    }
  });
}
</script>

<template>
  <div>
    <h3 class="text-2xl font-medium text-gray-700 mb-4">Distribusi Menu</h3>
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
            <td class="px-6 py-4 text-sm text-gray-700">
              <button
                @click="openDetailModal(item)"
                class="px-4 py-2 text-white bg-blue-500 rounded"
              >
                Detail
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
