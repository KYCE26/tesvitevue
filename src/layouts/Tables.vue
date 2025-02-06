<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';

// Interface Bahan Mentah
interface Material {
  id_bahan: number;
  nama_bahan: string;
  jumlah: number;
  asal_bahan: string;
  kategori: string;
  status: string;
  created_at: string;
  supplier: {
    id_supplier: number;
    nama_supplier: string;
  };
}

// Interface Supplier
interface Supplier {
  id_supplier: number;
  nama_supplier: string;
}

// ✅ Ambil token dari localStorage
const token = localStorage.getItem('token');
const rawMaterials = ref<Material[]>([]);
const suppliersList = ref<Supplier[]>([]);

// ✅ Fetch Data Supplier
const fetchSuppliers = async () => {
  try {
    const response = await fetch('https://sidimasbe.vercel.app/api/supl', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

    const data = await response.json();
    if (data.Suppliers && Array.isArray(data.Suppliers)) {
      suppliersList.value = data.Suppliers.map(s => ({
        id_supplier: s.id_supplier,
        nama_supplier: s.nama_supplier,
      }));
    }
  } catch (error) {
    Swal.fire('Error', `Gagal mengambil data supplier: ${error.message}`, 'error');
  }
};

// ✅ Fetch Data Bahan Mentah
const fetchMaterials = async () => {
  try {
    if (!token) {
      Swal.fire('Error', 'Token tidak ditemukan!', 'error');
      return;
    }

    const response = await fetch('https://sidimasbe.vercel.app/api/bahan', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

    const data = await response.json();
    if (data.Materials && Array.isArray(data.Materials)) {
      rawMaterials.value = [...data.Materials];
    } else {
      throw new Error("Data bahan mentah tidak dalam format array!");
    }
  } catch (error) {
    Swal.fire('Error', `Gagal mengambil data bahan mentah: ${error.message}`, 'error');
  }
};

// ✅ Modal Tambah/Edit Bahan Mentah
const openEditModal = (material: Material | null = null) => {
  const isEdit = !!material;
  const defaultData = material || {
    nama_bahan: '',
    jumlah: '',
    asal_bahan: '',
    kategori: '',
    status: 'Tersedia',
    id_supplier: suppliersList.value.length > 0 ? suppliersList.value[0].id_supplier : '',
  };

  // 🔥 Dropdown daftar supplier (paling atas)
  const supplierOptions = suppliersList.value.map(s =>
    `<option value="${s.id_supplier}" ${s.id_supplier === defaultData.id_supplier ? 'selected' : ''}>
      ${s.nama_supplier}
    </option>`).join('');

  Swal.fire({
    title: isEdit ? 'Edit Bahan Mentah' : 'Tambah Bahan Mentah',
    html: `
      <div style="display: flex; flex-direction: column; gap: 10px; text-align: left; width: 100%; max-width: 400px; margin: auto;">
        <label class="swal-label">Supplier</label>
        <select id="id_supplier" class="swal-input swal-wide">
          ${supplierOptions}
        </select>

        <label class="swal-label">Nama Bahan</label>
        <input id="nama_bahan" class="swal-input swal-wide" value="${defaultData.nama_bahan}" />

        <label class="swal-label">Jumlah (kg)</label>
        <input id="jumlah" type="number" class="swal-input swal-wide" value="${defaultData.jumlah}" />

        <label class="swal-label">Asal Bahan</label>
        <input id="asal_bahan" class="swal-input swal-wide" value="${defaultData.asal_bahan}" />

        <label class="swal-label">Kategori</label>
        <input id="kategori" class="swal-input swal-wide" value="${defaultData.kategori}" />

        <label class="swal-label">Status</label>
        <select id="status" class="swal-input swal-wide">
          <option value="Tersedia" ${defaultData.status === 'Tersedia' ? 'selected' : ''}>Tersedia</option>
          <option value="Habis" ${defaultData.status === 'Habis' ? 'selected' : ''}>Habis</option>
        </select>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: isEdit ? 'Simpan' : 'Tambah',
    cancelButtonText: 'Batal',
    preConfirm: () => ({
      nama_bahan: document.getElementById('nama_bahan').value,
      jumlah: Number(document.getElementById('jumlah').value),
      asal_bahan: document.getElementById('asal_bahan').value,
      kategori: document.getElementById('kategori').value,
      status: document.getElementById('status').value,
      id_supplier: Number(document.getElementById('id_supplier').value),
    }),
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const url = isEdit
          ? `https://sidimasbe.vercel.app/api/ebahan/${material?.id_bahan}`
          : 'https://sidimasbe.vercel.app/api/addbahan';
        const method = isEdit ? 'PUT' : 'POST';

        await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(result.value),
        });

        Swal.fire('Berhasil!', isEdit ? 'Data diperbarui' : 'Bahan mentah ditambahkan', 'success');
        fetchMaterials();
      } catch (error) {
        Swal.fire('Error', 'Gagal menyimpan data bahan mentah', 'error');
      }
    }
  });
};
const showDetailModal = (material: Material) => {
  Swal.fire({
    title: `Detail Bahan Mentah`,
    html: `
      <div style="text-align: left; font-size: 14px;">
        <p><strong>Nama Bahan:</strong> ${material.nama_bahan}</p>
        <p><strong>Jumlah:</strong> ${material.jumlah} kg</p>
        <p><strong>Asal Bahan:</strong> ${material.asal_bahan}</p>
        <p><strong>Kategori:</strong> ${material.kategori}</p>
        <p><strong>Status:</strong> ${material.status}</p>
        <p><strong>Supplier:</strong> ${material.supplier.nama_supplier}</p>
        <p><strong>Tanggal Masuk:</strong> ${new Date(material.created_at).toLocaleDateString()}</p>
      </div>
    `,
    confirmButtonText: 'Tutup',
  });
};

