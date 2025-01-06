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
    status: "Habis",
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
      "Beras",
      "Ayam",
      "Sayur Mayur"
    ],
    category: "Makanan Pokok",
    status: "Tersedia",
    date: "2024-12-27"
  },
  {
    id: 2,
    product: "Mie Goreng",
    ingredients: [
      "Tepung Terigu",
      "Ayam",
      "Sayur Mayur"
    ],
    category: "Lauk",
    status: "Tersedia",
    date: "2024-12-26"
  },
  {
    id: 3,
    product: "Soto Ayam",
    ingredients: [
      "Ayam",
      "Bumbu Soto",
      "Sayur Mayur"
    ],
    category: "Makanan Pokok",
    status: "Tersedia",
    date: "2024-12-25"
  }
];

export { rawMaterials, finishedProducts };
