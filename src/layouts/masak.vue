<script setup lang="ts">
import { ref } from 'vue';
import { rawMaterials } from '../data/makanan.js'; // Data bahan mentah
import cookedDishes from '../data/masak.js'; // Data masakan
import Swal from 'sweetalert2';

interface RawMaterial {
  id: number;
  material: string;
  amount: string; // Jumlah bahan mentah, dalam kg
}

interface CookedDish {
  id: number;
  name: string;
  category: string;
  materials: { material: string; amount: string }[]; // Array bahan mentah dan jumlahnya
  status: string; // Status masakan, "Tersedia" atau "Belum"
  date: string;
}

// Simulasi data pengguna yang login
const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
const isAdmin = currentUser.role === 'admin';

// Data bahan mentah dan masakan
const rawMaterialList = ref<RawMaterial[]>(rawMaterials);
const cookedDishList = ref<CookedDish[]>(cookedDishes);

// Fungsi untuk menambahkan masakan baru (Hanya Admin)
const createDish = () => {
  if (!isAdmin) return; // Batasi akses hanya untuk admin

  Swal.fire({
    title: 'Tambah Masakan Baru',
    html: `
      <div class="flex flex-col items-center space-y-4" style="max-width: 400px; margin: auto;">
        <div class="w-full">
          <label class="block text-sm font-medium text-center">Nama Masakan</label>
          <input id="dish-name" type="text" class="swal2-input" placeholder="Masukkan nama masakan" />
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium text-center mt-2">Kategori</label>
          <input id="dish-category" type="text" class="swal2-input" placeholder="Masukkan kategori" />
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium text-center mt-4">Pilih Bahan Mentah</label>
          <div id="raw-material-container" class="grid grid-cols-1 gap-y-3 mt-2 justify-center">
            ${rawMaterialList.value
              .map(
                (raw) => `
                <div class="flex items-center justify-between space-x-2">
                  <div class="flex items-center">
                    <input type="checkbox" class="raw-material-checkbox" value="${raw.id}" />
                    <span class="ml-2">${raw.material} (${raw.amount} kg)</span>
                  </div>
                  <input
                    type="number"
                    class="raw-material-amount border rounded px-2"
                    style="width: 100px;"
                    placeholder="Jumlah"
                    disabled
                  />
                </div>
              `
              )
              .join('')}
          </div>
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium text-center mt-4">Status</label>
          <select id="dish-status" class="swal2-select">
            <option value="Tersedia">Tersedia</option>
            <option value="Belum">Belum</option>
          </select>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Tambah',
    didOpen: () => {
      const checkboxes = document.querySelectorAll('.raw-material-checkbox');
      checkboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', () => {
          const amountInput = document.querySelectorAll('.raw-material-amount')[index] as HTMLInputElement;
          amountInput.disabled = !(checkbox as HTMLInputElement).checked;
        });
      });
    },
    preConfirm: () => {
      const name = (document.getElementById('dish-name') as HTMLInputElement).value;
      const category = (document.getElementById('dish-category') as HTMLInputElement).value;
      const status = (document.getElementById('dish-status') as HTMLSelectElement).value;

      const selectedMaterials: { material: string; amount: string }[] = [];
      document.querySelectorAll('.raw-material-checkbox').forEach((checkbox, index) => {
        if ((checkbox as HTMLInputElement).checked) {
          const rawMaterial = rawMaterialList.value.find(
            (raw) => raw.id === parseInt((checkbox as HTMLInputElement).value, 10)
          );
          const amountInput = document.querySelectorAll('.raw-material-amount')[index] as HTMLInputElement;
          const amount = parseFloat(amountInput.value);

          if (!rawMaterial || isNaN(amount) || amount <= 0) {
            Swal.showValidationMessage(`Jumlah tidak valid untuk ${rawMaterial?.material || 'bahan terpilih'}`);
            return null;
          }

          selectedMaterials.push({ material: rawMaterial.material, amount: `${amount} kg` });
        }
      });

      if (!name || !category || selectedMaterials.length === 0) {
        Swal.showValidationMessage('Harap isi semua kolom dan pilih setidaknya satu bahan mentah');
        return null;
      }

      return { name, category, status, materials: selectedMaterials };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const { name, category, status, materials } = result.value;

      // Tambahkan masakan ke daftar
      cookedDishList.value.push({
        id: cookedDishList.value.length + 1,
        name,
        category,
        materials,
        status,
        date: new Date().toISOString().split('T')[0],
      });

      Swal.fire('Berhasil!', 'Masakan baru berhasil ditambahkan.', 'success');
    }
  });
};

// Fungsi untuk menampilkan detail masakan (Akses Semua User)
const showDishDetails = (dish: CookedDish) => {
  Swal.fire({
    title: dish.name,
    html: `
      <div class="text-left">
        <p><strong>Kategori:</strong> ${dish.category}</p>
        <p><strong>Bahan Mentah:</strong> ${dish.materials.map(m => `${m.amount} (${m.material})`).join(', ')}</p>
        <p><strong>Status:</strong> ${dish.status}</p>
        <p><strong>Tanggal:</strong> ${dish.date}</p>
      </div>
    `,
    showCancelButton: true,
    cancelButtonText: 'Tutup',
    showConfirmButton: isAdmin,  // Tombol Edit hanya muncul jika admin
    confirmButtonText: 'Edit',
  }).then((result) => {
    if (result.isConfirmed && isAdmin) {
      openEditDishModal(dish);
    }
  });
};



// Fungsi untuk menghapus masakan (Hanya Admin)
const deleteDish = (dish: CookedDish) => {
  if (!isAdmin) return; // Batasi akses hanya untuk admin

  Swal.fire({
    title: 'Hapus Masakan?',
    text: `Apakah Anda yakin ingin menghapus "${dish.name}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal',
  }).then((result) => {
    if (result.isConfirmed) {
      const index = cookedDishList.value.findIndex((d) => d.id === dish.id);
      if (index !== -1) {
        cookedDishList.value.splice(index, 1);
      }

      Swal.fire('Terhapus!', 'Masakan telah dihapus.', 'success');
    }
  });
};
const openEditDishModal = (dish: CookedDish) => {
  Swal.fire({
    title: 'Edit Masakan',
    html: `
      <div class="flex flex-col items-center space-y-4" style="max-width: 400px; margin: auto;">
        <div class="w-full">
          <label class="block text-sm font-medium text-center">Nama Masakan</label>
          <input id="edit-name" type="text" class="swal2-input" value="${dish.name}" />
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium text-center mt-2">Kategori</label>
          <input id="edit-category" type="text" class="swal2-input" value="${dish.category}" />
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium text-center mt-4">Pilih Bahan Mentah</label>
          <div id="raw-material-container" class="grid grid-cols-1 gap-y-3 mt-2 justify-center">
            ${rawMaterialList.value
              .map((raw) => {
                const selectedMaterial = dish.materials.find(m => m.material === raw.material);
                return `
                  <div class="flex items-center justify-between space-x-2">
                    <div class="flex items-center">
                      <input type="checkbox" class="raw-material-checkbox" value="${raw.id}" ${selectedMaterial ? 'checked' : ''} />
                      <span class="ml-2">${raw.material} (${raw.amount} kg)</span>
                    </div>
                    <input
                      type="number"
                      class="raw-material-amount border rounded px-2"
                      style="width: 100px;"
                      placeholder="Jumlah"
                      value="${selectedMaterial ? selectedMaterial.amount.replace(' kg', '') : ''}"
                      ${selectedMaterial ? '' : 'disabled'}
                    />
                  </div>
                `;
              })
              .join('')}
          </div>
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium text-center mt-4">Status</label>
          <select id="edit-status" class="swal2-select">
            <option value="Tersedia" ${dish.status === 'Tersedia' ? 'selected' : ''}>Tersedia</option>
            <option value="Belum" ${dish.status === 'Belum' ? 'selected' : ''}>Belum</option>
          </select>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Simpan',
    didOpen: () => {
      const checkboxes = document.querySelectorAll('.raw-material-checkbox');
      checkboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', () => {
          const amountInput = document.querySelectorAll('.raw-material-amount')[index] as HTMLInputElement;
          amountInput.disabled = !(checkbox as HTMLInputElement).checked;
        });
      });
    },
    preConfirm: () => {
      const name = (document.getElementById('edit-name') as HTMLInputElement).value;
      const category = (document.getElementById('edit-category') as HTMLInputElement).value;
      const status = (document.getElementById('edit-status') as HTMLSelectElement).value;

      const selectedMaterials: { material: string; amount: string }[] = [];
      document.querySelectorAll('.raw-material-checkbox').forEach((checkbox, index) => {
        if ((checkbox as HTMLInputElement).checked) {
          const rawMaterial = rawMaterialList.value.find(
            (raw) => raw.id === parseInt((checkbox as HTMLInputElement).value, 10)
          );
          const amountInput = document.querySelectorAll('.raw-material-amount')[index] as HTMLInputElement;
          const amount = parseFloat(amountInput.value);

          if (!rawMaterial || isNaN(amount) || amount <= 0) {
            Swal.showValidationMessage(`Jumlah tidak valid untuk ${rawMaterial?.material || 'bahan terpilih'}`);
            return null;
          }

          selectedMaterials.push({ material: rawMaterial.material, amount: `${amount} kg` });
        }
      });

      if (!name || !category || selectedMaterials.length === 0) {
        Swal.showValidationMessage('Harap isi semua kolom dan pilih setidaknya satu bahan mentah');
        return null;
      }

      return { name, category, status, materials: selectedMaterials };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const index = cookedDishList.value.findIndex(d => d.id === dish.id);
      if (index !== -1) {
        cookedDishList.value[index] = { ...cookedDishList.value[index], ...result.value };
      }
      Swal.fire('Berhasil!', 'Masakan berhasil diperbarui.', 'success');
    }
  });
};


</script>

<template>
  <div class="space-y-4">
    <!-- Tombol Tambah (Hanya Admin) -->
    <button
      v-if="isAdmin"
      @click="createDish"
      class="fixed bottom-6 right-6 w-16 h-16 bg-green-500 text-white text-4xl font-bold rounded-full shadow-xl hover:bg-green-600"
      title="Tambah Masakan"
    >
      +
    </button>

    <!-- Daftar Masakan -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="dish in cookedDishList" :key="dish.id" class="bg-white shadow-md rounded-lg p-4">
        <h3 class="text-lg font-bold">{{ dish.name }}</h3>
        <p class="text-sm text-gray-600">Kategori: {{ dish.category }}</p>
        <p class="text-sm text-gray-600">
          Bahan Mentah:
          <span v-for="(material, index) in dish.materials" :key="index">
            {{ material.amount }} ({{ material.material }})<span v-if="index < dish.materials.length - 1">, </span>
          </span>
        </p>
        <p class="text-sm text-gray-600">Status: {{ dish.status }}</p>
        <p class="text-sm text-gray-600">Tanggal: {{ dish.date }}</p>
        <div class="mt-4 flex justify-between">
          <button @click="showDishDetails(dish)" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Detail</button>
          <button v-if="isAdmin" @click="deleteDish(dish)" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Hapus</button>
        </div>
      </div>
    </div>
  </div>
</template>
