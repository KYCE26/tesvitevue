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
    return suppliersData.value; // Admin dapat melihat semua data
  } else {
    return suppliersData.value.filter((supplier) => supplier.id === user.id); // Supplier hanya dapat melihat data miliknya
  }
});

// Fungsi detail modal (akses untuk semua user)
const showDetailModal = (supplier: Supplier) => {
  Swal.fire({
    title: `${supplier.name}`,
    html: `
      <div class="text-left">
        <p><strong>Alamat:</strong> ${supplier.address}</p>
        <p><strong>Kontak:</strong> ${supplier.contact}</p>
        <p><strong>Sertifikasi:</strong> ${supplier.certifications}</p>
        <p><strong>Terverifikasi:</strong> ${supplier.verified ? 'Ya' : 'Tidak'}</p>
      </div>
    `,
    confirmButtonText: 'Tutup',
  });
};

// Fungsi untuk membuka modal edit/tambah
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
    title: isEdit ? 'Edit Supplier' : 'Tambah Supplier',
    html: `
      <label>Nama</label>
      <input id="name" value="${defaultData.name}" class="swal2-input" />
      <label>Alamat</label>
      <input id="address" value="${defaultData.address}" class="swal2-input" />
      <label>Kontak</label>
      <input id="contact" value="${defaultData.contact}" class="swal2-input" />
      <label>Sertifikasi</label>
      <input id="certifications" value="${defaultData.certifications}" class="swal2-input" />
      ${
        isAdmin
          ? `<label>Terverifikasi</label>
             <select id="verified" class="swal2-select">
               <option value="true" ${defaultData.verified ? 'selected' : ''}>Ya</option>
               <option value="false" ${!defaultData.verified ? 'selected' : ''}>Tidak</option>
             </select>`
          : ''
      }
    `,
    showCancelButton: true,
    confirmButtonText: isEdit ? 'Simpan' : 'Tambah',
    preConfirm: () => {
      const formData: Partial<Supplier> = {
        name: (document.getElementById('name') as HTMLInputElement).value,
        address: (document.getElementById('address') as HTMLInputElement).value,
        contact: (document.getElementById('contact') as HTMLInputElement).value,
        certifications: (document.getElementById('certifications') as HTMLInputElement).value,
      };

      if (isAdmin) {
        formData.verified = (document.getElementById('verified') as HTMLSelectElement).value === 'true';
      }

      return formData;
    },
  }).then((result) => {
    if (result.isConfirmed) {
      if (isEdit) {
        const index = suppliersData.value.findIndex((s) => s.id === supplier?.id);
        if (index !== -1) {
          suppliersData.value[index] = { ...suppliersData.value[index], ...result.value };
          Swal.fire('Tersimpan!', 'Data supplier berhasil diperbarui.', 'success');
        }
      } else {
        // Batasi supplier hanya dapat membuat data sekali
        const supplierExists = suppliersData.value.some((s) => s.id === user.id);
        if (!isAdmin && supplierExists) {
          Swal.fire('Gagal!', 'Anda hanya dapat membuat satu profil supplier.', 'error');
        } else {
          suppliersData.value.push({ id: defaultData.id, ...result.value });
          Swal.fire('Ditambahkan!', 'Supplier baru berhasil ditambahkan.', 'success');
        }
      }
    }
  });
};

// Fungsi untuk menghapus supplier (hanya admin)
const deleteSupplier = (supplier: Supplier) => {
  if (!isAdmin) return; // Batasi akses
  Swal.fire({
    title: 'Apakah Anda yakin?',
    text: "Data ini tidak dapat dikembalikan setelah dihapus!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus!',
  }).then((result) => {
    if (result.isConfirmed) {
      suppliersData.value = suppliersData.value.filter((s) => s.id !== supplier.id);
      Swal.fire('Dihapus!', 'Data supplier telah dihapus.', 'success');
    }
  });
};
</script>

<template>
  <div>
    <h3 class="text-3xl font-medium text-gray-700">Profil Supplier</h3>

    <!-- Tombol Tambah Supplier -->
    <div v-if="isAdmin || !suppliersData.some((s) => s.id === user.id)" class="mt-4">
      <button @click="openEditModal(null)" class="px-4 py-2 text-white bg-green-500 rounded">
        Tambah Supplier
      </button>
    </div>

    <!-- Daftar Supplier -->
    <div class="mt-8">
      <h4 class="text-xl font-medium text-gray-600">Daftar Supplier</h4>
      <div class="mt-4 overflow-x-auto">
        <table class="min-w-full bg-white border">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-6 py-3 text-left text-sm">Nama</th>
              <th class="px-6 py-3 text-left text-sm">Kontak</th>
              <th class="px-6 py-3 text-left text-sm">Terverifikasi</th>
              <th class="px-6 py-3 text-left text-sm">Aksi</th>
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
                  {{ supplier.verified ? 'Ya' : 'Tidak' }}
                </span>
              </td>
              <td class="px-6 py-4 flex space-x-2">
                <!-- Tombol Detail -->
                <button
                  @click="showDetailModal(supplier)"
                  class="px-4 py-2 text-white bg-blue-500 rounded"
                >
                  Detail
                </button>
                <!-- Tombol Edit -->
                <button
                  v-if="isAdmin || supplier.id === user.id"
                  @click="openEditModal(supplier)"
                  class="px-4 py-2 text-white bg-yellow-500 rounded"
                >
                  Edit
                </button>
                <!-- Tombol Hapus -->
                <button
                  v-if="isAdmin"
                  @click="deleteSupplier(supplier)"
                  class="px-4 py-2 text-white bg-red-500 rounded"
                >
                  Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
