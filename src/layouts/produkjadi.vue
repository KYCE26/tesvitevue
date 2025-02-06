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

// ✅ State untuk menyimpan daftar menu & daftar porsi yang sudah dibuat
const menus = ref([]);
const porsiMenus = ref([]);

// ✅ Fetch Data Menu
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
    menus.value = data.data || [];
    console.log("Menu berhasil dimuat:", menus.value);
  } catch (error) {
    Swal.fire("Error", error.message, "error");
    console.error("Error fetchMenus:", error);
  }
};

// ✅ Fetch Data Porsi Menu
const fetchPorsiMenus = async () => {
  try {
    console.log("Fetching porsi menu...");
    const response = await fetch(`${API_URL}/menu`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error(`Gagal mengambil data porsi menu: ${response.status}`);

    const data = await response.json();
    porsiMenus.value = data.data || [];
    console.log("Porsi menu berhasil dimuat:", porsiMenus.value);
  } catch (error) {
    Swal.fire("Error", error.message, "error");
    console.error("Error fetchPorsiMenus:", error);
  }
};

// ✅ Buat Porsi Menu (Hanya Admin)
const createPorsiMenu = () => {
  Swal.fire({
    title: 'Buat Porsi Menu',
    html: `
      <div style="display: flex; flex-direction: column; gap: 15px; width: 100%; max-width: 400px; margin: auto;">
        <!-- Dropdown Pilih Menu -->
        <div style="display: flex; flex-direction: column;">
          <label style="font-weight: 600; margin-bottom: 5px;">Pilih Menu</label>
          <select id="menu-select" class="swal2-input">
            ${menus.value
              .map(menu => `
                <option value="${menu.id_menu}" ${menu.jumlah_porsi > 0 ? '' : 'disabled'}>
                  ${menu.nama_menu} (Stok: ${menu.jumlah_porsi})
                </option>
              `)
              .join('')}
          </select>
        </div>

        <!-- Input Jumlah Porsi -->
        <div style="display: flex; flex-direction: column;">
          <label style="font-weight: 600; margin-bottom: 5px;">Jumlah Porsi</label>
          <input id="jumlah-porsi" type="number" class="swal2-input" placeholder="Masukkan jumlah porsi" min="1" />
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Buat',
    preConfirm: () => {
      const menuSelect = document.getElementById('menu-select') as HTMLSelectElement;
      const jumlahPorsiInput = document.getElementById('jumlah-porsi') as HTMLInputElement;

      const id_menu = parseInt(menuSelect.value);
      const jumlah_porsi = parseInt(jumlahPorsiInput.value);

      const selectedMenu = menus.value.find(menu => menu.id_menu === id_menu);

      if (!selectedMenu) {
        Swal.showValidationMessage("Menu tidak ditemukan.");
        return null;
      }

      if (isNaN(jumlah_porsi) || jumlah_porsi <= 0) {
        Swal.showValidationMessage("Jumlah porsi harus lebih dari 0.");
        return null;
      }

      if (jumlah_porsi > selectedMenu.jumlah_porsi) {
        Swal.showValidationMessage(`Jumlah porsi tidak boleh lebih dari stok tersedia (${selectedMenu.jumlah_porsi}).`);
        return null;
      }

      return { id_menu, jumlah_porsi };
    }
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const bodyData = JSON.stringify(result.value);
        console.log("Mengirim data ke API:", bodyData);

        const response = await fetch(`${API_URL}/bmenu`, {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: bodyData,
        });

        const data = await response.json();
        if (!response.ok) throw new Error(`Error ${response.status}: ${data.Message || "Gagal membuat porsi menu."}`);

        Swal.fire("Berhasil", "Porsi menu berhasil dibuat!", "success");
        fetchPorsiMenus(); // 🔄 Refresh daftar porsi menu
      } catch (error) {
        Swal.fire("Error", error.message, "error");
        console.error("Error createPorsiMenu:", error);
      }
    }
  });
};




// ✅ Hapus Porsi Menu (Hanya Admin)
const deletePorsiMenu = (id_menu) => {
  if (!isAdmin) return; // Hanya admin yang bisa menghapus

  Swal.fire({
    title: 'Apakah Anda yakin?',
    text: "Data ini tidak dapat dikembalikan setelah dihapus!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus!',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_URL}/dmenu/${id_menu}`, {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error(`Error ${response.status}: Gagal menghapus porsi menu.`);

        Swal.fire("Dihapus!", "Porsi menu berhasil dihapus.", "success");
        fetchPorsiMenus(); // 🔄 Refresh daftar setelah dihapus
      } catch (error) {
        Swal.fire("Error", error.message, "error");
        console.error("Error deletePorsiMenu:", error);
      }
    }
  });
};

// ✅ Fetch data saat halaman dimuat
onMounted(() => {
  fetchMenus();
  fetchPorsiMenus();
});
</script>

<template>
  <div class="p-6">
    <h3 class="text-3xl font-bold text-gray-800">Manajemen Porsi Menu</h3>

    <!-- Tombol Tambah Porsi Menu (Hanya Admin) -->
    <button
      v-if="isAdmin"
      @click="createPorsiMenu"
      class="fixed bottom-6 right-6 w-16 h-16 bg-green-500 text-white text-4xl font-bold rounded-full shadow-xl hover:bg-green-600"
      title="Tambah Porsi Menu"
    >
      +
    </button>

    <!-- Daftar Porsi Menu -->
    <div class="mt-8">
      <table class="min-w-full bg-white border">
        <thead class="bg-gray-200">
          <tr>
            <th class="px-6 py-3 text-left text-sm">Nama Menu</th>
            <th class="px-6 py-3 text-left text-sm">Jumlah Porsi</th>
            <th v-if="isAdmin" class="px-6 py-3 text-left text-sm">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="porsi in porsiMenus" :key="porsi.id_menu" class="hover:bg-gray-100">
            <td class="px-6 py-4">{{ porsi.nama_menu }}</td>
            <td class="px-6 py-4">{{ porsi.jumlah_porsi }}</td>
            <td v-if="isAdmin" class="px-6 py-4">
              <button
                @click="deletePorsiMenu(porsi.id_menu)"
                class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
