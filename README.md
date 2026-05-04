# MyWorker API

Mijozlar va ustalarni bog'lovchi platforma backend API'si.
Buyurtma bering, usta toping, xizmatni baholang.

## Stack
NestJS • PostgreSQL • Prisma • Docker • JWT • Nodemailer

## Asosiy funksiyalar
- OTP orqali email tasdiqlash
- Multi-role: USER_FIZ, USER_YUR, SELLER, ADMIN
- Buyurtma yaratish va ustaga biriktirish
- Session management (IP, device tracking)
- Mahsulot va asboblar katalogi

## Ishga tushirish
git clone https://github.com/abror-150/MyWorker.git
cd MyWorker
cp .env.example .env
npm install
npx prisma migrate dev
npm run start:dev

## Environment variables (.env.example)
DATABASE_URL=postgresql://user:password@localhost:5432/myworker
JWT_SECRET=your-secret-key
MAIL_USER=your@gmail.com
MAIL_PASS=your-password
PORT=3000

## API endpoints
POST /user/send-email     — OTP yuborish
POST /user/verify-email   — Email tasdiqlash
POST /user/register       — Ro'yxatdan o'tish
POST /user/login          — Kirish
GET  /user/me             — Profil
POST /order               — Buyurtma yaratish
GET  /master              — Ustalar ro'yxati
