import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

const webAppUrl = process.env.WEBAPP_URL;

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  // Отправляем одно сообщение с инлайн-кнопкой
  bot.sendMessage(chatId, 'Добро пожаловать! 👋\nНажми кнопку ниже или используй кнопку рядом с полем ввода, чтобы открыть приложение:', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🚀 Открыть приложение',
            web_app: { url: webAppUrl }
          }
        ]
      ],
      keyboard: [
        [
          {
            text: '🚀 Открыть приложение',
            web_app: { url: webAppUrl }
          }
        ]
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    }
  });
});