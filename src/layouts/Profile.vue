<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';

// ✅ API Base URL & Token
const API_URL = "https://sidimasbe.vercel.app/api";
const token = localStorage.getItem('token');

// ✅ Ambil data user yang login
const user = JSON.parse(localStorage.getItem('user') || '{}');
const isAdmin = user.role === 'admin';
const isSupplier = user.role === 'supplier';

// ✅ State untuk menyimpan daftar supplier
const suppliersData = ref([]);

// ✅ Fetch Data Supplier
const fetchSuppliers = async () => {
  try {
    const response = await fetch(`${API_URL}/supl`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error(`Gagal mengambil data supplier: ${response.status}`);

    const data = await response.json();
    suppliersData.value = data.Suppliers || [];

    // ✅ Supplier melihat semua supplier, tetapi hanya bisa tekan "Detail"
    if (isSupplier) {
      supplierExists.value = suppliersData.value.some(s => s.id_supplier === user.id_supplier);
    }
  } catch (error) {
    Swal.fire("Error", error.message, "error");
  }
};




// ✅ Cek apakah supplier sudah pernah mendaftar
const supplierExists = ref(false);
const checkIfSupplierExists = () => {
  if (isSupplier) {
    supplierExists.value = suppliersData.value.some(s => s.id_supplier === user.id_supplier);
  }
};

// ✅ Tambah/Edit Supplier
const openEditModal = (supplier = null) => {
  if (supplierExists.value && !isAdmin) return; // Supplier hanya bisa tambah sekali

  const isEdit = !!supplier;
  const defaultData = supplier || {
    nama_supplier: '',
    alamat: '',
    kontak: '',
    sertifikasi: '',
    verifikasi: 'Pending',
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
      ${isAdmin ? `
        <label>Terverifikasi</label>
        <select id="verifikasi" class="swal2-input">
          <option value="Pending" ${defaultData.verifikasi === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="true" ${defaultData.verifikasi === 'true' ? 'selected' : ''}>Ya</option>
          <option value="false" ${defaultData.verifikasi === 'false' ? 'selected' : ''}>Tidak</option>
        </select>
      ` : ''}
    `,
    showCancelButton: true,
    confirmButtonText: isEdit ? 'Simpan' : 'Tambah',
    preConfirm: () => ({
      nama_supplier: (document.getElementById('nama_supplier') as HTMLInputElement).value,
      alamat: (document.getElementById('alamat') as HTMLInputElement).value,
      kontak: (document.getElementById('kontak') as HTMLInputElement).value,
      sertifikasi: (document.getElementById('sertifikasi') as HTMLInputElement).value,
      verifikasi: isAdmin ? (document.getElementById('verifikasi') as HTMLSelectElement).value : defaultData.verifikasi,
    }),
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const url = isEdit ? `${API_URL}/esupl/${supplier?.id_supplier}` : `${API_URL}/asupl`;
        const method = isEdit ? "PUT" : "POST";

        await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(result.value),
        });

        Swal.fire("Berhasil!", isEdit ? "Data diperbarui" : "Supplier ditambahkan", "success");

        // ✅ Setelah menambahkan supplier, update state supplierExists dan fetch ulang
        await fetchSuppliers();
        supplierExists.value = true; // Supplier hanya bisa tambah 1x
      } catch (error) {
        Swal.fire("Error", "Gagal menyimpan data supplier", "error");
      }
    }
  });
};


// ✅ Detail Supplier
const showDetailModal = (supplier) => {
  Swal.fire({
    title: `${supplier.nama_supplier}`,
    html: `
      <p><strong>Alamat:</strong> ${supplier.alamat}</p>
      <p><strong>Kontak:</strong> ${supplier.kontak}</p>
      <p><strong>Sertifikasi:</strong> ${supplier.sertifikasi}</p>
      <p><strong>Terverifikasi:</strong> ${supplier.verifikasi}</p>
    `,
    confirmButtonText: "Tutup",
  });
};

// ✅ Hapus Supplier (Hanya Admin)
const deleteSupplier = (supplier) => {
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
        await fetch(`${API_URL}/dsupl/${supplier.id_supplier}`, {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        Swal.fire("Dihapus!", "Data supplier telah dihapus.", "success");
        fetchSuppliers();
      } catch (error) {
        Swal.fire("Error", "Gagal menghapus data supplier", "error");
      }
    }
  });
};

// ✅ Fetch data saat halaman dimuat
onMounted(async () => {
  await fetchSuppliers();
  checkIfSupplierExists();
});

</script>

<template>
  <div class="p-6">
    <h3 class="text-3xl font-bold text-gray-800">Profil Supplier</h3>


<div v-if="(isAdmin || (isSupplier && !supplierExists))" class="mt-4">
  <button @click="openEditModal(null)" class="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded">
    Tambah Supplier
  </button>
</div>



    <div class="mt-8 overflow-x-auto">
      <table class="min-w-full bg-white border">
        <thead class="bg-gray-200">
          <tr>
            <th class="px-6 py-3 text-left text-sm">Nama</th>
            <th class="px-6 py-3 text-left text-sm">Kontak</th>
            <th class="px-6 py-3 text-left text-sm">Terverifikasi</th>
            <th class="px-6 py-3 text-left text-sm">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="supplier in suppliersData" :key="supplier.id_supplier" class="hover:bg-gray-100">
            <td class="px-6 py-4">{{ supplier.nama_supplier }}</td>
            <td class="px-6 py-4">{{ supplier.kontak }}</td>
            <td class="px-6 py-4">
  <span :class="supplier.verifikasi === 'true' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'">
    {{ supplier.verifikasi === 'true' ? 'YES' : 'NO' }}
  </span>
</td>

            <td class="px-6 py-4">
              <button @click="showDetailModal(supplier)" class="mr-2 text-blue-600">Detail</button>
              <button v-if="isAdmin" @click="openEditModal(supplier)" class="mr-2 text-yellow-600">Edit</button>
              <button v-if="isAdmin" @click="deleteSupplier(supplier)" class="text-red-600">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