// ✅ Hapus Bahan Mentah
const deleteMaterial = (material: Material) => {
  Swal.fire({
    title: 'Apakah Anda yakin?',
    text: "Data ini tidak dapat dikembalikan setelah dihapus!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus!',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await fetch(`https://sidimasbe.vercel.app/api/dbahan/${material.id_bahan}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        Swal.fire('Dihapus!', 'Data bahan mentah telah dihapus.', 'success');
        fetchMaterials();
      } catch (error) {
        Swal.fire('Error', 'Gagal menghapus data bahan mentah', 'error');
      }
    }
  });
};

// Fetch data saat komponen dimuat
onMounted(() => {
  fetchSuppliers();
  fetchMaterials();
});
</script>

<template>
  <div class="p-6">
    <h3 class="text-3xl font-bold text-gray-800">Data Bahan Mentah</h3>

    <div class="mt-4">
      <button @click="openEditModal(null)" class="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded">
        Tambah Bahan Mentah
      </button>
    </div>

    <div class="mt-8 overflow-x-auto">
      <table class="min-w-full bg-white border">
        <thead class="bg-gray-200">
          <tr>
            <th class="px-6 py-3 text-left text-sm">Nama Bahan</th>
            <th class="px-6 py-3 text-left text-sm">Jumlah (kg)</th>
            <th class="px-6 py-3 text-left text-sm">Status</th>
            <th class="px-6 py-3 text-left text-sm">Supplier</th>
            <th class="px-6 py-3 text-left text-sm">Aksi</th> <!-- ✅ Tambah Kolom Aksi -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="material in rawMaterials" :key="material.id_bahan" class="hover:bg-gray-100">
            <td class="px-6 py-4">{{ material.nama_bahan }}</td>
            <td class="px-6 py-4">{{ material.jumlah }}</td>
            <td class="px-6 py-4">{{ material.status }}</td>
            <td class="px-6 py-4">{{ material.supplier.nama_supplier }}</td>
            <td class="px-6 py-4 flex space-x-2"> 
              <!-- ✅ Tombol Aksi -->
              <button @click="showDetailModal(material)" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                Detail
              </button>
              <button @click="openEditModal(material)" class="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                Edit
              </button>
              <button @click="deleteMaterial(material)" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
