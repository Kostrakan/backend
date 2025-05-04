# 🏘️ Kostrakan Backend

Backend untuk aplikasi pencarian dan manajemen kos menggunakan Express.js dan MongoDB.

## 🚀 Fitur Utama

- Autentikasi dengan JWT
- Role-based Access Control (`pemilik` & `penyewa`)
- Upload gambar ke Cloudinary
- Manajemen data kos dan kamar
- RESTful API dengan Express

## 🛠️ Teknologi

- Node.js
- Express.js
- MongoDB (Mongoose)
- Cloudinary (untuk upload gambar)
- Multer (handling file upload)
- JSON Web Token (JWT)

---

## 📦 Instalasi

1. **Clone Repository**

```bash
git clone https://github.com/Kostrakan/backend.git
cd backend
````

2. **Install Dependencies**

```bash
npm install
```

3. **Buat File `.env` di Root Project**

Tambahkan konfigurasi berikut ke dalam file `.env`:

```
MONGO_URI=mongodb://localhost:27017/kostrakan
PORT=5000
CLOUD_NAME=dkeenlnhv
API_KEY=888853279188757
API_SECRET=BpMrv-8P-jQOaR3UtAPWwVzv-OI
JWT_SECRET=gkjgkjk
```

> ⚠️ Pastikan MongoDB berjalan secara lokal dan akun Cloudinary kamu aktif.

4. **Jalankan Server**

```bash
npm start
```
jika tidak bisa diatas bisa menggunakan:
```bash
node /src/server.js
```
Server akan berjalan di: [http://localhost:5000](http://localhost:5000)

---

## 🔐 Role & Akses

* `pemilik`: Dapat membuat, mengedit, dan menghapus data kos & kamar
* `penyewa`: Hanya dapat melihat daftar kos dan detail kos

---

## 📁 Struktur Folder

```
.
├── controllers/
├── middlewares/
├── models/
├── routes/
├── services/
├── uploads/
├── server.js
└── .env (tidak diupload ke GitHub)
```

---

## 📮 API Endpoints

Contoh beberapa endpoint:

* `GET /api/kos` — Lihat semua kos (pemilik & penyewa)
* `POST /api/kos` — Tambah kos baru (hanya pemilik)
* `PUT /api/kos/:id` — Edit kos (hanya pemilik)
* `DELETE /api/kos/:id` — Hapus kos (hanya pemilik)

---

## 📌 Catatan

* Folder `node_modules` dan file `.env` diabaikan oleh Git (`.gitignore`)
* Gunakan Postman atau cURL untuk testing form-data upload

---

## 🧑‍💻 Kontributor

* Sultan Maulana Ichiro (2211082029)
  D4 Teknologi Rekayasa Perangkat Lunak, Politeknik Negeri Padang

---

## 📃 Lisensi

Proyek ini dibuat untuk keperluan akademik dan pengembangan pribadi.