const { Markup, Composer, Scenes } = require('telegraf');

const startStep = new Composer();
startStep.on('text', async (ctx) => {
  try {
    photos[ctx.from.id] = [];
    ctx.wizard.state.data = {};
    ctx.wizard.state.data.userName = ctx.message.from.username;
    ctx.wizard.state.data.firstName = ctx.message.from.first_name;
    ctx.wizard.state.data.userName = ctx.message.from.last_name;
    ctx.wizard.state.data.condition = ctx.message.text;
    await ctx.replyWithHTML(
      '<b>ШАБЛОН ДЛЯ ЗАПОЛНЕНИЯ КОМНАТЫ</b>\n\n1. Название объявления <i>( Например: Сдается комната. Есть все условия )</i>\n\n2. Описание объявления <i>( Например: С хорошим ремонтом. Есть теплый пол )</i>\n\n3. Цена <i>( Например: 30 000р )</i>\n\n4. Адрес <i>( Например: г.Махачале ул.Акушинского 90б )</i>\n\n5. Контакты <i>( Например: 89898966666 )</i>'
    );

    return ctx.wizard.next();
  } catch (e) {
    console.log(e);
  }
});

const photos = {};

const photoStep = new Composer();
photoStep.on('text', async (ctx) => {
  try {
    ctx.wizard.state.data.photo = ctx.message.text;

    await ctx.reply(`Отправьте фотографии`);
    return ctx.wizard.next();
  } catch (e) {
    console.log(e);
  }
});

const botStep = new Composer();
botStep.on('photo', (ctx) => {
  const lastPhoto = ctx.message.photo.length - 1;

  photos[ctx.from.id] = photos[ctx.from.id] || [];
  photos[ctx.from.id].push({
    type: 'photo',
    media: ctx.message.photo[lastPhoto].file_id,
  });

  if (photos[ctx.from.id].length < 2 || photos[ctx.from.id].length > 10) {
    ctx.reply(
      `Спасибо`,
      Markup.keyboard([
        [Markup.button.callback(`\u{23E9}   Отправить   \u{23EA}`, 'send')],
        [Markup.button.callback('\u{2B05}Назад', 'back_btn')],
      ])
        .oneTime()
        .resize()
    );
    ctx.reply(
      `А теперь нажмите на кнопку Отправить`,
      Markup.inlineKeyboard([
        [Markup.button.callback(`\u{23E9}   Отправить   \u{23EA}`, 'send')],
      ])
        .oneTime()
        .resize()
    );
    return ctx.wizard.next();
  }
});

const doneStep = new Composer();

doneStep.action('send', async (ctx) => {
  await sendImages(ctx);
});

doneStep.on('text', async (ctx) => {
  await sendImages(ctx);
});

async function sendImages(ctx) {
  ctx.wizard.state.data.done = ctx.message;
  const wizardData = ctx.wizard.state.data;

  await ctx.telegram.sendMessage(
    process.env.NODE_USER_ID,
    `<b>КОМНАТЫ</b>\n\n<b>${wizardData.photo}</b>`,
    {
      parse_mode: 'HTML',
    }
  );
  await ctx.telegram.sendMediaGroup(
    process.env.NODE_USER_ID,
    photos[ctx.from.id]
  );
  console.log(photos[ctx.from.id]);
  photos[ctx.from.id] = [];
  await ctx.replyWithHTML(
    `Ваше <b>объявление</b> успешно отправлена Администратору!`
  );
  await ctx.reply(
    'Выберите один из вариантов:',
    Markup.keyboard([
      [Markup.button.callback('\u{1F4E2}Подать объявление\u{1F4E2}', 'btn1')],
      [
        Markup.button.callback(
          '\u{1F4E2}Посмотреть все объявления\u{1F4E2}',
          'btn2'
        ),
      ],
      [Markup.button.callback('Написать админу', 'btn3')],
    ])
      .oneTime()
      .resize()
  );
  return ctx.scene.leave();
}

const roomsScene = new Scenes.WizardScene(
  'roomsWizard',
  startStep,
  photoStep,
  botStep,
  doneStep
);
module.exports = roomsScene;
