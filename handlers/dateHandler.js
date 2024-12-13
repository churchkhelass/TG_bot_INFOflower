const { userState } = require('./dateHandler'); // Для хранения состояния
const whitelist = require('../config/whitelist'); // Белый список пользователей

module.exports = (ctx) => {
  const userId = ctx.from.id;

  if (whitelist[userId]) {
    const location = whitelist[userId];
    const date = ctx.match[1]; // Получаем дату
    userState[userId] = userState[userId] || {};
    userState[userId].date = date;
    userState[userId].location = location; // Сохраняем название

    ctx.reply('Введите выручку (например, 2137р.):');
  } else {
    ctx.reply('У вас нет доступа к этому боту.');
  }
};