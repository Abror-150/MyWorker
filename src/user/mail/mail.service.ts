import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'odilbek3093@gmail.com',
        pass: 'ouli ileb tlqw xvcw',
      },
    });
  }

  async sendEmail(to: string, text: string, subject: string): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: 'urazalievv.abror@gmail.com',
        to,
        text,
        subject,
      });
      console.log('Email yuborildi:', info.messageId);
    } catch (error) {
      console.error('Email yuborishda xato:', error);
    }
  }
}
