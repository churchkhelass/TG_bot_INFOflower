const { Telegraf } = require('telegraf');
const startHandler = require('./handlers/startHandler');
const actionHandler = require('./handlers/actionHandler');
const dateHandler = require('./handlers/dateHandler');
const revenueHandler = require('./handlers/revenueHandler');
const { BOT_TOKEN } = require('./config/constants');

const bot = new Telegraf(BOT_TOKEN);

// Подключение обработчиков
bot.start(startHandler);
bot.action(/^action_(.+)/, actionHandler);
bot.action(/^date_(.+)/, dateHandler);
bot.on('text', revenueHandler);

bot.start((ctx) => {
  ctx.reply(
    'Нажмите кнопку, чтобы начать:',
    Markup.keyboard([['Запуск бота']])
      .resize() // Уменьшает клавиатуру до минимального размера
      .oneTime() // Клавиатура исчезает после нажатия
  );
});

// Обрабатываем нажатие кнопки "Запуск бота"
bot.hears('Запуск бота', (ctx) => {
  ctx.reply('Запуск команды /start...');
  startHandler(ctx); // Вызываем обработчик команды /start
});

// Запуск бота
bot.launch()
  .then(() => console.log('Бот запущен!'))
  .catch((err) => console.error('Ошибка запуска:', err));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));