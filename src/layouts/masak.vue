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

// ✅ State untuk menyimpan daftar menu & bahan mentah
const menus = ref([]);
const rawMaterials = ref([]);

// ✅ Fetch Data Bahan Mentah
const fetchMaterials = async () => {
  try {
    console.log("Fetching bahan...");
    const response = await fetch(`${API_URL}/bahan`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error(`Gagal mengambil data bahan: ${response.status}`);

    const data = await response.json();
    rawMaterials.value = data.Materials || [];
    console.log("Bahan berhasil dimuat:", rawMaterials.value);
  } catch (error) {
    Swal.fire("Error", error.message, "error");
    console.error("Error fetchMaterials:", error);
  }
};

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

// ✅ Hapus Menu (Hanya Admin)
const deleteMenu = async (id_menu) => {
  if (!isAdmin) return; // Hanya admin yang bisa menghapus

  Swal.fire({
    title: 'Apakah Anda yakin?',
    text: "Data ini akan dihapus secara permanen!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus!',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await fetch(`${API_URL}/dmenu/${id_menu}`, {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        Swal.fire("Dihapus!", "Menu berhasil dihapus.", "success");
        fetchMenus(); // 🔄 Refresh daftar menu
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    }
  });
};
const addOrEditMenu = (menu = null) => {
  const isEdit = !!menu;
  const defaultData = menu || {
    nama_menu: '',
    deskripsi: '',
    jumlah_porsi: 0,
    bahan: [],
  };

  Swal.fire({
    title: isEdit ? 'Edit Menu' : 'Tambah Menu',
    html: `
      <div style="display: flex; flex-direction: column; gap: 15px; width: 100%; max-width: 500px; margin: auto;">
        <label class="swal-label">Nama Menu</label>
        <input id="nama_menu" class="swal2-input" placeholder="Nama Menu" value="${defaultData.nama_menu}" />

        <label class="swal-label">Deskripsi</label>
        <textarea id="deskripsi" class="swal2-textarea" placeholder="Deskripsi">${defaultData.deskripsi}</textarea>

        <label class="swal-label">Jumlah Porsi</label>
        <input id="jumlah_porsi" type="number" class="swal2-input" placeholder="Jumlah Porsi" value="${defaultData.jumlah_porsi}" />

        <label class="swal-label">Pilih Bahan:</label>
        <div id="bahan-container" style="display: flex; flex-direction: column; gap: 10px; max-height: 200px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; border-radius: 5px; background: #f9f9f9;">
          ${rawMaterials.value.map(material => `
            <div style="display: flex; align-items: center; gap: 15px; padding: 5px; border-bottom: 1px solid #ddd;">
              <input type="checkbox" class="material-checkbox" value="${material.id_bahan}" 
                ${defaultData.bahan.find(b => b.id_bahan === material.id_bahan) ? 'checked' : ''} />
              <span style="flex: 1; font-weight: 500;">
                ${material.nama_bahan} <small style="color: gray;">(${material.supplier.nama_supplier})</small>
              </span>
              <input type="number" class="material-amount swal-input" placeholder="Kebutuhan (kg)" style="width: 80px; text-align: center;" 
                value="${defaultData.bahan.find(b => b.id_bahan === material.id_bahan)?.kebutuhan || ''}" />
            </div>
          `).join('')}
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: isEdit ? 'Simpan' : 'Tambah',
    preConfirm: () => {
      const nama_menu = (document.getElementById('nama_menu') as HTMLInputElement).value;
      const deskripsi = (document.getElementById('deskripsi') as HTMLInputElement).value;
      const jumlah_porsi = parseInt((document.getElementById('jumlah_porsi') as HTMLInputElement).value);

      const selectedMaterials = [];
      document.querySelectorAll(".material-checkbox").forEach((checkbox, index) => {
        if ((checkbox as HTMLInputElement).checked) {
          const material = rawMaterials.value.find(m => m.id_bahan == parseInt((checkbox as HTMLInputElement).value));
          const kebutuhan = parseInt((document.querySelectorAll(".material-amount")[index] as HTMLInputElement).value);

          if (!isNaN(kebutuhan) && kebutuhan > 0) {
            selectedMaterials.push({ 
              id_bahan: material.id_bahan,
              kebutuhan 
            });
          }
        }
      });

      if (!nama_menu || !deskripsi || isNaN(jumlah_porsi) || jumlah_porsi <= 0 || selectedMaterials.length === 0) {
        Swal.showValidationMessage("Harap isi semua field dengan benar!");
        return null;
      }

      return { nama_menu, deskripsi, jumlah_porsi, bahan: selectedMaterials };
    }
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const url = isEdit ? `${API_URL}/emenu/${menu.id_menu}` : `${API_URL}/addmenu`;
        const method = isEdit ? "PUT" : "POST";
        const bodyData = JSON.stringify(result.value);

        console.log("Mengirim data ke API:", method, url, bodyData);

        const response = await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: bodyData,
        });

        const data = await response.json();
        if (!response.ok) throw new Error(`Error ${response.status}: ${data.message || "Gagal menyimpan data menu."}`);

        Swal.fire("Berhasil", isEdit ? "Menu berhasil diupdate" : "Menu berhasil ditambahkan", "success");
        fetchMenus();
      } catch (error) {
        Swal.fire("Error", error.message, "error");
        console.error("Error addOrEditMenu:", error);
      }
    }
  });
};

// ✅ Fetch data saat halaman dimuat
onMounted(() => {
  fetchMaterials();
  fetchMenus();
});
</script>

<template>
  <div class="p-6 relative">
    <h3 class="text-3xl font-bold text-gray-800">Manajemen Menu</h3>

    <!-- Tombol Tambah Mengambang (Hanya Admin) -->
    <button
      v-if="isAdmin"
      @click="addOrEditMenu(null)"
      class="fixed bottom-6 right-6 w-16 h-16 bg-green-500 text-white text-4xl font-bold rounded-full shadow-xl hover:bg-green-600 transition duration-300 flex items-center justify-center"
      title="Tambah Menu"
    >
      +
    </button>

    <!-- Grid Card Menu -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      <div
        v-for="menu in menus"
        :key="menu.id_menu"
        class="bg-white shadow-md rounded-lg p-5 border border-gray-200"
      >
        <h3 class="text-xl font-bold text-gray-800">{{ menu.nama_menu }}</h3>
        <p class="text-gray-600 text-sm">{{ menu.deskripsi }}</p>
        <p class="text-md font-semibold text-gray-700 mt-2">
          <span class="text-blue-500">Porsi:</span> {{ menu.jumlah_porsi }}
        </p>

        <h4 class="text-md font-semibold mt-3 text-gray-800">Bahan:</h4>
        <ul class="text-sm text-gray-700 ml-4 list-disc">
          <li v-for="bahan in menu.bahan" :key="bahan.nama_bahan">
            {{ bahan.nama_bahan }} - {{ bahan.kebutuhan }} kg ({{ bahan.nama_supplier }})
          </li>
        </ul>

        <!-- Hanya Admin yang Bisa Mengedit & Menghapus -->
        <div v-if="isAdmin" class="mt-4 flex justify-between">
          <button
            @click="addOrEditMenu(menu)"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Edit
          </button>
          <button
            @click="deleteMenu(menu.id_menu)"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
