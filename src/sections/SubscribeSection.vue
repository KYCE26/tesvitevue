<script setup>
import { ref } from "vue";
import Swal from "sweetalert2";
import emailjs from "emailjs-com";

const name = ref("");
const email = ref("");
const message = ref("");
const nameError = ref(false);
const emailError = ref(false);
const messageError = ref(false);

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Konfigurasi EmailJS
const serviceID = "service_55t3xal";  // Ganti dengan Service ID dari EmailJS
const templateID = "template_cqjmufm"; // Ganti dengan Template ID dari EmailJS
const publicKey = "9UUxlsRmfpzTQD4c4";  // Ganti dengan Public Key dari EmailJS

const handleSubmit = () => {
    if (!name.value || !email.value || !emailRegex.test(email.value) || !message.value) {
        nameError.value = !name.value;
        emailError.value = !email.value || !emailRegex.test(email.value);
        messageError.value = !message.value;
        return;
    }

    // Data yang akan dikirim ke EmailJS
    const emailParams = {
        from_name: name.value,       // Nama Pengirim (User)
        from_email: email.value,     // Email Pengirim (User)
        to_name: "Admin",            // Nama penerima (bisa diubah)
        message: message.value,      // Isi pesan
    };

    // Kirim email dengan EmailJS
    emailjs.send(serviceID, templateID, emailParams, publicKey)
        .then(() => {
            Swal.fire({
                icon: "success",
                title: "Pesan Terkirim!",
                text: `Terima kasih, ${name.value}. Kami akan segera menghubungi Anda.`,
            });

            // Reset form setelah sukses
            name.value = "";
            email.value = "";
            message.value = "";
        })
        .catch((error) => {
            console.error("Gagal mengirim email:", error);
            Swal.fire({
                icon: "error",
                title: "Gagal Mengirim",
                text: "Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.",
            });
        });
};
</script>

<template>
    <!-- Bagian Kontak Kami -->
    <div id="contact-us" class="bg-theme-primary mt-10 py-16">
        <div class="container w-full lg:w-2/5 mx-auto px-5">
            <form @submit.prevent="handleSubmit">
                <div class="space-y-4 mt-8">
                    <!-- Input Nama -->
                    <div>
                        <input 
                            v-model="name" 
                            class="w-full py-3 px-5 text-sm text-gray-600 border-0 shadow-md rounded focus:ring-4 focus:ring-blue-300"
                            type="text" 
                            placeholder="Nama Anda" 
                        />
                        <div v-show="nameError" class="text-xs text-red-500">Nama wajib diisi</div>
                    </div>

                    <!-- Input Email -->
                    <div>
                        <input 
                            v-model="email" 
                            @input="emailError = false" 
                            class="w-full py-3 px-5 text-sm text-gray-600 border-0 shadow-md rounded focus:ring-4 focus:ring-blue-300"
                            type="email" 
                            placeholder="Email Anda" 
                        />
                        <div v-show="emailError" class="text-xs text-red-500">Pastikan email valid</div>
                    </div>

                    <!-- Input Pesan -->
                    <div>
                        <textarea 
                            v-model="message" 
                            @input="messageError = false" 
                            class="w-full py-3 px-5 text-sm text-gray-600 border-0 shadow-md rounded focus:ring-4 focus:ring-blue-300"
                            placeholder="Pesan Anda" 
                            rows="5"
                        ></textarea>
                        <div v-show="messageError" class="text-xs text-red-500">Pesan tidak boleh kosong</div>
                    </div>

                    <div class="text-center mt-4">
                        <button type="submit" class="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
                            Kirim Pesan
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
