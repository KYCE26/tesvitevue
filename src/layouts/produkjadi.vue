<script setup lang="ts">
import { ref } from 'vue';
import { finishedProducts } from '../data/makanan.js';
import Swal from 'sweetalert2';

interface FinishedProduct {
  id: number;
  product: string;
  ingredients: string[];
  category: string;
  status: string;
  date: string;
}

const finishedProductList = ref<FinishedProduct[]>(finishedProducts);

const showDetails = (product: FinishedProduct) => {
  Swal.fire({
    title: product.product,
    html: `
      <div class='text-left'>
        <p><strong>Ingredients:</strong> ${product.ingredients.join(', ')}</p>
        <p><strong>Category:</strong> ${product.category}</p>
        <p><strong>Status:</strong> ${product.status}</p>
        <p><strong>Date:</strong> ${product.date}</p>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Edit',
    cancelButtonText: 'Close',
  }).then((result) => {
    if (result.isConfirmed) {
      editProduct(product);
    }
  });
};

const editProduct = (product: FinishedProduct) => {
  Swal.fire({
    title: `Edit Product: ${product.product}`,
    html: `
      <div class='text-left'>
        <div class='mb-4'>
          <label class='block text-sm font-medium text-gray-700'>Product Name</label>
          <input id='product-name' type='text' class='swal2-input' value='${product.product}' />
        </div>
        <div class='mb-4'>
          <label class='block text-sm font-medium text-gray-700'>Ingredients</label>
          <input id='product-ingredients' type='text' class='swal2-input' value='${product.ingredients.join(', ')}' />
        </div>
        <div class='mb-4'>
          <label class='block text-sm font-medium text-gray-700'>Category</label>
          <input id='product-category' type='text' class='swal2-input' value='${product.category}' />
        </div>
        <div class='mb-4'>
          <label class='block text-sm font-medium text-gray-700'>Status</label>
          <select id='product-status' class='swal2-select'>
            <option value='Tersedia' ${product.status === 'Tersedia' ? 'selected' : ''}>Tersedia</option>
            <option value='Habis' ${product.status === 'Habis' ? 'selected' : ''}>Habis</option>
          </select>
        </div>
        <div class='mb-4'>
          <label class='block text-sm font-medium text-gray-700'>Date</label>
          <input id='product-date' type='date' class='swal2-input' value='${product.date}' />
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Save',
    cancelButtonText: 'Cancel',
    preConfirm: () => {
      const name = (document.getElementById('product-name') as HTMLInputElement).value;
      const ingredients = (document.getElementById('product-ingredients') as HTMLInputElement).value.split(',').map(i => i.trim());
      const category = (document.getElementById('product-category') as HTMLInputElement).value;
      const status = (document.getElementById('product-status') as HTMLSelectElement).value;
      const date = (document.getElementById('product-date') as HTMLInputElement).value;

      return { name, ingredients, category, status, date };
    },
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      const { name, ingredients, category, status, date } = result.value;
      product.product = name;
      product.ingredients = ingredients;
      product.category = category;
      product.status = status;
      product.date = date;

      Swal.fire('Saved!', 'Product updated successfully.', 'success');
    }
  });
};

const createProduct = () => {
  Swal.fire({
    title: 'Add New Product',
    html: `
      <div class='text-left'>
        <div class='mb-4'>
          <label class='block text-sm font-medium text-gray-700'>Product Name</label>
          <input id='product-name' type='text' class='swal2-input' placeholder='Enter product name' />
        </div>
        <div class='mb-4'>
          <label class='block text-sm font-medium text-gray-700'>Ingredients</label>
          <input id='product-ingredients' type='text' class='swal2-input' placeholder='Enter ingredients separated by commas' />
        </div>
        <div class='mb-4'>
          <label class='block text-sm font-medium text-gray-700'>Category</label>
          <input id='product-category' type='text' class='swal2-input' placeholder='Enter category' />
        </div>
        <div class='mb-4'>
          <label class='block text-sm font-medium text-gray-700'>Status</label>
          <select id='product-status' class='swal2-select'>
            <option value='Tersedia'>Tersedia</option>
            <option value='Habis'>Habis</option>
          </select>
        </div>
        <div class='mb-4'>
          <label class='block text-sm font-medium text-gray-700'>Date</label>
          <input id='product-date' type='date' class='swal2-input' />
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Add',
    cancelButtonText: 'Cancel',
    preConfirm: () => {
      const name = (document.getElementById('product-name') as HTMLInputElement).value;
      const ingredients = (document.getElementById('product-ingredients') as HTMLInputElement).value.split(',').map(i => i.trim());
      const category = (document.getElementById('product-category') as HTMLInputElement).value;
      const status = (document.getElementById('product-status') as HTMLSelectElement).value;
      const date = (document.getElementById('product-date') as HTMLInputElement).value;

      return { name, ingredients, category, status, date };
    },
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      const { name, ingredients, category, status, date } = result.value;
      finishedProductList.value.push({
        id: finishedProductList.value.length + 1,
        product: name,
        ingredients,
        category,
        status,
        date,
      });

      Swal.fire('Added!', 'New product has been successfully added.', 'success');
    }
  });
};

const deleteProduct = (product: FinishedProduct) => {
  Swal.fire({
    title: 'Are you sure?',
    text: `Delete "${product.product}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    if (result.isConfirmed) {
      finishedProductList.value = finishedProductList.value.filter(p => p.id !== product.id);
      Swal.fire('Deleted!', 'Product has been deleted.', 'success');
    }
  });
};
</script>

<template>
  <div class="space-y-4">
<!-- Floating Add Product Button -->
<button
  @click="createProduct"
  class="fixed bottom-6 right-6 w-16 h-16 bg-green-500 text-white text-4xl font-bold rounded-full shadow-xl hover:bg-green-600 focus:outline-none"
  title="Add Product"
>
  +
</button>


    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="product in finishedProductList" :key="product.id" class="bg-white shadow-md rounded-lg p-4">
        <h3 class="text-lg font-bold">{{ product.product }}</h3>
        <p class="text-sm text-gray-600">Category: {{ product.category }}</p>
        <p class="text-sm text-gray-600">Status: {{ product.status }}</p>
        <div class="mt-4 flex justify-between">
          <button @click="showDetails(product)" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Detail
          </button>
          <button @click="deleteProduct(product)" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
