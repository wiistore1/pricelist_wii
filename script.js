// Fungsi untuk membuat card produk
function buatCardProduk(item) {
  return `
    <div class="col-md-4 mb-4">
      <div class="card h-100 shadow-sm hover:scale-105 transition">
        <div class="overflow-hidden d-flex align-items-center justify-content-center" style="height: 200px;">
          <img src="${item.gambar}" 
               class="card-img-top object-cover rounded" 
               style="max-height: 100%; width: auto; object-fit: cover;" 
               alt="${item.nama}">
        </div>
        <div class="card-body">
          <h5 class="card-title">${item.nama}</h5>
          <p class="card-text text-muted">${item.deskripsi}</p>
          <p class="fw-bold text-primary">Rp ${item.harga.toLocaleString()}</p>
          <a href="order.html" class="btn btn-sm btn-outline-primary">pesan sekarang</a>
        </div>
      </div>
    </div>
  `;
}

// Load produk dari JSON untuk index.html
fetch('products.json')
  .then(res => res.json())
  .then(data => {
    const diskonList = document.getElementById('diskon-list');
    const bestList = document.getElementById('best-list');
    const termurahList = document.getElementById('termurah-list');

    if (diskonList) {
      const produkDiskon = data.filter(p => p.diskon === true);
      produkDiskon.forEach(p => diskonList.innerHTML += buatCardProduk(p));
    }

    if (bestList) {
      const bestSeller = data.filter(p => p.best_seller === true);
      bestSeller.forEach(p => bestList.innerHTML += buatCardProduk(p));
    }

    if (termurahList) {
      const produkTermurah = data.sort((a, b) => a.harga - b.harga).slice(0, 3);
      produkTermurah.forEach(p => termurahList.innerHTML += buatCardProduk(p));
    }
  })
  .catch(err => console.error("Gagal mengambil produk:", err));

// Load testimoni dari JSON
fetch('testimonials.json')
  .then(res => res.json())
  .then(testis => {
    const carousel = document.getElementById('carousel-inner');
    testis.forEach((item, i) => {
      const aktif = i === 0 ? 'active' : '';
      carousel.innerHTML += `
        <div class="carousel-item ${aktif}">
          <div class="text-center p-4">
            <img src="${item.gambar}" class="d-block mx-auto rounded shadow mb-3"
     style="max-height:200px; max-width:100%; object-fit:cover;" 
     onclick="zoomGambar(this)">
            <blockquote class="blockquote">
              <p>${item.komentar}</p>
            </blockquote>
            <footer class="blockquote-footer">${item.nama}</footer>
          </div>
        </div>
      `;
    });
  })
  .catch(err => console.error("Gagal mengambil testimoni:", err));

// Zoom gambar testimoni
function zoomGambar(img) {
  document.getElementById("zoomImg").src = img.src;
  const modal = new bootstrap.Modal(document.getElementById("zoomModal"));
  modal.show();
}

// Fungsi utama untuk load produk di halaman aplikasi.html, topup.html, followers.html
document.addEventListener("DOMContentLoaded", () => {
  const produkContainer = document.getElementById("produkContainer");
  const searchInput = document.getElementById("searchInput");
  const filterKategori = document.getElementById("filterKategori");

  fetch("products.json")
    .then((res) => res.json())
    .then((data) => {
      const path = window.location.pathname;
      let kategoriAktif = "";

      if (path.includes("aplikasi.html")) kategoriAktif = "aplikasi";
      else if (path.includes("topup.html")) kategoriAktif = "topup";
      else if (path.includes("followers.html")) kategoriAktif = "followers";

      let produk = data.filter((item) => item.kategori === kategoriAktif);

      function renderProduk(list) {
        produkContainer.innerHTML = "";

        if (list.length === 0) {
          produkContainer.innerHTML = `<div class="text-center text-muted">Produk tidak ditemukan.</div>`;
          return;
        }

        list.forEach((item) => {
          const card = document.createElement("div");
          card.className = "col-12 col-md-6 col-lg-4";
          card.innerHTML = `
            <div class="card h-100 shadow-sm hover:shadow-lg transition">
              <div class="overflow-hidden d-flex align-items-center justify-content-center" style="height: 200px;">
                <img src="${item.gambar}" 
                     alt="${item.nama}" 
                     style="max-height: 100%; width: auto; object-fit: cover;" />
              </div>
              <div class="card-body">
                <h5 class="card-title">${item.nama}</h5>
                <p class="card-text text-muted">${item.deskripsi}</p>
                <p class="fw-bold text-primary">Rp ${item.harga.toLocaleString()}</p>
                <a href="order.html" class="btn btn-sm btn-outline-primary">pesan sekarang</a>
              </div>
            </div>
          `;
          produkContainer.appendChild(card);
        });
      }

      renderProduk(produk);

      // 🔍 Pencarian
      searchInput?.addEventListener("input", () => {
        const keyword = searchInput.value.toLowerCase();
        const hasil = produk.filter((item) =>
          item.nama.toLowerCase().includes(keyword)
        );
        renderProduk(hasil);
      });

      // 🏷️ Filter Kategori
      filterKategori?.addEventListener("change", () => {
        const kategoriDipilih = filterKategori.value;
        let hasil = data;

        if (kategoriDipilih) {
          hasil = hasil.filter((item) => item.kategori === kategoriDipilih);
        }

        const keyword = searchInput?.value.toLowerCase();
        if (keyword) {
          hasil = hasil.filter((item) =>
            item.nama.toLowerCase().includes(keyword)
          );
        }

        renderProduk(hasil);
      });
    })
    .catch((err) => {
      console.error("Gagal load produk:", err);
      produkContainer.innerHTML =
        "<div class='text-danger'>Gagal memuat data produk.</div>";
    });
});
