const suppliers = [
  {
    id: 1,
    name: "PT. Makan Sehat Indonesia",
    address: "Jl. Sejahtera No. 45, Bandung, Jawa Barat",
    contact: "+62 812-3456-7890",
    certifications: ["ISO 9001:2015", "Sertifikasi Penyedia Layanan Makanan Sehat"],
    verified: true, // Add verification status
    picture: null // Default no picture
  },
  {
    id: 2,
    name: "CV. Kuliner Nusantara",
    address: "Jl. Raya No. 20, Jakarta, DKI Jakarta",
    contact: "+62 813-9876-5432",
    certifications: ["ISO 22000:2018", "Sertifikasi Katering Sehat"],
    verified: false, // Add verification status
    picture: null // Default no picture
  },
  {
    id: 3,
    name: "UD. Makanan Lezat",
    address: "Jl. Makanan Lezat No. 12, Surabaya, Jawa Timur",
    contact: "+62 812-1111-2345",
    certifications: ["Halal MUI", "Sertifikasi Pengolahan Makanan"],
    verified: true, // Add verification status
    picture: null // Default no picture
  }
];

export default suppliers;
