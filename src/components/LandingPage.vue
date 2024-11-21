<template>
    <div>
      <section class="hero-section">
        <div class="hero-content">
          <h1>Selamat Datang di SIMAG</h1>
          <p>Membantu SD dan SMP di Bandung dengan informasi distribusi makan gratis dari pemerintah.</p>
          <router-link to="#tentang" class="cta-button">Pelajari Lebih Lanjut</router-link>
        </div>
      </section>
  
      <section id="tentang" class="about-section">
        <h2>Tentang SIMAG</h2>
        <p>
          Sistem Informasi Makan Gratis (SIMAG) dirancang untuk mengelola dan memonitor distribusi makanan gratis di
          sekolah-sekolah dasar dan menengah di Bandung. Program ini bertujuan untuk memastikan keberlanjutan
          distribusi makanan dan menjamin akses yang adil bagi semua sekolah di kawasan ini.
        </p>
        <div class="about-cards">
          <div class="about-card">
            <h3>Data Tersusun Rapi</h3>
            <p>Data sekolah dan distribusi makanan disusun dengan baik agar mudah diakses oleh pihak terkait.</p>
          </div>
          <div class="about-card">
            <h3>Transparansi</h3>
            <p>Informasi terkait program distribusi makan tersedia untuk umum, mendukung transparansi dalam setiap tahap.</p>
          </div>
          <div class="about-card">
            <h3>Pengawasan Efektif</h3>
            <p>Melibatkan pemangku kepentingan untuk mengawasi dan memastikan distribusi makanan tepat sasaran.</p>
          </div>
        </div>
      </section>
  
      <section id="fitur" class="features-section">
        <h2>Fitur SIMAG</h2>
        <div class="features-list">
          <div class="feature-item">
            <h3>Distribusi Makanan</h3>
            <p>Program distribusi makanan untuk memastikan akses yang adil bagi setiap sekolah di Bandung.</p>
          </div>
          <div class="feature-item">
            <h3>Transparansi Data</h3>
            <p>Setiap sekolah dapat mengakses data distribusi yang mencakup jadwal dan status makanan yang diterima.</p>
          </div>
          <div class="feature-item">
            <h3>Komunitas Terkait</h3>
            <p>Program ini bekerja sama dengan komunitas lokal untuk memastikan proses distribusi berjalan lancar.</p>
          </div>
        </div>
      </section>
  
      <section id="statistik" class="stats-section">
        <h2>Statistik Program</h2>
        <p>Berikut adalah beberapa statistik terkait dengan distribusi makanan di program SIMAG yang telah berjalan:</p>
        <div class="stats-cards">
          <div class="stat-card">
            <h3>Jumlah Sekolah Terlibat</h3>
            <p>120+</p>
            <p class="stat-description">Sekolah-sekolah di Bandung yang berpartisipasi dalam program distribusi makan gratis.</p>
          </div>
          <div class="stat-card">
            <h3>Jumlah Makanan Terdistribusi</h3>
            <p>77.172+</p>
            <p class="stat-description">Makanan yang telah disalurkan ke sekolah-sekolah selama periode tertentu.</p>
          </div>
          <div class="stat-card">
            <h3>Komunitas Terlibat</h3>
            <p>50+</p>
            <p class="stat-description">Komunitas yang turut serta dalam mendukung program distribusi makan gratis.</p>
          </div>
        </div>
        <div class="charts">
          <div class="chart-container">
            <h3>Distribusi Makanan per Sekolah</h3>
            <pie-chart :data="pieData" :options="chartOptions" />
          </div>
          <div class="chart-container">
            <h3>Jumlah Sekolah Terlibat</h3>
            <bar-chart :data="barData" :options="chartOptions" />
          </div>
        </div>
      </section>
  
      <section id="kontak" class="contact-section">
        <h2>Kontak Kami</h2>
        <p>Jika Anda memiliki pertanyaan lebih lanjut atau ingin berdiskusi lebih lanjut, hubungi kami melalui formulir di bawah ini:</p>
        <form @submit.prevent="submitForm" class="contact-form">
          <input type="text" placeholder="Nama" v-model="form.name" required />
          <input type="email" placeholder="Email" v-model="form.email" required />
          <textarea placeholder="Pesan" v-model="form.message" required></textarea>
          <button type="submit" class="cta-button">Kirim Pesan</button>
        </form>
      </section>
    </div>
  </template>
  
  <script>
  import { Pie, Bar } from 'vue-chartjs';
  import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement } from 'chart.js';
  
  ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);
  
  export default {
    components: {
      'pie-chart': Pie,
      'bar-chart': Bar
    },
    data() {
      return {
        form: {
          name: '',
          email: '',
          message: ''
        },
        pieData: {
          labels: ['Sekolah A', 'Sekolah B', 'Sekolah C', 'Sekolah D'],
          datasets: [
            {
              label: 'Distribusi Makanan',
              data: [300, 500, 200, 400],
              backgroundColor: ['#00bcd4', '#ff5722', '#4caf50', '#ffeb3b'],
              borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
              borderWidth: 2
            }
          ]
        },
        barData: {
          labels: ['Sekolah A', 'Sekolah B', 'Sekolah C', 'Sekolah D'],
          datasets: [
            {
              label: 'Jumlah Sekolah Terlibat',
              data: [50, 70, 40, 60],
              backgroundColor: '#4caf50',
              borderColor: '#ffffff',
              borderWidth: 1
            }
          ]
        },
        chartOptions: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Statistik Program SIMAG',
            }
          },
          scales: {
            x: {
              ticks: {
                font: {
                  size: 12
                }
              }
            },
            y: {
              ticks: {
                font: {
                  size: 12
                }
              }
            }
          }
        }
      };
    },
    methods: {
      submitForm() {
        console.log("Form Submitted:", this.form);
      }
    }
  };
  </script>
  
  <style scoped>
  body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  h1, h2, h3 {
    color: #2c3e50; /* Dark blue-gray for the headings */
  }

  .hero-section {
    background: linear-gradient(135deg, #3498db, #f39c12); /* Blue to orange gradient */
    color: white;
    padding: 60px 20px;
    text-align: center;
  }

  .hero-content h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    animation: fadeIn 1s ease-out;
  }

  .hero-content p {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
  }

  .cta-button {
    padding: 12px 30px;
    background-color: #e67e22; /* Orange button */
    color: white;
    text-decoration: none;
    font-weight: bold;
    border-radius: 5px;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }

  .cta-button:hover {
    background-color: #f39c12; /* Lighter orange on hover */
    transform: scale(1.1);
  }

  .about-section {
    padding: 50px 20px;
    background-color: #ecf0f1; /* Light gray background */
    text-align: center;
  }

  .about-cards {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    margin-top: 30px;
  }

  .about-card {
    padding: 20px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  .features-section {
    padding: 50px 20px;
  }

  .features-list {
    display: flex;
    gap: 20px;
    justify-content: space-around;
  }

  .feature-item {
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    text-align: center;
    flex: 1;
  }

  .stats-section {
    padding: 50px 20px;
    background-color: #e9f7ef;
  }

  .stats-cards {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
  }

  .stat-card {
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  .contact-section {
    padding: 50px 20px;
    background-color: #f4f4f4;
  }

  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .contact-form input, .contact-form textarea {
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1rem;
  }

  .contact-form button {
    padding: 12px 30px;
    background-color: #00bcd4; /* Blue button */
    color: white;
    border-radius: 5px;
    font-weight: bold;
    transition: background-color 0.3s ease;
  }

  .contact-form button:hover {
    background-color: #0288d1; /* Darker blue on hover */
  }

  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  </style>
  