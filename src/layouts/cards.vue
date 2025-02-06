<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';

// ✅ API Base URL & Token
const API_URL = "https://sidimasbe.vercel.app/api";
const token = localStorage.getItem('token');

// ✅ State untuk menyimpan daftar distribusi dan menu
const distribusiList = ref([]);
const menuList = ref([]);

// ✅ Fetch Data Distribusi dari API
const fetchDistribusi = async () => {
  try {
    console.log("Fetching distribusi...");
    const response = await fetch(`${API_URL}/distrib`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error(`Gagal mengambil data distribusi: ${response.status}`);

    const data = await response.json();
    distribusiList.value = data.Data || [];
    console.log("Distribusi berhasil dimuat:", distribusiList.value);
  } catch (error) {
    Swal.fire("Error", error.message, "error");
    console.error("Error fetchDistribusi:", error);
  }
};

// ✅ Fetch Data Menu untuk digunakan di modal tambah/edit
const fetchMenus = async () => {
  try {
    console.log("Fetching menu...");
    const response = await fetch(`${API_URL}/menu`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error(`Gagal mengambil data menu: ${response.status}`);

    const data = await response.json();
    menuList.value = data.data || [];
    console.log("Menu berhasil dimuat:", menuList.value);
  } catch (error) {
    Swal.fire("Error", error.message, "error");
    console.error("Error fetchMenus:", error);
  }
};

// ✅ Tambah Distribusi
const createDistribusi = () => {
  Swal.fire({
    title: 'Tambah Distribusi',
    html: `
      <label>Pilih Menu</label>
      <select id="menu-select" class="swal2-input">
        ${menuList.value.map(menu => `<option value="${menu.id_menu}">${menu.nama_menu} (Stok: ${menu.jumlah_porsi})</option>`).join('')}
      </select>

      <label>Jumlah Kirim</label>
      <input id="jumlah-kirim" type="number" class="swal2-input" placeholder="Masukkan jumlah kirim" />

      <label>Alamat Tujuan</label>
      <input id="alamat-tujuan" type="text" class="swal2-input" placeholder="Masukkan alamat tujuan" />
    `,
    showCancelButton: true,
    confirmButtonText: 'Tambah',
    preConfirm: () => {
      const id_menu = parseInt((document.getElementById('menu-select') as HTMLSelectElement).value);
      const jumlah_kirim = parseInt((document.getElementById('jumlah-kirim') as HTMLInputElement).value);
      const alamat_tujuan = (document.getElementById('alamat-tujuan') as HTMLInputElement).value;

      if (isNaN(jumlah_kirim) || jumlah_kirim <= 0) {
        Swal.showValidationMessage("Jumlah kirim harus lebih dari 0");
        return null;
      }

      if (!alamat_tujuan.trim()) {
        Swal.showValidationMessage("Alamat tujuan tidak boleh kosong");
        return null;
      }

      return { id_menu, jumlah_kirim, alamat_tujuan };
    }
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_URL}/adddistrib`, {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(result.value),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(`Error ${response.status}: ${data.Message || "Gagal menambahkan distribusi."}`);

        Swal.fire("Berhasil", "Distribusi berhasil ditambahkan!", "success");
        fetchDistribusi(); // 🔄 Refresh daftar distribusi
      } catch (error) {
        Swal.fire("Error", error.message, "error");
        console.error("Error createDistribusi:", error);
      }
    }
  });
};

// ✅ Detail Distribusi
const showDistribusiDetail = (distribusi) => {
  Swal.fire({
    title: `Detail Distribusi`,
    html: `
      <p><strong>Menu:</strong> ${distribusi.nama_menu}</p>
      <p><strong>Jumlah Kirim:</strong> ${distribusi.jumlah_kirim}</p>
      <p><strong>Alamat Tujuan:</strong> ${distribusi.alamat_tujuan}</p>
      <p><strong>Status:</strong> ${distribusi.status}</p>
      <p><strong>Tanggal Kirim:</strong> ${new Date(distribusi.tanggal_kirim).toLocaleDateString()}</p>
    `,
    confirmButtonText: "Tutup",
  });
};

// ✅ Hapus Distribusi
const deleteDistribusi = async (id_distrib) => {
  Swal.fire({
    title: 'Apakah Anda yakin?',
    text: "Data ini akan dihapus secara permanen!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus!',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await fetch(`${API_URL}/deletedistrib/${id_distrib}`, {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        Swal.fire("Dihapus!", "Distribusi berhasil dihapus.", "success");
        fetchDistribusi(); // 🔄 Refresh daftar setelah dihapus
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    }
  });
};

// ✅ Fetch data saat halaman dimuat
onMounted(() => {
  fetchDistribusi();
  fetchMenus();
});
</script>

---

### **Tampilan Vue**
```vue
<template>
  <div class="p-6">
    <h3 class="text-3xl font-bold text-gray-800">Distribusi Menu</h3>

    <!-- Tombol Tambah Distribusi -->
    <button
      @click="createDistribusi"
      class="fixed bottom-6 right-6 w-16 h-16 bg-green-500 text-white text-4xl font-bold rounded-full shadow-xl hover:bg-green-600"
      title="Tambah Distribusi"
    >
      +
    </button>

    <!-- Daftar Distribusi -->
    <div class="mt-8">
      <table class="min-w-full bg-white border">
        <thead class="bg-gray-200">
          <tr>
            <th class="px-6 py-3 text-left text-sm">Nama Menu</th>
            <th class="px-6 py-3 text-left text-sm">Jumlah Kirim</th>
            <th class="px-6 py-3 text-left text-sm">Alamat Tujuan</th>
            <th class="px-6 py-3 text-left text-sm">Tanggal Kirim</th>
            <th class="px-6 py-3 text-left text-sm">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="distribusi in distribusiList" :key="distribusi.id_distrib" class="hover:bg-gray-100">
            <td class="px-6 py-4">{{ distribusi.nama_menu }}</td>
            <td class="px-6 py-4">{{ distribusi.jumlah_kirim }}</td>
            <td class="px-6 py-4">{{ distribusi.alamat_tujuan }}</td>
            <td class="px-6 py-4">{{ new Date(distribusi.tanggal_kirim).toLocaleDateString() }}</td>
            <td class="px-6 py-4 flex space-x-2">
              <button @click="showDistribusiDetail(distribusi)" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Detail
              </button>
              <button @click="deleteDistribusi(distribusi.id_distrib)" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
