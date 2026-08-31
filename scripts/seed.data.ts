export type SeedUser = {
  name: string;
  email: string;
  username: string;
  displayUsername?: string;
  password: string;
};

export type SeedQuiz = {
  key: string;
  ownerEmail: string;
  title: string;
  description: string;
  category: "technology" | "entertainment" | "general";
  visibility: "public" | "private";
  secretCode?: string;
  reviewStatus?: "not_requested" | "pending" | "approved" | "rejected";
  questions: Array<{
    content: string;
    options: Array<{ content: string; isCorrect: boolean }>;
  }>;
};

// Development-only profiles. seed.ts sends each password through Better Auth,
// which hashes it with src/lib/auth-password.ts before persistence.
export const seedUsers: SeedUser[] = [
  {
    name: "Naya Prameswari",
    email: "naya.prameswari@example.com",
    username: "naya_prameswari",
    displayUsername: "Naya Prameswari",
    password: "KuiskaSeed-Naya-2026",
  },
  {
    name: "Bima Adyatma",
    email: "bima.adyatma@example.com",
    username: "bima_adyatma",
    displayUsername: "Bima Adyatma",
    password: "KuiskaSeed-Bima-2026",
  },
  {
    name: "Sari Mahendra",
    email: "sari.mahendra@example.com",
    username: "sari_mahendra",
    displayUsername: "Sari Mahendra",
    password: "KuiskaSeed-Sari-2026",
  },
  {
    name: "Raka Wibisono",
    email: "raka.wibisono@example.com",
    username: "raka_wibisono",
    displayUsername: "Raka Wibisono",
    password: "KuiskaSeed-Raka-2026",
  },
  {
    name: "Tari Anindita",
    email: "tari.anindita@example.com",
    username: "tari_anindita",
    displayUsername: "Tari Anindita",
    password: "KuiskaSeed-Tari-2026",
  },
  {
    name: "Juno Pratama",
    email: "juno.pratama@example.com",
    username: "juno_pratama",
    displayUsername: "Juno Pratama",
    password: "KuiskaSeed-Juno-2026",
  },
  {
    name: "Mika Larasati",
    email: "mika.larasati@example.com",
    username: "mika_larasati",
    displayUsername: "Mika Larasati",
    password: "KuiskaSeed-Mika-2026",
  },
];

