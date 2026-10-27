# Dergimiz (dergimiz.com.tr)
Dijital Okul & Edebiyat Dergisi Yayıncılık ve Tasarım Platformu

🌐 **Canlı Web Sitesi:** [dergimiz.com.tr](https://dergimiz.com.tr)  
✍️ **Editör & Yönetim Masası:** [dergimiz.com.tr/editor](https://dergimiz.com.tr/editor)  
📖 **Flipbook Okuyucu:** [dergimiz.com.tr/oku?id=sayi-1](https://dergimiz.com.tr/oku?id=sayi-1)  
🚀 **Sunucu:** Keyubu VDS (`179.61.147.252`) - Node.js (PM2) & Nginx Web Server  
📁 **Sunucu Dizini:** `/var/www/dergimiz`  

---

## 🔑 Yetkili Kullanıcılar & Giriş Bilgileri

### 👑 Süper Yöneticiler (Admin)
| E-Posta | Şifre | İsim & Ünvan | Yetki |
| :--- | :--- | :--- | :--- |
| **`sedatileri@gmail.com`** | `Nazmiye 123!` | Sedat İleri (Süper Yönetici) | Tam Yetki (Tüm Sayılar, Sayfalar, Canlıya Alma) |
| **`tag.nazmiye@gmail.com`** | `Nazmiye 123!` | Nazmiye Hoca (Genel Yayın Yönetmeni) | Tam Yetki (Tüm Sayılar, Sayfalar, Canlıya Alma) |

### ✍️ Sayfa Editörleri (Hızlı Yetki Kodları)
| Giriş Kodu | İsim & Ünvan | Sorumlu Olduğu Sayfa |
| :--- | :--- | :--- |
| **`ED-EMIR`** | Emirhan Demir (10-B) | Sayfa 3 (TÜBİTAK SolarWing Haberi) |
| **`ED-SELIN`** | Selin Arslan (Edebiyat Öğretmeni) | Sayfa 4 (Ayın Söyleşisi) |
| **`ED-ELIF`** | Elif Su Yıldız (11-C) | Sayfa 5 (Edebiyat & Şiir Köşesi) |
| **`ADMIN-2026`**| Master Admin Kodu | Doğrudan kod ile hızlı admin girişi |

---

## 🛠️ Sistem Mimarisi

### 1. Ön Yüz: Dergi Kitaplığı & Vitrin (`/`)
- En son yayınlanan sayı için 3D animasyonlu vitrin (Hero Section).
- Tüm geçmiş ve güncel sayılar için filtreli & aramalı arşiv kitaplığı.
- Okunma ve beğeni sayaçları.
- Sağ üstte ve altbilgide zarif Editör Masası giriş kapısı.

### 2. Etkileşimli Flipbook Okuyucu (`/oku`)
- Standart A4 dergi oranında çift / tek sayfa modu.
- Web Audio API ile sentezlenen gerçekçi kağıt çevirme ses efekti (sıfır harici dosya).
- Tıklanabilir etkileşimli ödüllü quiz ve anında geri bildirim.
- Tam ekran modu, içindekiler modalı, bağlantı paylaşma.

### 3. Editör & Yönetim Masası (`/editor`)
- **6 Zengin Lise Şablonu:** Kapak, İçindekiler, Makale/Haber, Röportaj, Edebiyat/Şiir, Foto Galeri, Quiz.
- **Sayfa Sahipliği & Kilit:** Editörler yalnızca kendilerine atanan sayfalarda düzenleme yapabilir; diğer sayfalar salt okunur korunur.
- **Onay Trafiği:** 🟡 Taslak ➔ 🔵 İncelemede ➔ 🔴 Revize İsteniyor ➔ 🟢 Onaylandı.
- **Yayınlama Kilidi:** Canlıya alma ve yayından çekme yetkisi yalnızca Admin'e aittir.
- **Admin Revizyon Notu:** Admin'in bıraktığı düzeltme notu sayfanın üstünde yapışkan not olarak çıkar.
- **Çoklu Sayı Desteği:** Sayılar arası geçiş ve "+ Sayı Ekle".
- **Dışa Aktarma:** Tek dosyalık taşınabilir E-Dergi (`.html`) ve taslak JSON yedekleme.

---

## 🚀 Dağıtım (Deploy)
```bash
npm run deploy
```
Tek bir komutla dosyaları paketler, SFTP ile VDS'e yükler, bağımlılıkları günceller, PM2 sürecini yeniden başlatır ve Nginx'i yeniler.
