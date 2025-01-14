<script setup lang="ts">
import { ref } from 'vue';
import { rawMaterials, finishedProducts } from '../data/makanan.js';
import Swal from 'sweetalert2';

interface RawMaterial {
  id: number;
  supplier: string;
  material: string;
  amount: string; // String, konversi ke number
  source: string;
  category: string;
  status: string;
  date: string;
}

interface FinishedProduct {
  id: number;
  product: string;
  ingredients: { material: string; amount: string }[]; // Bahan dan jumlahnya
  category: string;
  status: string;
  stock: number; // Atribut stok baru
  date: string;
}

const rawMaterialList = ref<RawMaterial[]>(rawMaterials);
const finishedProductList = ref<FinishedProduct[]>(finishedProducts);
const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

// Fungsi untuk mencari bahan mentah berdasarkan nama
const findRawMaterial = (materialName: string) =>
  rawMaterialList.value.find((raw) => raw.material === materialName);

// Fungsi untuk membuat produk baru
const createProduct = () => {
  if (currentUser?.role !== 'admin') return;

  Swal.fire({
    title: 'Add New Product',
    html: `
      <div>
        <label class="block text-sm font-medium">Product Name</label>
        <input id="product-name" type="text" class="swal2-input" placeholder="Enter product name" />
        <label class="block text-sm font-medium">Category</label>
        <input id="product-category" type="text" class="swal2-input" placeholder="Enter category" />
        <label class="block text-sm font-medium">Stock</label>
        <input id="product-stock" type="number" class="swal2-input" placeholder="Enter stock" />
        <label class="block text-sm font-medium">Select Ingredients</label>
        <div id="ingredients-container">
          ${rawMaterialList.value
            .map(
              (material) => `
            <div class="flex items-center mt-2">
              <input type="checkbox" class="ingredient-checkbox" value="${material.id}" />
              <span class="ml-2">${material.material} (${material.amount})</span>
              <input type="number" class="ingredient-amount ml-4 border rounded px-2" placeholder="Amount (kg)" />
            </div>
          `
            )
            .join('')}
        </div>
        <label class="block text-sm font-medium mt-4">Status</label>
        <select id="product-status" class="swal2-select">
          <option value="Tersedia">Tersedia</option>
          <option value="Habis">Habis</option>
        </select>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Add',
    preConfirm: () => {
      const name = (document.getElementById('product-name') as HTMLInputElement).value;
      const category = (document.getElementById('product-category') as HTMLInputElement).value;
      const stock = parseInt((document.getElementById('product-stock') as HTMLInputElement).value, 10);
      const status = (document.getElementById('product-status') as HTMLSelectElement).value;

      const selectedIngredients: { material: string; amount: string }[] = [];
      document.querySelectorAll('.ingredient-checkbox').forEach((checkbox, index) => {
        if ((checkbox as HTMLInputElement).checked) {
          const rawMaterial = rawMaterialList.value.find(
            (m) => m.id === parseInt((checkbox as HTMLInputElement).value, 10)
          );
          const amountInput = document.querySelectorAll('.ingredient-amount')[index] as HTMLInputElement;
          const amount = parseFloat(amountInput.value);

          if (rawMaterial && amount > 0 && amount <= parseFloat(rawMaterial.amount)) {
            selectedIngredients.push({ material: rawMaterial.material, amount: `${amount} kg` });
            rawMaterial.amount = `${parseFloat(rawMaterial.amount) - amount} kg`;
          } else {
            Swal.showValidationMessage(`Invalid amount for ${rawMaterial?.material || 'selected material'}`);
            return null;
          }
        }
      });

      if (!name || !category || isNaN(stock) || selectedIngredients.length === 0) {
        Swal.showValidationMessage('Please fill in all fields and select at least one ingredient');
        return null;
      }

      return { name, category, stock, status, ingredients: selectedIngredients };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const { name, category, stock, status, ingredients } = result.value;

      finishedProductList.value.push({
        id: finishedProductList.value.length + 1,
        product: name,
        category,
        stock,
        status,
        date: new Date().toISOString().split('T')[0],
        ingredients,
      });

      Swal.fire('Added!', 'New product has been successfully added.', 'success');
    }
  });
};

// Fungsi untuk menampilkan detail
const showDetails = (product: FinishedProduct) => {
  const ingredientsDetails = product.ingredients
    .map((ingredient) => `<li>${ingredient.material}: ${ingredient.amount}</li>`)
    .join('');

  Swal.fire({
    title: product.product,
    html: `
      <div class='text-left'>
        <p><strong>Ingredients:</strong></p>
        <ul>${ingredientsDetails}</ul>
        <p><strong>Category:</strong> ${product.category}</p>
        <p><strong>Stock:</strong> ${product.stock}</p>
        <p><strong>Status:</strong> ${product.status}</p>
        <p><strong>Date:</strong> ${product.date}</p>
      </div>
    `,
    showCancelButton: true,
    cancelButtonText: 'Close',
    showConfirmButton: currentUser?.role === 'admin',
    confirmButtonText: 'Edit',
  }).then((result) => {
    if (result.isConfirmed && currentUser?.role === 'admin') {
      editProduct(product);
    }
  });
};

// Fungsi untuk mengedit produk
const editProduct = (product: FinishedProduct) => {
  Swal.fire({
    title: `Edit Product: ${product.product}`,
    html: `
      <div>
        <label class="block text-sm font-medium">Product Name</label>
        <input id="product-name" type="text" class="swal2-input" value="${product.product}" />
        <label class="block text-sm font-medium">Category</label>
        <input id="product-category" type="text" class="swal2-input" value="${product.category}" />
        <label class="block text-sm font-medium">Stock</label>
        <input id="product-stock" type="number" class="swal2-input" value="${product.stock}" />
        <label class="block text-sm font-medium">Ingredients</label>
        <div id="ingredients-container">
          ${rawMaterialList.value
            .map((rawMaterial) => {
              const existingIngredient = product.ingredients.find((i) => i.material === rawMaterial.material);
              return `
              <div class="flex items-center mt-2">
                <input
                  type="checkbox"
                  class="ingredient-checkbox"
                  value="${rawMaterial.id}"
                  ${existingIngredient ? 'checked' : ''}
                />
                <span class="ml-2">${rawMaterial.material} (${rawMaterial.amount})</span>
                <input
                  type="number"
                  class="ingredient-amount ml-4 border rounded px-2"
                  placeholder="Amount (kg)"
                  value="${existingIngredient ? parseFloat(existingIngredient.amount) : ''}"
                  ${existingIngredient ? '' : 'disabled'}
                />
              </div>
              `;
            })
            .join('')}
        </div>
        <label class="block text-sm font-medium mt-4">Status</label>
        <select id="product-status" class="swal2-select">
          <option value="Tersedia" ${product.status === 'Tersedia' ? 'selected' : ''}>Tersedia</option>
          <option value="Habis" ${product.status === 'Habis' ? 'selected' : ''}>Habis</option>
        </select>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Save',
    preConfirm: () => {
      const name = (document.getElementById('product-name') as HTMLInputElement).value;
      const category = (document.getElementById('product-category') as HTMLInputElement).value;
      const stock = parseInt((document.getElementById('product-stock') as HTMLInputElement).value, 10);
      const status = (document.getElementById('product-status') as HTMLSelectElement).value;

      const updatedIngredients: { material: string; amount: string }[] = [];
      document.querySelectorAll('.ingredient-checkbox').forEach((checkbox, index) => {
        const isChecked = (checkbox as HTMLInputElement).checked;
        const rawMaterial = rawMaterialList.value.find(
          (m) => m.id === parseInt((checkbox as HTMLInputElement).value, 10)
        );
        const amountInput = document.querySelectorAll('.ingredient-amount')[index] as HTMLInputElement;
        const amount = parseFloat(amountInput.value);

        if (isChecked && rawMaterial && amount > 0) {
          updatedIngredients.push({ material: rawMaterial.material, amount: `${amount} kg` });

          // Update jumlah bahan mentah
          const existingIngredient = product.ingredients.find((i) => i.material === rawMaterial.material);
          const originalAmount = existingIngredient
            ? parseFloat(existingIngredient.amount)
            : 0;
          rawMaterial.amount = `${parseFloat(rawMaterial.amount) + originalAmount - amount} kg`;
        } else if (isChecked && (!rawMaterial || amount <= 0)) {
          Swal.showValidationMessage(`Invalid amount for ${rawMaterial?.material || 'selected material'}`);
          return null;
        }
      });

      if (!name || !category || isNaN(stock) || updatedIngredients.length === 0) {
        Swal.showValidationMessage('Please fill in all fields and select at least one ingredient');
        return null;
      }

      return { name, category, stock, status, ingredients: updatedIngredients };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const { name, category, stock, status, ingredients } = result.value;

      product.product = name;
      product.category = category;
      product.stock = stock;
      product.status = status;
      product.ingredients = ingredients;

      Swal.fire('Saved!', 'Product updated successfully.', 'success');
    }
  });
};