// Public seed quizzes. Every quiz is reviewed, has one correct answer per
// question, and uses a stable key so rerunning the seed remains idempotent.
export const seedQuizzes: SeedQuiz[] = [
  {
    key: "web-foundations",
    ownerEmail: "naya.prameswari@example.com",
    title: "Dari URL ke Halaman: Fondasi Web",
    description:
      "Tingkat mudah · 5 soal tentang alur dasar browser, HTML, CSS, HTTP, dan DNS. Pemanasan singkat untuk memahami apa yang terjadi sebelum sebuah halaman tampil.",
    category: "technology",
    visibility: "public",
    reviewStatus: "approved",
    questions: [
      {
        content: "Teknologi mana yang memberi struktur semantik pada isi halaman web?",
        options: [
          { content: "HTML", isCorrect: true },
          { content: "CSS", isCorrect: false },
          { content: "JavaScript", isCorrect: false },
          { content: "SQL", isCorrect: false },
        ],
      },
      {
        content:
          "Saat browser menerjemahkan kuiska.com menjadi alamat IP, layanan apa yang bekerja?",
        options: [
          { content: "DNS", isCorrect: true },
          { content: "CDN", isCorrect: false },
          { content: "SMTP", isCorrect: false },
          { content: "SSH", isCorrect: false },
        ],
      },
      {
        content: "Kode status HTTP mana yang berarti resource tidak ditemukan?",
        options: [
          { content: "200", isCorrect: false },
          { content: "301", isCorrect: false },
          { content: "404", isCorrect: true },
          { content: "500", isCorrect: false },
        ],
      },
      {
        content: "Properti CSS mana yang mengubah warna teks?",
        options: [
          { content: "font-style", isCorrect: false },
          { content: "color", isCorrect: true },
          { content: "background-image", isCorrect: false },
          { content: "text-align", isCorrect: false },
        ],
      },
      {
        content: "Keuntungan utama HTTPS dibanding HTTP adalah...",
        options: [
          { content: "Browser tidak lagi membutuhkan server", isCorrect: false },
          {
            content: "Lalu lintas dapat dienkripsi dan identitas server dapat diverifikasi",
            isCorrect: true,
          },
          { content: "Semua halaman otomatis menjadi lebih ringan", isCorrect: false },
          { content: "Database tidak perlu melakukan validasi", isCorrect: false },
        ],
      },
    ],
  },
  {
    key: "mcu-story-starters",
    ownerEmail: "bima.adyatma@example.com",
    title: "MCU: Titik Masuk untuk Penonton Teliti",
    description:
      "Tingkat mudah–menengah · 7 soal tentang tokoh, tempat, dan artefak penting dalam MCU. Fokus pada cerita utama, bukan trivia produksi.",
    category: "entertainment",
    visibility: "public",
    reviewStatus: "approved",
    questions: [
      {
        content: "Dalam MCU, siapa yang menggunakan identitas Iron Man?",
        options: [
          { content: "Steve Rogers", isCorrect: false },
          { content: "Tony Stark", isCorrect: true },
          { content: "Bruce Banner", isCorrect: false },
          { content: "Scott Lang", isCorrect: false },
        ],
      },
      {
        content: "Wakanda dikenal sebagai negara asal pahlawan MCU yang mana?",
        options: [
          { content: "Black Panther", isCorrect: true },
          { content: "Doctor Strange", isCorrect: false },
          { content: "Ant-Man", isCorrect: false },
          { content: "Hawkeye", isCorrect: false },
        ],
      },
      {
        content: "Peter Quill lebih dikenal dengan nama...",
        options: [
          { content: "Star-Lord", isCorrect: true },
          { content: "Nova", isCorrect: false },
          { content: "War Machine", isCorrect: false },
          { content: "Drax the Destroyer", isCorrect: false },
        ],
      },
      {
        content: "Infinity Stone yang tertanam di dahi Vision adalah...",
        options: [
          { content: "Space Stone", isCorrect: false },
          { content: "Time Stone", isCorrect: false },
          { content: "Mind Stone", isCorrect: true },
          { content: "Reality Stone", isCorrect: false },
        ],
      },
      {
        content: "Material utama yang membuat perisai Captain America sangat kuat adalah...",
        options: [
          { content: "Adamantium", isCorrect: false },
          { content: "Vibranium", isCorrect: true },
          { content: "Uru", isCorrect: false },
          { content: "Carbonadium", isCorrect: false },
        ],
      },
      {
        content: "Nama palu milik Thor adalah...",
        options: [
          { content: "Stormbreaker", isCorrect: false },
          { content: "Gungnir", isCorrect: false },
          { content: "Mjolnir", isCorrect: true },
          { content: "Eitri", isCorrect: false },
        ],
      },
      {
        content: "Dalam Infinity War, tujuan utama Thanos adalah...",
        options: [
          { content: "Menguasai semua kerajaan di Bumi", isCorrect: false },
          { content: "Menghapus setengah kehidupan di semesta", isCorrect: true },
          { content: "Membangkitkan semua Celestial", isCorrect: false },
          { content: "Menghancurkan semua Infinity Stone", isCorrect: false },
        ],
      },
    ],
  },
  {
    key: "fakta-dan-penalaran",
    ownerEmail: "sari.mahendra@example.com",
    title: "Fakta dan Penalaran: Jangan Tertipu oleh Intuisi",
    description:
      "Tingkat menengah · 7 soal lintas sains, geografi, dan literasi data. Setiap jawaban dipilih dari konsep yang bisa diuji, bukan sekadar tebakan.",
    category: "general",
    visibility: "public",
    reviewStatus: "approved",
    questions: [
      {
        content: "Mengapa air mendidih pada suhu yang lebih rendah di dataran tinggi?",
        options: [
          { content: "Udara di sana selalu lebih panas", isCorrect: false },
          { content: "Tekanan udara lebih rendah", isCorrect: true },
          { content: "Air di sana memiliki lebih banyak garam", isCorrect: false },
          { content: "Gravitasi berhenti bekerja", isCorrect: false },
        ],
      },
      {
        content: "Garis lintang 0 derajat disebut...",
        options: [
          { content: "Garis Balik Utara", isCorrect: false },
          { content: "Meridian Greenwich", isCorrect: false },
          { content: "Garis khatulistiwa", isCorrect: true },
          { content: "Garis Tanggal Internasional", isCorrect: false },
        ],
      },
      {
        content:
          "Mengapa median sering lebih tahan terhadap satu nilai ekstrem dibanding rata-rata?",
        options: [
          { content: "Median tidak memerlukan data", isCorrect: false },
          {
            content: "Median ditentukan oleh posisi tengah setelah data diurutkan",
            isCorrect: true,
          },
          { content: "Median selalu lebih besar dari rata-rata", isCorrect: false },
          { content: "Median hanya berlaku untuk bilangan bulat", isCorrect: false },
        ],
      },
      {
        content: "Pernyataan yang paling tepat tentang korelasi adalah...",
        options: [
          { content: "Korelasi selalu membuktikan sebab-akibat", isCorrect: false },
          { content: "Korelasi hanya bisa muncul pada eksperimen", isCorrect: false },
          {
            content: "Korelasi menunjukkan keterkaitan, tetapi belum membuktikan sebab-akibat",
            isCorrect: true,
          },
          { content: "Korelasi berarti dua variabel pasti memiliki nilai sama", isCorrect: false },
        ],
      },
      {
        content: "Pada peta berskala 1:100.000, jarak 1 cm di peta mewakili...",
        options: [
          { content: "100 meter", isCorrect: false },
          { content: "500 meter", isCorrect: false },
          { content: "1 kilometer", isCorrect: true },
          { content: "100 kilometer", isCorrect: false },
        ],
      },
      {
        content: "Penyebab utama pergantian musim di Bumi adalah...",
        options: [
          { content: "Jarak Bumi ke Matahari berubah drastis setiap bulan", isCorrect: false },
          { content: "Kemiringan sumbu Bumi saat mengelilingi Matahari", isCorrect: true },
          { content: "Bulan menutupi Matahari secara berkala", isCorrect: false },
          { content: "Kecepatan rotasi Bumi berhenti sementara", isCorrect: false },
        ],
      },
      {
        content:
          "Dalam fotosintesis, sumber karbon yang digunakan tumbuhan untuk membentuk glukosa adalah...",
        options: [
          { content: "Oksigen dari udara", isCorrect: false },
          { content: "Karbon dioksida dari udara", isCorrect: true },
          { content: "Nitrogen dari tanah", isCorrect: false },
          { content: "Cahaya Matahari", isCorrect: false },
        ],
      },
    ],
  },
  {
    key: "data-api-keamanan",
    ownerEmail: "raka.wibisono@example.com",
    title: "Data, API, dan Keamanan: Cara Sistem Saling Bicara",
    description:
      "Tingkat menengah · 8 soal untuk menguji pemahaman praktis tentang API, database, autentikasi, dan keamanan aplikasi web.",
    category: "technology",
    visibility: "public",
    reviewStatus: "approved",
    questions: [
      {
        content:
          "Method HTTP yang lazim digunakan untuk mengambil resource tanpa perubahan yang disengaja adalah...",
        options: [
          { content: "GET", isCorrect: true },
          { content: "POST", isCorrect: false },
          { content: "PATCH", isCorrect: false },
          { content: "DELETE", isCorrect: false },
        ],
      },
      {
        content: "JSON paling tepat digambarkan sebagai...",
        options: [
          { content: "Bahasa pemrograman untuk browser", isCorrect: false },
          { content: "Format pertukaran data terstruktur", isCorrect: true },
          { content: "Mesin database relasional", isCorrect: false },
          { content: "Protokol untuk mengenkripsi password", isCorrect: false },
        ],
      },
      {
        content:
          "Cara yang tepat untuk mengurangi risiko SQL injection saat menerima input pengguna adalah...",
        options: [
          { content: "Menggabungkan input langsung ke string query", isCorrect: false },
          {
            content: "Menggunakan query terparameterisasi atau prepared statement",
            isCorrect: true,
          },
          { content: "Menyembunyikan nama tabel dari HTML", isCorrect: false },
          { content: "Mengubah semua input menjadi huruf kapital", isCorrect: false },
        ],
      },
      {
        content: "Password pengguna sebaiknya disimpan dengan...",
        options: [
          { content: "Teks biasa agar mudah dipulihkan", isCorrect: false },
          { content: "Enkripsi simetris dengan satu kunci bersama", isCorrect: false },
          { content: "Hash adaptif satu arah seperti Argon2id", isCorrect: true },
          { content: "Base64 agar karakter khusus aman", isCorrect: false },
        ],
      },
      {
        content: "Status HTTP 401 biasanya berarti...",
        options: [
          { content: "Server mengalami error internal", isCorrect: false },
          { content: "Resource berhasil dibuat", isCorrect: false },
          { content: "Autentikasi belum ada atau tidak valid", isCorrect: true },
          { content: "Pengguna sudah terautentikasi tetapi dilarang oleh izin", isCorrect: false },
        ],
      },
      {
        content: "Apa trade-off umum saat menambahkan index pada kolom database?",
        options: [
          {
            content: "Pembacaan tertentu lebih cepat, tetapi penulisan dan storage bertambah",
            isCorrect: true,
          },
          { content: "Semua query otomatis menjadi konstan waktunya", isCorrect: false },
          { content: "Database tidak lagi memerlukan constraint", isCorrect: false },
          { content: "Index menghapus kebutuhan backup", isCorrect: false },
        ],
      },
      {
        content: "CORS pada browser terutama mengatur...",
        options: [
          { content: "Apakah JavaScript boleh membaca respons lintas origin", isCorrect: true },
          { content: "Seberapa cepat server memproses SQL", isCorrect: false },
          { content: "Cara password di-hash di database", isCorrect: false },
          { content: "Ukuran maksimum file di sistem operasi", isCorrect: false },
        ],
      },
      {
        content: "Mengapa PUT biasanya disebut idempotent?",
        options: [
          { content: "PUT selalu menghapus resource", isCorrect: false },
          {
            content: "Pengulangan request yang sama menghasilkan keadaan akhir yang sama",
            isCorrect: true,
          },
          { content: "PUT hanya dapat dipanggil sekali", isCorrect: false },
          { content: "PUT tidak pernah mengirim body", isCorrect: false },
        ],
      },
    ],
  },
  {
    key: "the-odyssey",
    ownerEmail: "tari.anindita@example.com",
    title: "The Odyssey: Perjalanan Pulang yang Menjadi Cetak Biru Cerita",
    description:
      "Tingkat menengah–sulit · 8 soal tentang epik Homer, tokoh, motif, dan rintangan dalam perjalanan Odysseus. Rujukan utamanya adalah teks epik dan tradisi cerita yang melahirkan banyak adaptasi layar.",
    category: "entertainment",
    visibility: "public",
    reviewStatus: "approved",
    questions: [
      {
        content: "Kepada siapa The Odyssey secara tradisional dikaitkan?",
        options: [
          { content: "Homer", isCorrect: true },
          { content: "Sophocles", isCorrect: false },
          { content: "Virgil", isCorrect: false },
          { content: "Ovid", isCorrect: false },
        ],
      },
      {
        content: "Siapa tokoh utama yang berusaha pulang dalam The Odyssey?",
        options: [
          { content: "Achilles", isCorrect: false },
          { content: "Odysseus", isCorrect: true },
          { content: "Perseus", isCorrect: false },
          { content: "Theseus", isCorrect: false },
        ],
      },
      {
        content: "Odysseus berusaha kembali ke pulau asalnya yang bernama...",
        options: [
          { content: "Crete", isCorrect: false },
          { content: "Ithaca", isCorrect: true },
          { content: "Delos", isCorrect: false },
          { content: "Cyprus", isCorrect: false },
        ],
      },
      {
        content: "Penelope adalah siapa dalam kisah tersebut?",
        options: [
          { content: "Ibu Odysseus", isCorrect: false },
          { content: "Istri Odysseus", isCorrect: true },
          { content: "Ratu para Siren", isCorrect: false },
          { content: "Putri Polyphemus", isCorrect: false },
        ],
      },
      {
        content: "Telemachus adalah...",
        options: [
          { content: "Putra Odysseus dan Penelope", isCorrect: true },
          { content: "Saudara Polyphemus", isCorrect: false },
          { content: "Dewa laut", isCorrect: false },
          { content: "Kapten kapal Odysseus", isCorrect: false },
        ],
      },
      {
        content: "Nama Cyclops yang ditemui Odysseus adalah...",
        options: [
          { content: "Polyphemus", isCorrect: true },
          { content: "Charybdis", isCorrect: false },
          { content: "Tiresias", isCorrect: false },
          { content: "Aeolus", isCorrect: false },
        ],
      },
      {
        content: "Apa bahaya utama dari memakan bunga para Lotus-Eaters?",
        options: [
          { content: "Tubuh berubah menjadi batu", isCorrect: false },
          {
            content: "Ingatan tentang rumah dan keinginan untuk pulang memudar",
            isCorrect: true,
          },
          { content: "Kapal langsung terbakar", isCorrect: false },
          { content: "Seseorang berubah menjadi Cyclops", isCorrect: false },
        ],
      },
      {
        content: "Mengapa Odysseus meminta dirinya diikat ke tiang kapal saat melewati para Siren?",
        options: [
          {
            content: "Agar dapat mendengar nyanyian mereka tanpa mengikuti panggilannya",
            isCorrect: true,
          },
          { content: "Agar kapal dapat bergerak tanpa awak", isCorrect: false },
          { content: "Agar Poseidon tidak melihatnya", isCorrect: false },
          { content: "Agar ia bisa tidur selama perjalanan", isCorrect: false },
        ],
      },
    ],
  },
  {
    key: "sistem-modern",
    ownerEmail: "juno.pratama@example.com",
    title: "Sistem Modern Tanpa Sihir: Cache, Queue, dan Konsistensi",
    description:
      "Tingkat sulit · 10 soal tentang trade-off di balik aplikasi modern: caching, transaksi, konsistensi data, observability, dan pengendalian beban.",
    category: "technology",
    visibility: "public",
    reviewStatus: "approved",
    questions: [
      {
        content:
          "Endpoint pembayaran menerima retry setelah timeout. Mekanisme yang membantu mencegah tagihan ganda adalah...",
        options: [
          {
            content: "Idempotency key yang dipakai ulang untuk operasi yang sama",
            isCorrect: true,
          },
          { content: "Menghapus semua log request", isCorrect: false },
          { content: "Menonaktifkan validasi input", isCorrect: false },
          { content: "Mengubah POST menjadi file statis", isCorrect: false },
        ],
      },
      {
        content:
          "Dalam ACID, properti yang menjamin transaksi berjalan sebagai satu kesatuan utuh atau dibatalkan seluruhnya adalah...",
        options: [
          { content: "Atomicity", isCorrect: true },
          { content: "Consistency", isCorrect: false },
          { content: "Isolation", isCorrect: false },
          { content: "Durability", isCorrect: false },
        ],
      },
      {
        content: "Eventual consistency berarti...",
        options: [
          {
            content: "Semua replika selalu menampilkan data baru pada milidetik yang sama",
            isCorrect: false,
          },
          {
            content: "Replika akan menuju keadaan yang sama jika tidak ada pembaruan baru",
            isCorrect: true,
          },
          { content: "Database tidak pernah menerima lebih dari satu penulis", isCorrect: false },
          { content: "Data yang sudah dibaca tidak boleh berubah", isCorrect: false },
        ],
      },
      {
        content: "Apa manfaat utama menempatkan message queue di antara API dan worker?",
        options: [
          {
            content: "Memisahkan producer dan consumer serta membantu menyerap lonjakan pekerjaan",
            isCorrect: true,
          },
          { content: "Menghapus kebutuhan untuk menangani kegagalan", isCorrect: false },
          { content: "Menjamin semua pekerjaan selesai tanpa retry", isCorrect: false },
          { content: "Mengubah database relasional menjadi cache", isCorrect: false },
        ],
      },
      {
        content:
          "Risiko inti dari cache yang tidak memiliki strategi invalidasi yang tepat adalah...",
        options: [
          { content: "Pengguna dapat melihat data yang sudah kedaluwarsa", isCorrect: true },
          { content: "CPU server selalu berhenti bekerja", isCorrect: false },
          { content: "Semua request pasti berubah menjadi POST", isCorrect: false },
          { content: "Password otomatis menjadi teks biasa", isCorrect: false },
        ],
      },
      {
        content:
          "Mengapa cursor pagination sering lebih stabil daripada offset pagination pada dataset yang terus berubah?",
        options: [
          {
            content:
              "Cursor dapat melanjutkan dari posisi data, sehingga insert baru tidak mudah menggeser halaman sebelumnya",
            isCorrect: true,
          },
          { content: "Cursor menghapus semua data yang sudah dilihat", isCorrect: false },
          { content: "Offset tidak pernah dapat digunakan pada database", isCorrect: false },
          { content: "Cursor menjamin query tidak membutuhkan index", isCorrect: false },
        ],
      },
      {
        content: "Dalam sistem terdistribusi, distributed trace paling berguna untuk...",
        options: [
          { content: "Mengikuti satu request saat melewati beberapa service", isCorrect: true },
          { content: "Menggantikan semua unit test", isCorrect: false },
          { content: "Menyimpan password pengguna", isCorrect: false },
          { content: "Menentukan warna antarmuka", isCorrect: false },
        ],
      },
      {
        content:
          "Untuk mengirim pesan rahasia kepada penerima dengan kriptografi kunci publik, pengirim biasanya mengenkripsi dengan...",
        options: [
          { content: "Private key milik pengirim", isCorrect: false },
          { content: "Public key milik penerima", isCorrect: true },
          { content: "Public key milik pengirim", isCorrect: false },
          { content: "Kunci yang ditempel di URL", isCorrect: false },
        ],
      },
      {
        content: "Tujuan utama rate limiting pada API adalah...",
        options: [
          {
            content: "Membatasi frekuensi request agar layanan lebih terlindungi dan adil",
            isCorrect: true,
          },
          { content: "Membuat setiap response berukuran sama", isCorrect: false },
          { content: "Menghapus kebutuhan autentikasi", isCorrect: false },
          { content: "Memastikan semua user mendapat password yang sama", isCorrect: false },
        ],
      },
      {
        content: "Trade-off umum index database adalah...",
        options: [
          {
            content: "Lookup tertentu lebih cepat, tetapi storage dan biaya write bertambah",
            isCorrect: true,
          },
          { content: "Semua kolom otomatis menjadi unik", isCorrect: false },
          { content: "Transaksi tidak lagi diperlukan", isCorrect: false },
          { content: "Index membuat backup menjadi tidak berguna", isCorrect: false },
        ],
      },
    ],
  },
  {
    key: "bahasa-film",
    ownerEmail: "mika.larasati@example.com",
    title: "Bahasa Film: Membaca Adegan, Bukan Sekadar Plot",
    description:
      "Tingkat sulit · 10 soal tentang sinematografi, editing, suara, mise-en-scene, dan struktur naratif. Cocok untuk penonton yang ingin membaca bagaimana film membangun makna.",
    category: "entertainment",
    visibility: "public",
    reviewStatus: "approved",
    questions: [
      {
        content: "Fungsi yang paling umum dari close-up adalah...",
        options: [
          { content: "Menekankan ekspresi atau detail penting", isCorrect: true },
          { content: "Menunjukkan seluruh peta kota", isCorrect: false },
          { content: "Menghilangkan semua suara dalam adegan", isCorrect: false },
          { content: "Menentukan durasi film secara otomatis", isCorrect: false },
        ],
      },
      {
        content: "Establishing shot terutama membantu penonton memahami...",
        options: [
          { content: "Lokasi dan ruang tempat adegan berlangsung", isCorrect: true },
          { content: "Nama asli semua aktor", isCorrect: false },
          { content: "Urutan kredit akhir", isCorrect: false },
          { content: "Format file film", isCorrect: false },
        ],
      },
      {
        content: "Suara diegetik adalah suara yang...",
        options: [
          {
            content: "Berasal dari dunia cerita dan secara prinsip dapat didengar karakter",
            isCorrect: true,
          },
          { content: "Selalu ditambahkan setelah film selesai", isCorrect: false },
          { content: "Hanya berupa musik pembuka", isCorrect: false },
          { content: "Tidak pernah memiliki sumber di dalam cerita", isCorrect: false },
        ],
      },
      {
        content: "Match cut menghubungkan dua shot melalui...",
        options: [
          { content: "Kemiripan visual, bentuk, gerakan, atau gagasan", isCorrect: true },
          { content: "Penghapusan semua dialog", isCorrect: false },
          { content: "Perubahan aktor tanpa alasan naratif", isCorrect: false },
          { content: "Penggunaan satu kamera tanpa editing", isCorrect: false },
        ],
      },
      {
        content:
          "Teknik editing yang menyusun potongan singkat untuk merangkum proses panjang disebut...",
        options: [
          { content: "Montage", isCorrect: true },
          { content: "Blocking", isCorrect: false },
          { content: "Foley", isCorrect: false },
          { content: "Key light", isCorrect: false },
        ],
      },
      {
        content: "Tujuan utama continuity editing adalah menjaga...",
        options: [
          { content: "Kejelasan ruang dan kesinambungan waktu antar-shot", isCorrect: true },
          { content: "Semua shot memiliki warna yang sama persis", isCorrect: false },
          { content: "Dialog selalu direkam tanpa mikrofon", isCorrect: false },
          { content: "Setiap adegan memiliki durasi identik", isCorrect: false },
        ],
      },
      {
        content: "Mise-en-scene merujuk pada...",
        options: [
          {
            content: "Unsur yang ditata di dalam frame, seperti set, kostum, cahaya, dan blocking",
            isCorrect: true,
          },
          { content: "Daftar film yang tayang di bioskop", isCorrect: false },
          { content: "Perhitungan jumlah penonton", isCorrect: false },
          { content: "Teknik menulis subtitle otomatis", isCorrect: false },
        ],
      },
      {
        content: "Color grading biasanya dilakukan untuk...",
        options: [
          {
            content:
              "Membentuk tampilan, nuansa warna, dan konsistensi visual setelah pengambilan gambar",
            isCorrect: true,
          },
          { content: "Mengganti pemeran tanpa syuting ulang", isCorrect: false },
          { content: "Menentukan siapa yang mendapat kredit sutradara", isCorrect: false },
          { content: "Mengubah film menjadi naskah drama", isCorrect: false },
        ],
      },
      {
        content: "Foreshadowing adalah teknik naratif yang...",
        options: [
          {
            content: "Menanam petunjuk awal tentang peristiwa yang mungkin penting nanti",
            isCorrect: true,
          },
          { content: "Menghapus konflik dari cerita", isCorrect: false },
          { content: "Menyusun kredit berdasarkan abjad", isCorrect: false },
          { content: "Merekam semua adegan dari belakang", isCorrect: false },
        ],
      },
      {
        content: "Narator yang tidak dapat sepenuhnya dipercaya membuat penonton perlu...",
        options: [
          {
            content: "Menguji kembali informasi cerita dan membandingkannya dengan petunjuk lain",
            isCorrect: true,
          },
          { content: "Menganggap semua adegan sebagai dokumenter", isCorrect: false },
          { content: "Mengabaikan sudut pandang karakter lain", isCorrect: false },
          { content: "Menghapus semua dialog dari film", isCorrect: false },
        ],
      },
    ],
  },
];
