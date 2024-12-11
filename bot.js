const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf('7786721901:AAF4KLZjKeeHDNtL2ayq7Mjh6hpY3DKGR-c'); // Замените на ваш API-ключ
const groupChatId = '-4773034500'; // Замените на ID вашей группы

// Хранилище состояния для пользователей
const userState = {};

// Стартовая команда
bot.start((ctx) => {
  userState[ctx.from.id] = {}; // Инициализация состояния пользователя
  ctx.reply(
    'Выберите локацию:',
    Markup.inlineKeyboard([
      [Markup.button.callback('Гагарина', 'location_Гагарина')],
      [Markup.button.callback('Жигулевск', 'location_Жигулевск')],
      [Markup.button.callback('Толстого', 'location_Толстого')],
    ])
  );
});

// Обработка выбора локации
bot.action(/^location_(.+)/, (ctx) => {
  const location = ctx.match[1];
  userState[ctx.from.id].location = location;
  ctx.reply(
    'Выберите действие:',
    Markup.inlineKeyboard([
      [Markup.button.callback('Выручка', 'action_Выручка')],
      [Markup.button.callback('Стажер', 'action_Стажер')],
      [Markup.button.callback('Посещение', 'action_Посещение')],
    ])
  );
});

// Обработка выбора действия
bot.action(/^action_(.+)/, (ctx) => {
  const action = ctx.match[1];
  userState[ctx.from.id].action = action;

  if (action === 'Выручка') {
    const today = new Date();
    const dates = Array.from({ length: 3 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    ctx.reply(
      'Выберите дату:',
      Markup.inlineKeyboard(
        dates.map((date) => [Markup.button.callback(date, `date_${date}`)])
      )
    );
  }
});

// Обработка выбора даты
bot.action(/^date_(.+)/, (ctx) => {
  const date = ctx.match[1];
  userState[ctx.from.id].date = date;
  ctx.reply('Введите выручку (например, 2137р.):');
});

// Обработка ввода выручки
bot.on('text', (ctx) => {
  const userId = ctx.from.id;
  const state = userState[userId];

  if (state && state.date) {
    const revenue = ctx.message.text;
    const message = `${state.location} выручка на ${state.date} - ${revenue}`;
    
    // Отправка сообщения в группу
    ctx.telegram.sendMessage(groupChatId, message);
    ctx.reply('Сообщение отправлено!');
    
    // Очистка состояния
    delete userState[userId];
  } else {
    ctx.reply('Произошла ошибка. Пожалуйста, начните заново с команды /start.');
  }
});

// Запуск бота
bot.launch()
  .then(() => console.log('Бот запущен!'))
  .catch((err) => console.error('Ошибка запуска бота:', err));

// Обработка завершения
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));