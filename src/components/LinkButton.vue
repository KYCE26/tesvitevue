<script setup>
const props = defineProps({
  btnType: String,
  link: String,
  customClass: {
    type: String,
    default: "text-sm sm:text-md md:text-base"
  }
});

const handleClick = () => {
  // Cek apakah link adalah anchor (#)
  if (link.startsWith('#')) {
    const targetElement = document.querySelector(link);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
};
</script>

<template>
  <!-- Tombol dengan btnType 'primary' -->
  <router-link 
    v-if="btnType === 'primary'" 
    :to="link"
    :class="['font-theme-heading font-medium bg-theme-primary px-6 py-2 text-white rounded shadow-md hover:bg-white border-2 border-transparent hover:border-theme-primary hover:text-theme-primary cursor-pointer transition duration-200 mr-5', customClass]"
  >
    <slot></slot>
  </router-link>
  
  <!-- Tombol dengan btnType 'muted' untuk rute biasa -->
  <router-link 
    v-if="btnType === 'muted' && !link.startsWith('#')" 
    :to="link"
    :class="['font-theme-heading font-medium bg-gray-100 text-gray-500 px-6 py-2 rounded shadow-md hover:bg-white border-2 border-transparent hover:border-theme-grayish-blue hover:text-theme-grayish-blue cursor-pointer transition duration-200', customClass]"
  >
    <slot></slot>
  </router-link>
  
  <!-- Tombol dengan btnType 'muted' untuk anchor -->
  <button 
    v-if="btnType === 'muted' && link.startsWith('#')" 
    :class="['font-theme-heading font-medium bg-gray-100 text-gray-500 px-6 py-2 rounded shadow-md hover:bg-white border-2 border-transparent hover:border-theme-grayish-blue hover:text-theme-grayish-blue cursor-pointer transition duration-200', customClass]"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>
