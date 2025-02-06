<script setup>
import { ref } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

const name = ref("");
const email = ref("");
const message = ref("");
const nameError = ref(false);
const emailError = ref(false);
const messageError = ref(false);

const accessToken = "ya29.a0AXeO80Q4Fgcr1YyMDtwJDykzO2KPAWfQrv8gg5bTZuSL1Zy-LeOPWQgMv6L3x_16OR1BbM_zNjZNMaHwYeb_uvm3QnmUJtRtBaQWjXK7qXfNLPqY9RqaGO9Lk3kiGD2aUKBAMcstC_mjtisKcO2TfA_2AmqtE0RciUgGqbs_aCgYKAX8SARASFQHGX2Mijci4OiCE7oWgpKTXWc5CFw0175"; // Ganti dengan Access Token dari OAuth Playground

const handleSubmit = async () => {
    if (!name.value || !email.value || !message.value) {
        nameError.value = !name.value;
        emailError.value = !email.value;
        messageError.value = !message.value;
        return;
    }

    // Format email dalam RFC 2822
    const emailContent = [
        `From: "Your Name" <muhammad26rifky06@gmail.com>`,
        `To: "Recipient Name" <recipient-email@gmail.com>`,
        `Subject: Pesan dari ${name.value}`,
        `Content-Type: text/plain; charset="UTF-8"`,
        ``,
        `${message.value}`,
    ].join("\n");

    // Encode email dalam Base64
    const encodedEmail = btoa(emailContent).replace(/\+/g, "-").replace(/\//g, "_");

    try {
        const response = await axios.post(
            "https://www.googleapis.com/gmail/v1/users/me/messages/send",
            { raw: encodedEmail },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        Swal.fire({
            icon: "success",
            title: "Pesan Terkirim!",
            text: `Terima kasih, ${name.value}. Kami akan segera menghubungi Anda.`,
        });

        // Reset form setelah sukses
        name.value = "";
        email.value = "";
        message.value = "";

    } catch (error) {
        console.error("Gagal mengirim email:", error);
        Swal.fire({
            icon: "error",
            title: "Gagal Mengirim",
            text: "Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.",
        });
    }
};
</script>

<template>
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
