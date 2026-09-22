# Sistem Monitoring Cuaca Indonesia

Aplikasi pemantauan cuaca real-time dengan integrasi animasi peta Windy, Open-Meteo API, visualisasi Recharts, sistem peringatan dini (early warning), indeks kelayakan aktivitas luar ruangan, dan rekomendasi berbahasa Indonesia sesuai konteks iklim nusantara.

## Fitur Utama

- **Peta Animasi Windy**: Peta interaktif berbasis koordinat dengan kontrol layer dinamis (Angin, Hujan & Radar, Suhu, Awan).
- **Integrasi BMKG (Gempa & Peringatan Dini)**:
  - Deteksi gempa bumi terkini (*autogempa*) BMKG TEWS dengan status "LIVE" real-time yang diperbarui setiap 60 detik.
  - Peringatan gempa banner merah jika M ≥ 5.0 atau card info jika M < 5.0, beserta kedalaman dan potensi tsunami.
  - Banner peringatan dini cuaca BMKG (*early warning*) yang dapat di-dismiss oleh pengguna.
  - Ticker status gempa terakhir tepat di bawah peta cuaca.
- **Gemini AI Weather Tips**:
  - Rekomendasi cuaca cerdas berbasis Google Gemini (`@google/genai`) dengan gaya bahasa santai khas Indonesia.
  - Dilengkapi efek mengetik (*typewriter animation*), tombol penyegaran instan, dan penyimpanan cache 30 menit.
  - Fallback otomatis ke rekomendasi *rule-based* jika API key belum dikonfigurasi.
- **Telemetri Real-time Open-Meteo**: Suhu aktual, suhu terasa (apparent), kelembaban udara, kecepatan/arah angin, curah hujan, tekanan atmosfer, dan indeks UV.
- **Kartu Indeks Kelayakan Aktivitas**: Skor komposit (0-100) untuk Jogging/Olahraga, Berkendara, Pertanian/Kebun, Wisata, dan Petani/Nelayan.
- **Grafik Dinamis 24 Jam (Recharts)**: Fluktuasi suhu dan peluang hujan dengan toggle metrik per jam.
- **Prakiraan 7 Hari**: Tren cuaca mingguan dengan kartu hari ini tersorot.
- **Pencarian Kota & Geolokasi**: Autocomplete pencarian kota di Indonesia dan tombol "📍 Lokasi Saya".

## Panduan Instalasi & Menjalankan

1. Clone repositori ini
2. Jalankan perintah instalasi dependensi:
   ```bash
   npm install
   ```
3. Buat file `.env.local` pada direktori utama:
   ```env
   NEXT_PUBLIC_WINDY_API_KEY=your_windy_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   - *Ganti `your_windy_key_here` dengan API key resmi dari api.windy.com (opsional; bila kosong atau dibatasi domain, peta otomatis berjalan dalam mode interaktif embed).*
   - *Ganti `your_gemini_api_key_here` dengan API key Google Gemini AI (sisi server, tanpa `NEXT_PUBLIC_`). Bila belum diisi, saran cuaca otomatis menggunakan rule-based tips bawaan.*
4. Jalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```
5. Buka peramban pada alamat:
   ```
   http://localhost:3000
   ```
