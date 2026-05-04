# 🛠️ MyWorker

MyWorker — bu **mijozlar va ishchilarni bog‘lovchi platforma**.  
Agar sizga santexnik, quruvchi yoki boshqa mutaxassis kerak bo‘lsa, MyWorker orqali **buyurtma berish** mumkin.  

---

## 🚀 Texnologiyalar (Stack)

- **Backend:** Node.js, NestJS  
- **ORM:** Prisma  
- **Database:** PostgreSQL  
- **API:** REST  
- **Deployment:** AWS / PM2 / Nginx 

---

## 📌 Asosiy funksiyalar

- 📝 Mijozlar buyurtma yaratishi mumkin (masalan: "santexnik kerak").  
- 🔎 Ishchilar buyurtmalarni ko‘rib, o‘z xizmatlarini taklif qilishadi.  
- 📂 Buyurtmalarni boshqarish (yaratish, yangilash, o‘chirish).  
- 👥 Mijozlar va ishchilar o‘rtasida aloqa.  
- 📊 Ishchi va buyurtmalar haqidagi ma’lumotlarni saqlash.  

---

## ⚙️ O‘rnatish va ishga tushirish

```bash
# Reponi clone qiling
git clone https://github.com/abror-150/MyWorker.git

# Loyihaga kiring
cd MyWorker

# Paketlarni o‘rnating
npm install

# Ma’lumotlar bazasini migratsiya qiling
npx prisma migrate dev

# Loyihani ishga tushiring
npm run start:dev
