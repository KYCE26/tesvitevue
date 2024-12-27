const rawMaterials = [
  {
    id: 1,
    supplier: "PT. Makan Sehat Indonesia",
    material: "Beras",
    amount: "100 kg",
    source: "Bandung",
    category: "Makanan Pokok",  // Kategori
    status: "Tersedia"  // Status
  },
  {
    id: 2,
    supplier: "CV. Kuliner Nusantara",
    material: "Sayur Mayur",
    amount: "50 kg",
    source: "Bandung Barat",
    category: "Sayuran",  // Kategori
    status: "Habis"  // Status
  },
  {
    id: 3,
    supplier: "UD. Makanan Lezat",
    material: "Ayam",
    amount: "200 kg",
    source: "Sukasari",
    category: "Lauk",  // Kategori
    status: "Tersedia"  // Status
  }
];

const finishedProducts = [
  {
    id: 1,
    product: "Nasi Goreng",
    ingredients: [
      "Beras",
      "Ayam",
      "Sayur Mayur"
    ],
    category: "Makanan Pokok",  // Kategori
    status: "Tersedia"  // Status
  },
  {
    id: 2,
    product: "Mie Goreng",
    ingredients: [
      "Tepung Terigu",
      "Ayam",
      "Sayur Mayur"
    ],
    category: "Lauk",  // Kategori
    status: "Tersedia"  // Status
  },
  {
    id: 3,
    product: "Soto Ayam",
    ingredients: [
      "Ayam",
      "Bumbu Soto",
      "Sayur Mayur"
    ],
    category: "Makanan Pokok",  // Kategori
    status: "Tersedia"  // Status
  }
];

export { rawMaterials, finishedProducts };
