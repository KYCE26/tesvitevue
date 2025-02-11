<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';

// ✅ API Base URL & Token
const API_URL = "https://sidimasbe.vercel.app/api";
const token = localStorage.getItem('token');

// ✅ Ambil role dari user yang login
const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
const isAdmin = currentUser?.role === 'admin';
const isSupplier = currentUser?.role === 'supplier';

// ✅ State untuk menyimpan daftar bahan mentah & supplier
const rawMaterials = ref([]);
const suppliersList = ref([]);
const logBahan = ref([]);

const fetchLogs = async () => {
  try {
    const response = await fetch(`${API_URL}/logs`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error(`Gagal mengambil data log: ${response.status}`);

    const data = await response.json();
    logBahan.value = data.data || [];
  } catch (error) {
    Swal.fire("Error", error.message, "error");
  }
};

const showLogs = async () => {
  await fetchLogs();

  if (!logBahan.value.length) {
    Swal.fire("Info", "Tidak ada log bahan yang tersedia.", "info");
    return;
  }

  // 🔥 Buat tabel log dalam modal
  const logHtml = `
    <div style="max-height: 300px; overflow-y: auto;">
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <thead>
          <tr style="background: #f2f2f2;">
            <th style="padding: 10px; border-bottom: 1px solid #ddd;">Nama Bahan</th>
            <th style="padding: 10px; border-bottom: 1px solid #ddd;">Tanggal Pemakaian</th>
            <th style="padding: 10px; border-bottom: 1px solid #ddd;">Jumlah Digunakan</th>
            <th style="padding: 10px; border-bottom: 1px solid #ddd;">Sisa Bahan</th>
          </tr>
        </thead>
        <tbody>
          ${logBahan.value
            .map(log => `
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${log.nama_bahan}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${log.tanggal}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${log.jumlah_digunakan} kg</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${log.sisa_bahan} kg</td>
              </tr>
            `)
            .join("")}
        </tbody>
      </table>
    </div>
  `;

  Swal.fire({
    title: "Log Bahan",
    html: logHtml,
    width: 800,
    confirmButtonText: "Tutup",
  });
};
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
    suppliersList.value = data.Suppliers || [];
  } catch (error) {
    Swal.fire("Error", error.message, "error");
  }
};

