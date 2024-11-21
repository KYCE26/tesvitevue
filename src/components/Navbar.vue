<template>
    <nav class="navbar">
      <div class="navbar-container">
        <a href="/" class="logo">SIMAG</a>
        <ul class="navbar-links">
          <li><a href="#tentang">Tentang</a></li>
          <li><a href="#fitur">Fitur</a></li>
          <li><a href="#statistik">Statistik</a></li>
          <li><a href="#kontak">Kontak</a></li>
        </ul>
        <div class="hamburger" @click="toggleMenu">
          <div class="bar"></div>
          <div class="bar"></div>
          <div class="bar"></div>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    name: "Navbar",
    data() {
      return {
        isMenuOpen: false,
      };
    },
    methods: {
      toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
      }
    }
  };
  </script>
  
  <style scoped>
  /* Navbar styles */
  .navbar {
    background-color: #008c4d;
    padding: 10px 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .navbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    max-width: 1280px;
    margin: 0 auto;
  }
  
  .logo {
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    text-decoration: none;
  }
  
  .navbar-links {
    display: flex;
    list-style-type: none;
  }
  
  .navbar-links li {
    margin-left: 20px;
  }
  
  .navbar-links a {
    color: white;
    text-decoration: none;
    font-size: 1rem;
    padding: 8px 16px;
    transition: background-color 0.3s ease;
  }
  
  .navbar-links a:hover {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 5px;
  }
  
  .hamburger {
    display: none;
    flex-direction: column;
    cursor: pointer;
  }
  
  .bar {
    width: 25px;
    height: 4px;
    background-color: white;
    margin: 4px 0;
  }
  
  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    .navbar-links {
      position: absolute;
      top: 60px;
      right: 0;
      background-color: #008c4d;
      width: 100%;
      height: 100vh;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      transform: translateX(100%);
      transition: transform 0.3s ease-in-out;
    }
  
    .navbar-links.open {
      transform: translateX(0);
    }
  
    .navbar-links li {
      margin: 20px 0;
    }
  
    .hamburger {
      display: flex;
    }
  }
  </style>
  