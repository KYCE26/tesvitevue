<script setup>
import suppliers from '../data/supplier.js';
import { ref } from 'vue';

let isOpen = ref(1);
</script>

<template>
  <!-- Supplier Section Start -->
  <div id="supplier" class="container mx-auto px-5">
    <!-- Supplier Profile Card Section -->
    <div class="container mx-auto px-5 pt-10 pb-16">
      <h1 class="text-4xl font-bold font-theme-heading text-center mb-8">Profil Supplier</h1>
      <p class="text-theme-grayish-blue text-center mb-8 font-theme-content text-lg">
        Kami bekerja sama dengan berbagai supplier untuk memberikan informasi terkini tentang bahan yang telah didistribusikan maupun yang belum, baik itu bahan mentah maupun yang sudah jadi, guna memastikan kelancaran pasokan dan kualitas makanan yang tinggi.
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
        <div v-for="supplier in suppliers" :key="supplier.id" class="bg-white shadow-lg rounded-xl p-6">
          <!-- Card 1: Nama Supplier -->
          <div class="flex items-center mb-4">
            <i class="fa-solid fa-user text-theme-primary text-2xl mr-4"></i>
            <h2 class="text-lg font-semibold text-gray-800">Nama Supplier</h2>
          </div>
          <p class="text-gray-600">{{ supplier.name }}</p>

          <!-- Card 2: Alamat -->
          <div class="flex items-center mb-4 mt-6">
            <i class="fa-solid fa-location-dot text-theme-primary text-2xl mr-4"></i>
            <h2 class="text-lg font-semibold text-gray-800">Alamat</h2>
          </div>
          <p class="text-gray-600">{{ supplier.details.address }}</p>

          <!-- Card 3: Kontak -->
          <div class="flex items-center mb-4 mt-6">
            <i class="fa-solid fa-phone text-theme-primary text-2xl mr-4"></i>
            <h2 class="text-lg font-semibold text-gray-800">Kontak</h2>
          </div>
          <p class="text-gray-600">{{ supplier.details.contact }}</p>

          <!-- Card 4: Sertifikasi -->
          <div class="flex items-center mb-4 mt-6">
            <i class="fa-solid fa-award text-theme-primary text-2xl mr-4"></i>
            <h2 class="text-lg font-semibold text-gray-800">Sertifikasi</h2>
          </div>
          <p class="text-gray-600">{{ supplier.details.certifications.join(", ") }}</p>
        </div>
      </div>

      <!-- Button for More Information -->
      <div class="flex justify-center mt-10">
        <LinkButton btn-type="primary" link="#more-info">Selengkapnya</LinkButton>
      </div>
    </div>
  </div>
  <!-- Supplier Section End -->
</template>
