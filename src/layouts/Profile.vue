<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';

// Interface Supplier
interface Supplier {
  id_supplier: number;
  nama_supplier: string;
  alamat: string;
  kontak: string;
  sertifikasi: string;
  verifikasi: string;
  penyuplai: { nama_bahan: string }[] | null;
}

// ✅ Ambil data user & token dari localStorage
const user = JSON.parse(localStorage.getItem('user') || '{}');
const token = localStorage.getItem('token'); // 🔥 Ambil token JWT
const isAdmin = user.role === 'admin';
const suppliersData = ref<Supplier[]>([]);

// ✅ Fetch Supplier dari API
const fetchSuppliers = async () => {
  try {
    if (!token) {
      Swal.fire('Error', 'Token tidak ditemukan!', 'error');
      return;
    }

    const response = await fetch('https://sidimasbe.vercel.app/api/supl', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("🔥 Response dari API:", JSON.stringify(data, null, 2));

    if (data.Suppliers && Array.isArray(data.Suppliers)) {
      suppliersData.value = [...data.Suppliers];
    } else {
      throw new Error("Data supplier tidak dalam format array!");
    }

    console.log("🔥 Data yang masuk ke suppliersData:", suppliersData.value);
  } catch (error) {
    Swal.fire('Error', `Gagal mengambil data supplier: ${error.message}`, 'error');
  }
};

// ✅ Tampilkan Detail Supplier
const showDetailModal = (supplier: Supplier) => {
  const bahanList = supplier.penyuplai
    ? supplier.penyuplai.map((bahan) => `<li>${bahan.nama_bahan}</li>`).join('')
    : '<li>Tidak ada data bahan</li>';

  Swal.fire({
    title: `${supplier.nama_supplier}`,
    html: `
      <p><strong>Alamat:</strong> ${supplier.alamat}</p>
      <p><strong>Kontak:</strong> ${supplier.kontak}</p>
      <p><strong>Sertifikasi:</strong> ${supplier.sertifikasi}</p>
      <p><strong>Terverifikasi:</strong> ${supplier.verifikasi}</p>
      <p><strong>Penyuplai:</strong></p>
      <ul>${bahanList}</ul>
    `,
    confirmButtonText: 'Tutup',
  });
};

// ✅ Tambah/Edit Supplier
const openEditModal = (supplier: Supplier | null = null) => {
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
      ${
        isAdmin
          ? `<label>Terverifikasi</label>
             <select id="verifikasi" class="swal2-select">
               <option value="Pending" ${defaultData.verifikasi === 'Pending' ? 'selected' : ''}>Pending</option>
               <option value="true" ${defaultData.verifikasi === 'true' ? 'selected' : ''}>Ya</option>
               <option value="false" ${defaultData.verifikasi === 'false' ? 'selected' : ''}>Tidak</option>
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
          ? (document.getElementById('verifikasi') as HTMLSelectElement).value
          : defaultData.verifikasi,
      };
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const url = isEdit
          ? `https://sidimasbe.vercel.app/api/esupl/${supplier?.id_supplier}`
          : 'https://sidimasbe.vercel.app/api/asupl';
        const method = isEdit ? 'PUT' : 'POST';

        await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
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

// ✅ Hapus Supplier
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
        await fetch(`https://sidimasbe.vercel.app/api/dsupl/${supplier.id_supplier}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
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
  <div class="p-6">
    <h3 class="text-3xl font-bold text-gray-800">Profil Supplier</h3>

    <div v-if="isAdmin" class="mt-4">
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
            <td class="px-6 py-4">{{ supplier.verifikasi }}</td>
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
