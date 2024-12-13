const { Markup } = require('telegraf');
const whitelist = require('../config/whitelist'); //белый список магазинов и пользователей
const menuKeyBoard = require('../config/menuKeyBoard'); // список действий

module.exports = (ctx) => {
  const userId = ctx.from.id;

  // Проверяем, есть ли пользователь в белом списке
  if (whitelist[userId]) {
    const location = whitelist[userId];
    ctx.reply(
    `Привет, ${location}! Выберите действие:`,
    Markup.keyboard(menuKeyBoard)
      .resize() // Уменьшает размер клавиатуры для удобства
      .oneTime(false) // Клавиатура остается доступной до выбора действия
    );
  } else {
    ctx.reply('У вас нет доступа к этому боту.');
  }
};