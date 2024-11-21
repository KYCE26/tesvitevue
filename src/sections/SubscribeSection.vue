<script setup>
import { ref } from "vue";
import Swal from "sweetalert2";

let name = ref("");
let email = ref("");
let message = ref("");
let nameError = ref(false);
let emailError = ref(false);
let messageError = ref(false);

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const handleSubmit = () => {
    if (!name.value || !email.value || !emailRegex.test(email.value) || !message.value) {
        nameError.value = !name.value;
        emailError.value = !email.value || !emailRegex.test(email.value);
        messageError.value = !message.value;
    } else {
        Swal.fire({
            icon: "success",
            title: "Thank You",
            text: `Thank you, ${name.value}. We have received your message and will get back to you soon.`,
        });
    }
};
</script>

<template>
    <!-- Contact Us Section Start -->
    <div id="contact-us" class="bg-theme-primary mt-10 py-16">
        <div class="container w-full lg:w-2/5 mx-auto px-5">
            <form @submit.prevent="handleSubmit()">
                <div class="space-y-4 mt-8">
                    <!-- Name Input -->
                    <div>
                        <input 
                            v-model="name" 
                            class="w-full py-3 px-5 text-sm text-gray-600 border-0 shadow-md rounded focus:ring-4 focus:ring-blue-300"
                            type="text" 
                            placeholder="Nama Anda" 
                        />
                        <div v-show="nameError" class="text-xs text-red-500">Nama wajib diisi</div>
                    </div>

                    <!-- Email Input -->
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

                    <!-- Message Input -->
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
                        <Button type="submit" btn-type="secondary">Kirim Pesan</Button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <!-- Contact Us Section End -->
</template>
