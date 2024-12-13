const { Markup } = require('telegraf');

module.exports = (ctx, action) => {
  ctx.state = ctx.state || {};
  ctx.state.action = action;

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
        dates.map((date) => [Markup.button.callback(date, `date_${date}`)]) // Генерация кнопок с датами
      )
    );
  } else {
    ctx.reply('Эта функция пока не реализована.');
  }
};