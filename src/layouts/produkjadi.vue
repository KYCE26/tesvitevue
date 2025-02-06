<script setup lang="ts">
import { ref } from 'vue';
import { rawMaterials } from '../data/makanan.js'; // Data bahan mentah
import cookedDishes from '../data/masak.js'; // Data masakan
import menuData from '../data/menu.js';
import Swal from 'sweetalert2';

interface RawMaterial {
  id: number;
  material: string;
  amount: string; // Jumlah bahan mentah, dalam kg
}

interface CookedDish {
  id: number;
  name: string;
  materials: { material: string; amount: string }[]; // Array bahan mentah dan jumlahnya
  status: string;
  date: string;
}

interface Menu {
  id: number;
  name: string;
  dishes: { name: string; stock: number }[]; // Produk masak dalam menu
  stock: number; // Jumlah stok menu
  date: string; // Tanggal pembuatan
}

// Simulasi data user login
const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
const isAdmin = currentUser.role === 'admin'; // Cek apakah user adalah admin

// Data bahan mentah, masakan, dan menu
const rawMaterialList = ref<RawMaterial[]>(rawMaterials);
const cookedDishList = ref<CookedDish[]>(cookedDishes);
const menuList = ref<Menu[]>(menuData);

// Fungsi untuk membuat menu baru (Hanya Admin)
const createMenu = () => {
  if (!isAdmin) return; // Batasi akses hanya untuk admin

  Swal.fire({
    title: 'Tambah Menu Baru',
    html: `
      <div class="flex flex-col items-center space-y-4" style="max-width: 400px; margin: auto;">
        <div class="w-full text-center">
          <label class="block text-sm font-medium mb-1">Nama Menu</label>
          <input id="menu-name" type="text" class="swal2-input" placeholder="Masukkan nama menu" />
        </div>

        <div class="w-full text-center">
          <label class="block text-sm font-medium mb-1">Pilih Masakan</label>
          <div id="dishes-container" class="grid gap-4" style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));">
            ${cookedDishList.value
              .map(
                (dish) => `
              <label class="flex items-center justify-center space-x-2">
                <input type="checkbox" class="dish-checkbox" value="${dish.id}" />
                <span>${dish.name}</span>
              </label>
            `
              )
              .join('')}
          </div>
        </div>

        <div class="w-full text-center">
          <label class="block text-sm font-medium mb-1">Stok</label>
          <input id="menu-stock" type="number" class="swal2-input" placeholder="Masukkan jumlah stok" />
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Tambah',
    preConfirm: () => {
      const name = (document.getElementById('menu-name') as HTMLInputElement).value;
      const stock = parseInt((document.getElementById('menu-stock') as HTMLInputElement).value, 10);

      const selectedDishes: { name: string; stock: number }[] = [];
      document.querySelectorAll('.dish-checkbox').forEach((checkbox) => {
        if ((checkbox as HTMLInputElement).checked) {
          const dish = cookedDishList.value.find(
            (d) => d.id === parseInt((checkbox as HTMLInputElement).value, 10)
          );
          if (dish) {
            selectedDishes.push({ name: dish.name, stock });
          }
        }
      });

      if (!name || isNaN(stock) || selectedDishes.length === 0) {
        Swal.showValidationMessage('Harap isi semua kolom dan pilih setidaknya satu masakan');
        return null;
      }

      return { name, stock, selectedDishes };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const { name, stock, selectedDishes } = result.value;

      // Kurangi bahan mentah berdasarkan jumlah stok
      selectedDishes.forEach((dish) => {
        const cookedDish = cookedDishList.value.find((d) => d.name === dish.name);
        if (cookedDish) {
          cookedDish.materials.forEach((material) => {
            const rawMaterial = rawMaterialList.value.find((raw) => raw.material === material.material);
            if (rawMaterial) {
              const rawAmount = parseFloat(rawMaterial.amount);
              const requiredAmount = parseFloat(material.amount) * stock;
              rawMaterial.amount = `${rawAmount - requiredAmount} kg`;
            }
          });
        }
      });

      // Tambahkan menu ke daftar menu
      menuList.value.push({
        id: menuList.value.length + 1,
        name,
        dishes: selectedDishes,
        stock,
        date: new Date().toISOString().split('T')[0],
      });

      Swal.fire('Berhasil!', 'Menu baru berhasil ditambahkan.', 'success');
    }
  });
};

// Fungsi untuk menampilkan detail menu (Akses Semua User)
const showMenuDetails = (menu: Menu) => {
  const dishesDetails = menu.dishes
    .map((dish) => `${dish.stock} x ${dish.name}`)
    .join(', ');

  Swal.fire({
    title: menu.name,
    html: `
      <div class="text-left">
        <p><strong>Stok:</strong> ${menu.stock}</p>
        <p><strong>Masakan:</strong> ${dishesDetails}</p>
        <p><strong>Tanggal:</strong> ${menu.date}</p>
      </div>
    `,
    showCancelButton: true,
    cancelButtonText: 'Tutup',
    showConfirmButton: isAdmin, // Hanya tampilkan tombol Edit untuk Admin
    confirmButtonText: 'Edit Menu',
  }).then((result) => {
    if (result.isConfirmed && isAdmin) {
      editMenu(menu);
    }
  });
};

const editMenu = (menu: Menu) => {
  Swal.fire({
    title: 'Edit Menu',
    html: `
      <div class="flex flex-col items-center space-y-4" style="max-width: 400px; margin: auto;">
        <div class="w-full text-center">
          <label class="block text-sm font-medium mb-1">Nama Menu</label>
          <input id="menu-name" type="text" class="swal2-input" value="${menu.name}" />
        </div>

        <div class="w-full text-center">
          <label class="block text-sm font-medium mb-1">Pilih Masakan</label>
          <div id="dishes-container" class="grid gap-4" style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));">
            ${cookedDishList.value
              .map(
                (dish) => `
              <label class="flex items-center justify-center space-x-2">
                <input type="checkbox" class="dish-checkbox" value="${dish.id}" ${menu.dishes.some(d => d.name === dish.name) ? 'checked' : ''} />
                <span>${dish.name}</span>
              </label>
            `
              )
              .join('')}
          </div>
        </div>

        <div class="w-full text-center">
          <label class="block text-sm font-medium mb-1">Stok</label>
          <input id="menu-stock" type="number" class="swal2-input" value="${menu.stock}" />
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Simpan Perubahan',
    preConfirm: () => {
      const name = (document.getElementById('menu-name') as HTMLInputElement).value;
      const stock = parseInt((document.getElementById('menu-stock') as HTMLInputElement).value, 10);

      const selectedDishes: { name: string; stock: number }[] = [];
      document.querySelectorAll('.dish-checkbox').forEach((checkbox) => {
        if ((checkbox as HTMLInputElement).checked) {
          const dish = cookedDishList.value.find(
            (d) => d.id === parseInt((checkbox as HTMLInputElement).value, 10)
          );
          if (dish) {
            selectedDishes.push({ name: dish.name, stock });
          }
        }
      });

      if (!name || isNaN(stock) || selectedDishes.length === 0) {
        Swal.showValidationMessage('Harap isi semua kolom dan pilih setidaknya satu masakan');
        return null;
      }

      return { name, stock, selectedDishes };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const { name, stock, selectedDishes } = result.value;

      // Update data menu di menuList
      const index = menuList.value.findIndex((m) => m.id === menu.id);
      if (index !== -1) {
        menuList.value[index] = {
          ...menuList.value[index],
          name,
          stock,
          dishes: selectedDishes,
        };
        Swal.fire('Berhasil!', 'Menu berhasil diperbarui.', 'success');
      }
    }
  });
};


