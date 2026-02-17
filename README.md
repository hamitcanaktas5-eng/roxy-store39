# 🚀 Roxy Store - Kurulum Kılavuzu

## Firebase Kurulumu

### 1. Firebase Console → Authentication
- Email/Password provider'ı aktif et
- Admin hesabı oluştur: **admin@roxystore.com** (güçlü şifre)

### 2. Firebase Console → Firestore Database
- "Başlat" → "Test modunda" veya Production mode
- "Kurallar" sekmesine gidip `firestore.rules` dosyasındaki kuralları yapıştır

### 3. Dosyaları Hosting'e Yükle
Seçenekler:
- **Firebase Hosting**: `firebase deploy`
- **Netlify/Vercel**: Klasörü sürükle bırak
- **Direkt**: HTML dosyalarını sunucuya yükle

---

## Sayfa Listesi

| Dosya | Açıklama |
|-------|----------|
| `auth.html` | Giriş / Kayıt / Şifre sıfırla |
| `dashboard.html` | Ana sayfa |
| `virtual-number.html` | Sanal numara satın al |
| `social-media.html` | SMM sipariş (takipçi/beğeni/izlenme) |
| `balance.html` | Papara IBAN ile bakiye yükle |
| `support.html` | Destek talepleri + chat |
| `reviews.html` | Müşteri değerlendirmeleri |
| `profile.html` | Profil + şifre değiştir |
| `admin.html` | Admin paneli |

---

## Admin Panel

URL: `admin.html`  
Email: `admin@roxystore.com`  
Şifre: Firebase Console'dan belirlediğiniz şifre

**Admin Yetkisi:**  
Başka email ile giriş yapılsa admin görünmez.

---

## Firebase Konfigürasyonu

Her HTML dosyasında aynı config var, sadece bu satırları güncellerseniz tüm sistem güncellenir:
```javascript
apiKey: "AIzaSyBf2A1GhEzruI_6lfCNbq4MsbU8hxFjoqI"
authDomain: "roxy-store-67c53.firebaseapp.com"
projectId: "roxy-store-67c53"
```

---

## Fiyatlandırma

**Sanal Numara:**
- WhatsApp/Telegram Global: 45 ₺
- WhatsApp/Telegram Türkiye: 85 ₺

**Sosyal Medya (bin başına):**
- Instagram Takipçi: 100 ₺/K
- Instagram Beğeni: 60 ₺/K
- Instagram İzlenme: 30 ₺/K
- TikTok Takipçi: 150 ₺/K
- TikTok Beğeni: 70 ₺/K
- TikTok İzlenme: 25 ₺/K

Fiyatları değiştirmek için `PRICES` ve `SVCS` objelerini düzenleyin.

---

## İletişim Linkleri

Tüm sayfalardaki iletişim linklerini değiştirmek için arayın:
- `https://wa.me/447795203704` → WhatsApp numaranız
- `https://t.me/roxysatici` → Telegram linkiniz