// ✅ Fetch Data Bahan Mentah
const fetchMaterials = async () => {
  try {
    const response = await fetch(`${API_URL}/bahan`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error(`Gagal mengambil data bahan mentah: ${response.status}`);

    const data = await response.json();
    rawMaterials.value = data.Materials || [];
  } catch (error) {
    Swal.fire("Error", error.message, "error");
  }
};

const addStockForSupplier = () => {
  // 🔥 Filter hanya bahan milik supplier yang login
  const supplierMaterials = rawMaterials.value.filter(material => material.id_supplier === user.id_supplier);

  if (supplierMaterials.length === 0) {
    Swal.fire("Error", "Anda belum memiliki bahan untuk menambah stok.", "error");
    return;
  }

  const materialOptions = supplierMaterials.map(m =>
    `<option value="${m.id_bahan}">${m.nama_bahan} (Stok: ${m.jumlah} kg)</option>`
  ).join('');

  Swal.fire({
    title: 'Tambah Stok Bahan',
    html: `
      <label>Pilih Bahan</label>
      <select id="id_bahan" class="swal2-input">
        ${materialOptions}
      </select>

      <label>Jumlah Tambahan</label>
      <input id="jumlah" type="number" class="swal2-input" placeholder="Masukkan jumlah (kg)" min="1" />
    `,
    showCancelButton: true,
    confirmButtonText: 'Tambah Stok',
    preConfirm: () => {
      const id_bahan = parseInt((document.getElementById('id_bahan') as HTMLSelectElement).value);
      const jumlah = parseInt((document.getElementById('jumlah') as HTMLInputElement).value);

      if (isNaN(jumlah) || jumlah <= 0) {
        Swal.showValidationMessage("Jumlah stok harus lebih dari 0.");
        return null;
      }

      return { id_bahan, jumlah };
    }
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_URL}/addstok`, {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(result.value),
        });

        if (!response.ok) throw new Error(`Gagal menambahkan stok: ${response.status}`);

        Swal.fire("Berhasil", "Stok bahan berhasil ditambahkan!", "success");
        fetchMaterials();
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    }
  });
};
// ✅ Detail Bahan Mentah (Bisa Dilihat Semua User)
const showDetailModal = (material) => {
  Swal.fire({
    title: `Detail Bahan Mentah`,
    html: `
      <div style="text-align: left; font-size: 14px;">
        <p><strong>Nama Bahan:</strong> ${material.nama_bahan}</p>
        <p><strong>Jumlah:</strong> ${material.jumlah} kg</p>
        <p><strong>Asal Bahan:</strong> ${material.asal_bahan}</p>
        <p><strong>Kategori:</strong> ${material.kategori}</p>
        <p><strong>Status:</strong> ${material.status}</p>
        <p><strong>Supplier:</strong> ${material.supplier?.nama_supplier || "Tidak Diketahui"}</p>
        <p><strong>Tanggal Masuk:</strong> ${new Date(material.created_at).toLocaleDateString()}</p>
      </div>
    `,
    confirmButtonText: "Tutup",
  });
};
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
// ✅ Hapus Bahan Mentah (Hanya Admin)
const deleteMaterial = (material) => {
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
        await fetch(`${API_URL}/dbahan/${material.id_bahan}`, {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        Swal.fire("Dihapus!", "Data bahan mentah telah dihapus.", "success");
        fetchMaterials();
      } catch (error) {
        Swal.fire("Error", "Gagal menghapus data bahan mentah", "error");
      }
    }
  });
};

// ✅ Fetch data saat halaman dimuat
onMounted(() => {
  fetchSuppliers();
  fetchMaterials();
});
</script>

<template>
  <div class="p-6">
    <h3 class="text-3xl font-bold text-gray-800">Data Bahan Mentah</h3>

    <!-- Tombol Tambah Bahan Mentah (Hanya Admin) -->
    <div class="mt-4" v-if="isAdmin">
      <button @click="openEditModal(null)" class="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded">
        Tambah Bahan Mentah
      </button>
      
    </div>

    <div class="mt-8 overflow-x-auto">
      <button
        @click="showLogs"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Log Bahan
      </button>
      <table class="min-w-full bg-white border">
        <thead class="bg-gray-200">
          <tr>
            <th class="px-6 py-3 text-left text-sm">Nama Bahan</th>
            <th class="px-6 py-3 text-left text-sm">Jumlah (kg)</th>
            <th class="px-6 py-3 text-left text-sm">Status</th>
            <th class="px-6 py-3 text-left text-sm">Supplier</th>
            <th class="px-6 py-3 text-left text-sm">Aksi</th> <!-- ✅ Kolom Aksi -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="material in rawMaterials" :key="material.id_bahan" class="hover:bg-gray-100">
            <td class="px-6 py-4">{{ material.nama_bahan }}</td>
            <td class="px-6 py-4">{{ material.jumlah }}</td>
            <td class="px-6 py-4">{{ material.status }}</td>
            <td class="px-6 py-4">{{ material.supplier?.nama_supplier || "Tidak Diketahui" }}</td>
            <td class="px-6 py-4 flex space-x-2"> 
              <!-- ✅ Supplier Hanya Bisa Melihat Detail -->
              <button @click="showDetailModal(material)" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                Detail
              </button>
              <!-- ✅ Admin Bisa Edit & Hapus -->
              <button v-if="isAdmin" @click="openEditModal(material)" class="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                Edit
              </button>
              <button v-if="isAdmin" @click="deleteMaterial(material)" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="isSupplier" class="fixed bottom-6 left-6">
      <button @click="addStockForSupplier"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
        + Tambah Stok
      </button>
    </div>
    </div>
    
  </div>
</template>
