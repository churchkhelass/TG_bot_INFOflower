const { GROUP_CHAT_ID } = require('../config/constants');
const { userState } = require('./dateHandler');
const whitelist = require('../config/whitelist'); // Белый список пользователей

module.exports = (ctx) => {
  const userId = ctx.from.id;

  if (whitelist[userId]) {
    const state = userState[userId] || {};

    if (state.date && state.location) {
      const revenue = ctx.message.text;
      const message = `${state.location} выручка на ${state.date} - ${revenue}`;

      ctx.telegram
        .sendMessage(GROUP_CHAT_ID, message)
        .then(() => ctx.reply('Сообщение успешно отправлено!'))
        .catch((error) => {
          console.error('Ошибка отправки сообщения:', error);
          ctx.reply('Не удалось отправить сообщение. Попробуйте снова.');
        });

      delete userState[userId]; // Очищаем состояние
    } else {
      ctx.reply('Произошла ошибка. Пожалуйста, начните с команды /start.');
    }
  } else {
    ctx.reply('У вас нет доступа к этому боту.');
  }
};