// Fungsi untuk menghapus produk
const deleteProduct = (product: FinishedProduct) => {
  Swal.fire({
    title: 'Are you sure?',
    text: `Delete "${product.product}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {
      product.ingredients.forEach((ingredient) => {
        const rawMaterial = findRawMaterial(ingredient.material);
        if (rawMaterial) {
          rawMaterial.amount = `${parseFloat(rawMaterial.amount) + parseFloat(ingredient.amount)} kg`;
        }
      });

      const index = finishedProductList.value.findIndex((p) => p.id === product.id);
      if (index !== -1) {
        finishedProductList.value.splice(index, 1);
      }

      Swal.fire('Deleted!', 'Product has been deleted.', 'success');
    }
  });
};
</script>

<template>
  <div class="space-y-4">
    <button
      v-if="currentUser?.role === 'admin'"
      @click="createProduct"
      class="fixed bottom-6 right-6 w-16 h-16 bg-green-500 text-white text-4xl font-bold rounded-full shadow-xl hover:bg-green-600"
      title="Add Product"
    >
      +
    </button>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="product in finishedProductList" :key="product.id" class="bg-white shadow-md rounded-lg p-4">
        <h3 class="text-lg font-bold">{{ product.product }}</h3>
        <p class="text-sm text-gray-600">Category: {{ product.category }}</p>
        <p class="text-sm text-gray-600">Stock: {{ product.stock }}</p>
        <p class="text-sm text-gray-600">Status: {{ product.status }}</p>
        <div class="mt-4 flex justify-between">
          <button @click="showDetails(product)" class="px-4 py-2 bg-blue-500 text-white rounded">Detail</button>
          <button
            v-if="currentUser?.role === 'admin'"
            @click="deleteProduct(product)"
            class="px-4 py-2 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
