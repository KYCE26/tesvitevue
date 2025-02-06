<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';

// Interface Supplier
interface Supplier {
  id: number;
  nama_supplier: string;
  alamat: string;
  kontak: string;
  sertifikasi: string;
  verifikasi: boolean;
}

// Ambil data user dari localStorage (bukan token!)
const user = JSON.parse(localStorage.getItem('user') || '{}');
const isAdmin = user.role === 'admin'; // Cek apakah user adalah admin
const suppliersData = ref<Supplier[]>([]);

// ✅ Fungsi Fetch Supplier dari API (Menggunakan Cookie)
const fetchSuppliers = async () => {
  try {
    const response = await fetch('https://sidimasbe.vercel.app/api/supl', {
      method: 'GET',
      credentials: 'include', // 🔥 WAJIB! Agar cookie login dikirim
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    suppliersData.value = data.map((supplier: any) => ({
      id: supplier.id,
      nama_supplier: supplier.nama_supplier,
      alamat: supplier.alamat,
      kontak: supplier.kontak,
      sertifikasi: supplier.sertifikasi,
      verifikasi: supplier.verifikasi === "true",
    }));
  } catch (error) {
    Swal.fire('Error', `Gagal mengambil data supplier: ${error.message}`, 'error');
  }
};


// Computed untuk menampilkan data sesuai role
const filteredSuppliers = computed(() => {
  if (isAdmin) {
    return suppliersData.value;
  } else {
    return suppliersData.value.filter((supplier) => supplier.id === user.id);
  }
});

// ✅ Fungsi untuk Menambah atau Mengedit Supplier
const openEditModal = (supplier: Supplier | null = null) => {
  const isEdit = !!supplier;
  const defaultData = supplier || {
    nama_supplier: '',
    alamat: '',
    kontak: '',
    sertifikasi: '',
    verifikasi: false,
  };

  Swal.fire({
    title: isEdit ? 'Edit Supplier' : 'Tambah Supplier',
    html: `
      <label>Nama</label>
      <input id="nama_supplier" value="${defaultData.nama_supplier}" class="swal2-input" />
      <label>Alamat</label>
      <input id="alamat" value="${defaultData.alamat}" class="swal2-input" />
      <label>Kontak</label>
      <input id="kontak" value="${defaultData.kontak}" class="swal2-input" />
      <label>Sertifikasi</label>
      <input id="sertifikasi" value="${defaultData.sertifikasi}" class="swal2-input" />
      ${
        isAdmin
          ? `<label>Terverifikasi</label>
             <select id="verifikasi" class="swal2-select">
               <option value="true" ${defaultData.verifikasi ? 'selected' : ''}>Ya</option>
               <option value="false" ${!defaultData.verifikasi ? 'selected' : ''}>Tidak</option>
             </select>`
          : ''
      }
    `,
    showCancelButton: true,
    confirmButtonText: isEdit ? 'Simpan' : 'Tambah',
    preConfirm: () => {
      return {
        nama_supplier: (document.getElementById('nama_supplier') as HTMLInputElement).value,
        alamat: (document.getElementById('alamat') as HTMLInputElement).value,
        kontak: (document.getElementById('kontak') as HTMLInputElement).value,
        sertifikasi: (document.getElementById('sertifikasi') as HTMLInputElement).value,
        verifikasi: isAdmin
          ? (document.getElementById('verifikasi') as HTMLSelectElement).value === 'true'
          : defaultData.verifikasi,
      };
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const url = isEdit
          ? `https://sidimasbe.vercel.app/api/esupl/${supplier?.id}`
          : 'https://sidimasbe.vercel.app/api/asupl';
        const method = isEdit ? 'PUT' : 'POST';

        await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // 🔥 Pastikan cookie dikirim
          body: JSON.stringify(result.value),
        });

        Swal.fire('Berhasil!', isEdit ? 'Data diperbarui' : 'Supplier ditambahkan', 'success');
        fetchSuppliers();
      } catch (error) {
        Swal.fire('Error', 'Gagal menyimpan data supplier', 'error');
      }
    }
  });
};

// ✅ Fungsi untuk Menghapus Supplier
const deleteSupplier = (supplier: Supplier) => {
  if (!isAdmin) return;
  Swal.fire({
    title: 'Apakah Anda yakin?',
    text: "Data ini tidak dapat dikembalikan setelah dihapus!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus!',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await fetch(`https://sidimasbe.vercel.app/api/dsupl/${supplier.id}`, {
          method: 'DELETE',
          credentials: 'include', // 🔥 Pastikan cookie dikirim
        });
        Swal.fire('Dihapus!', 'Data supplier telah dihapus.', 'success');
        fetchSuppliers();
      } catch (error) {
        Swal.fire('Error', 'Gagal menghapus data supplier', 'error');
      }
    }
  });
};

// Fetch data supplier saat komponen dimuat
onMounted(fetchSuppliers);
</script>

<template>
  <div>
    <h3 class="text-3xl font-medium text-gray-700">Profil Supplier</h3>

    <div v-if="isAdmin" class="mt-4">
      <button @click="openEditModal(null)" class="px-4 py-2 text-white bg-green-500 rounded">
        Tambah Supplier
      </button>
    </div>

    <div class="mt-8">
      <table class="min-w-full bg-white border">
        <thead>
          <tr class="bg-gray-50">
            <th>Nama</th>
            <th>Kontak</th>
            <th>Terverifikasi</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="supplier in filteredSuppliers" :key="supplier.id">
            <td>{{ supplier.nama_supplier }}</td>
            <td>{{ supplier.kontak }}</td>
            <td>{{ supplier.verifikasi ? 'Ya' : 'Tidak' }}</td>
            <td>
              <button @click="showDetailModal(supplier)">Detail</button>
              <button v-if="isAdmin" @click="openEditModal(supplier)">Edit</button>
              <button v-if="isAdmin" @click="deleteSupplier(supplier)">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
