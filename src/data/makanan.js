const rawMaterials = [
  {
    id: 1,
    supplier: "PT. Makan Sehat Indonesia",
    material: "Beras",
    amount: "100 kg",
    source: "Bandung",
    category: "Makanan Pokok",
    status: "Tersedia",
    date: "2024-12-27"
  },
  {
    id: 2,
    supplier: "CV. Kuliner Nusantara",
    material: "Sayur Mayur",
    amount: "50 kg",
    source: "Bandung Barat",
    category: "Sayuran",
    status: "Tersedia",
    date: "2024-12-26"
  },
  {
    id: 3,
    supplier: "UD. Makanan Lezat",
    material: "Ayam",
    amount: "200 kg",
    source: "Sukasari",
    category: "Lauk",
    status: "Tersedia",
    date: "2024-12-25"
  }
];

const finishedProducts = [
  {
    id: 1,
    product: "Nasi Goreng",
    ingredients: [
      { material: "Beras", amount: "50 kg" },
      { material: "Ayam", amount: "30 kg" },
      { material: "Sayur Mayur", amount: "20 kg" }
    ],
    category: "Makanan Pokok",
    status: "Tersedia",
    stock: 50, // Stok produk
    date: "2024-12-27"
  },
  {
    id: 2,
    product: "Mie Goreng",
    ingredients: [
      { material: "Tepung Terigu", amount: "20 kg" },
      { material: "Ayam", amount: "15 kg" },
      { material: "Sayur Mayur", amount: "10 kg" }
    ],
    category: "Lauk",
    status: "Tersedia",
    stock: 30, // Stok produk
    date: "2024-12-26"
  },
  {
    id: 3,
    product: "Soto Ayam",
    ingredients: [
      { material: "Ayam", amount: "40 kg" },
      { material: "Bumbu Soto", amount: "10 kg" },
      { material: "Sayur Mayur", amount: "15 kg" }
    ],
    category: "Makanan Pokok",
    status: "Tersedia",
    stock: 40, // Stok produk
    date: "2024-12-25"
  }
];

export { rawMaterials, finishedProducts };
