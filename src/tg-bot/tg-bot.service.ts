import { Injectable } from '@nestjs/common';
import { Order, orderProduct, Product, User } from '@prisma/client';
import axios from 'axios';

type FullOrder = Order & {
  user: Pick<User, 'fullName'>;
  orderProduct: (orderProduct & {
    product: Pick<Product, 'name_uz'> | null;
  })[] | null;
};

@Injectable()
export class TgBotService {
  private readonly botToken = '8182871492:AAFbCEUbEU7Xnfp5ObmaHnFBrGau730ZlQo';
  private readonly chatId = '5186161943';

  async sendOrderNotification(order: FullOrder | null) {
    if (!order) {
      console.error('Order null yoki undefined');
      return;
    }

    const productNames = Array.isArray(order.orderProduct)
      ? order.orderProduct.map(p => p.product?.name_uz ?? 'Nomaʼlum mahsulot').join(', ')
      : 'Buyurtmalar yo‘q';

    const message = `🛒 Yangi buyurtma!
👤 Foydalanuvchi: ${order.user.fullName}
📦 Buyurtma: ${productNames}
💰 Umumiy narx: ${order.total}
📍 Manzil: ${order.address}
📅 Sana: ${order.date.toISOString().split('T')[0]}  // sanani yaxshiroq formatlash uchun
📝 Izoh: ${order.deliveryComment || 'Yo‘q'}`;

    try {
      await axios.post(
        `https://api.telegram.org/bot${this.botToken}/sendMessage`,
        {
          chat_id: this.chatId,
          text: message,
        },
      );
    } catch (error) {
      console.error('Telegramga xabar yuborishda xato:', error);
    }
  }
}
