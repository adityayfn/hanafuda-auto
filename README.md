# Bot Hanafuda 

Bot ini menggunakan Puppeteer untuk otomatisasi tugas di situs [hanafuda.hana.network](https://hanafuda.hana.network). Bot ini memiliki beberapa fitur, seperti otomatisasi "grow" dan "deposit" dengan menggunakan akun dan transaksi Ethereum.

## Fitur

- **Auto Grow**: Menjalankan otomatisasi fitur "grow" di situs.
- **Auto Deposit**: Melakukan transaksi deposit di Ethereum dengan alamat dan jumlah yang diinput pengguna.

## Prasyarat

- Node.js
- Puppeteer dengan plugin stealth
- Akun Ethereum untuk melakukan deposit

# How to use

### 1. Persiapan 

Bot ini membutuhkan `Node.js` dan `npm`. Pastikan keduanya sudah terinstal.

### 2. Clone Repo

Clone atau download repository ini


```bash
git clone https://github.com/adityayfn/hanafuda-auto.git 
```

### 3. Masuk direktori dan Install dependensi

```bash
cd hanafuda-auto
npm install    
```

### 4. Buka file index.js

```bash
cari "executablePath" dan sesuaikan dengan path google chrome di devices anda
```


### 5. Buat file .env lalu jalankan Bot

```bash
node index.js
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`USER_EMAIL=your_email@example.com`

`USER_PASSWORD=your_password`

`USER_PRIVATE_KEY=your_private_key`





## Catatan 
* Bot ini hanya saya tes di linux, silahkan di coba dan disesuaikan jika anda menggunakan windows atau termux
* Untuk fitur auto grow terkadang masih mengalami error
* Pastikan saldo Ethereum mencukupi sebelum menjalankan fitur deposit.