// Fungsi untuk menghapus menu (Hanya Admin)
const deleteMenu = (menu: Menu) => {
  if (!isAdmin) return; // Batasi akses hanya untuk admin

  Swal.fire({
    title: 'Hapus Menu?',
    text: `Apakah Anda yakin ingin menghapus "${menu.name}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal',
  }).then((result) => {
    if (result.isConfirmed) {
      // Kembalikan bahan mentah saat menu dihapus
      menu.dishes.forEach((dish) => {
        const cookedDish = cookedDishList.value.find((d) => d.name === dish.name);
        if (cookedDish) {
          cookedDish.materials.forEach((material) => {
            const rawMaterial = rawMaterialList.value.find((raw) => raw.material === material.material);
            if (rawMaterial) {
              const rawAmount = parseFloat(rawMaterial.amount);
              const restoredAmount = parseFloat(material.amount) * menu.stock;
              rawMaterial.amount = `${rawAmount + restoredAmount} kg`;
            }
          });
        }
      });

      // Hapus menu dari daftar
      const index = menuList.value.findIndex((m) => m.id === menu.id);
      if (index !== -1) {
        menuList.value.splice(index, 1);
      }

      Swal.fire('Terhapus!', 'Menu telah dihapus.', 'success');
    }
  });
};
</script>

<template>
  <div class="space-y-4">
    <!-- Tombol Tambah (Hanya Admin) -->
    <button
      v-if="isAdmin"
      @click="createMenu"
      class="fixed bottom-6 right-6 w-16 h-16 bg-green-500 text-white text-4xl font-bold rounded-full shadow-xl hover:bg-green-600"
      title="Tambah Menu"
    >
      +
    </button>

    <!-- Daftar Menu -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="menu in menuList" :key="menu.id" class="bg-white shadow-md rounded-lg p-4">
        <h3 class="text-lg font-bold">{{ menu.name }}</h3>
        <p class="text-sm text-gray-600">Stok: {{ menu.stock }}</p>
        <p class="text-sm text-gray-600">Tanggal: {{ menu.date }}</p>
        <div class="mt-4 flex justify-between">
          <button @click="showMenuDetails(menu)" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Detail</button>
          <button v-if="isAdmin" @click="deleteMenu(menu)" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Hapus</button>
        </div>
      </div>
    </div>
  </div>
</template>
