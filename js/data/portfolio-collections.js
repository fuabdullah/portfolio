/**
 * Data sementara untuk galeri berdasarkan kategori Portfolio.
 *
 * Seluruh judul, caption, dan alt text masih berupa simulasi.
 * Data dapat diganti setelah foto dan informasi asli dari Fuad tersedia.
 */

const COLLECTION_BASE_PATH = "assets/images/portfolio/collections";

/**
 * Membentuk path gambar utama dan thumbnail secara konsisten.
 */
function createCollectionImages(categorySlug, imageData) {
  return imageData.map((image, index) => {
    const number = String(index + 1).padStart(2, "0");
    const filename = `${categorySlug}_${number}.webp`;

    return {
      id: `${categorySlug}-${number}`,
      src: `${COLLECTION_BASE_PATH}/${categorySlug}/${filename}`,
      thumbnail: `${COLLECTION_BASE_PATH}/${categorySlug}/${filename}`,
      title: image.title,
      caption: image.caption,
      alt: image.alt,
    };
  });
}

/**
 * Data enam kategori Portfolio.
 */
export const portfolioCollections = {
  adventure: {
    slug: "adventure",
    name: "Adventure",
    description: "Perjalanan, pendakian, dan cerita dari alam terbuka.",
    images: createCollectionImages("adventure", [
      {
        alt: "Sekelompok pendaki berjalan menyusuri jalur pegunungan.",
      },
      {
        alt: "Pendaki berjalan di kawasan pegunungan yang tertutup kabut.",
      },
      {
        alt: "Pendaki menyusuri punggungan gunung di alam terbuka.",
      },
      {
        alt: "Pendaki beristirahat di tengah jalur perjalanan gunung.",
      },
      {
        alt: "Pemandangan pegunungan dengan cahaya sore di ketinggian.",
      },
      {
        alt: "Pendaki berjalan pulang setelah menyelesaikan perjalanan.",
      },
    ]),
  },

  community: {
    slug: "community",
    name: "Community",
    description: "Kebersamaan, interaksi, dan momen yang tumbuh bersama.",
    images: createCollectionImages("community", [
      {
        alt: "Sekelompok anggota komunitas berkumpul dalam kegiatan bersama.",
      },
      {
        alt: "Anggota komunitas berjalan bersama dalam kegiatan outdoor.",
      },
      {
        alt: "Pertemuan komunitas yang berlangsung di ruang terbuka.",
      },
      {
        alt: "Anggota komunitas tertawa bersama selama kegiatan berlangsung.",
      },
      {
        alt: "Komunitas melakukan aktivitas kelompok secara bersama-sama.",
      },
      {
        alt: "Foto kebersamaan anggota komunitas pada akhir kegiatan.",
      },
    ]),
  },

  travel: {
    slug: "travel",
    name: "Travel",
    description:
      "Tempat, perjalanan, dan cerita yang ditemui di sepanjang jalan.",
    images: createCollectionImages("travel", [
      {
        alt: "Suasana perjalanan di sebuah kota yang menjadi tempat singgah.",
      },
      {
        alt: "Jalan baru yang dilewati dalam sebuah perjalanan.",
      },
      {
        alt: "Suasana pagi saat melakukan perjalanan di tempat baru.",
      },
      {
        alt: "Detail suasana dan objek yang ditemukan selama perjalanan.",
      },
      {
        alt: "Seorang pelancong beristirahat di tengah perjalanan.",
      },
      {
        alt: "Pemandangan terakhir sebelum perjalanan pulang.",
      },
    ]),
  },

  portrait: {
    slug: "portrait",
    name: "Portrait",
    description: "Wajah, karakter, dan ekspresi dalam suasana yang natural.",
    images: createCollectionImages("portrait", [
      {
        alt: "Portrait seseorang menggunakan pencahayaan alami.",
      },
      {
        alt: "Portrait seseorang dengan tatapan yang tenang.",
      },
      {
        alt: "Portrait seseorang dengan latar suasana alam terbuka.",
      },
      {
        alt: "Portrait candid dengan ekspresi natural.",
      },
      {
        alt: "Portrait outdoor dalam cahaya sore yang hangat.",
      },
      {
        alt: "Portrait dekat yang menampilkan karakter wajah seseorang.",
      },
    ]),
  },

  event: {
    slug: "event",
    name: "Event",
    description: "Energi, suasana, dan momen penting dalam sebuah acara.",
    images: createCollectionImages("event", [
      {
        alt: "Peserta berkumpul pada awal sebuah acara outdoor.",
      },
      {
        alt: "Suasana pembukaan sebuah kegiatan atau acara.",
      },
      {
        alt: "Peserta melakukan aktivitas di tengah berlangsungnya acara.",
      },
      {
        alt: "Momen utama yang terjadi dalam sebuah event.",
      },
      {
        alt: "Ekspresi peserta yang bersemangat selama acara.",
      },
      {
        alt: "Momen penutupan dan kebersamaan pada akhir acara.",
      },
    ]),
  },

  "brand-product": {
    slug: "brand-product",
    name: "Brand / Product",
    description: "Produk dan identitas brand dalam nuansa outdoor yang kuat.",
    images: createCollectionImages("brand-product", [
      {
        alt: "Produk outdoor yang digunakan sebagai perlengkapan perjalanan.",
      },
      {
        alt: "Produk digunakan dalam sebuah aktivitas perjalanan outdoor.",
      },
      {
        alt: "Foto detail sebuah produk dengan nuansa outdoor.",
      },
      {
        alt: "Produk brand digunakan oleh seseorang di alam terbuka.",
      },
      {
        alt: "Foto lifestyle yang menceritakan penggunaan sebuah produk.",
      },
      {
        alt: "Produk outdoor dipersiapkan untuk menemani sebuah perjalanan.",
      },
    ]),
  },
};

/**
 * Mengambil data collection berdasarkan slug kategori.
 *
 * @param {string} categorySlug
 * @returns {object|null}
 */
export function getPortfolioCollection(categorySlug) {
  return portfolioCollections[categorySlug] ?? null;
}
