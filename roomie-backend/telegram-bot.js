import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Добро пожаловать! Начнем поиск сожителя:', {
    reply_markup: {
      inline_keyboard: [[{
        text: 'Заполнить анкету',
        web_app: { url: process.env.WEBAPP_URL }
      }]]
    }
  });
});
