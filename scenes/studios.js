const {
    Markup,
    Composer,
    Scenes
} = require('telegraf');

const startStep = new Composer();
startStep.on('text', async ctx => {
    try {
        photos[ctx.from.id] = [];
        ctx.wizard.state.data = {};
        ctx.wizard.state.data.userName = ctx.message.from.username;
        ctx.wizard.state.data.firstName = ctx.message.from.first_name;
        ctx.wizard.state.data.userName = ctx.message.from.last_name;
        ctx.wizard.state.data.condition = ctx.message.text;
        await ctx.replyWithHTML('<b>ШАБЛОН ДЛЯ ЗАПОЛНЕНИЯ СТУДИИ</b>\n\n<i>1. Название объявления\n2. Описание объявления\n3. Цена\n4. Адрес\n5. Контакты</i>');

        return ctx.wizard.next();
    } catch (e) {
        console.log(e);
    }
});

const photos = {};

const photoStep = new Composer();
photoStep.on('text', async ctx => {
    try {

        ctx.wizard.state.data.photo = ctx.message.text;

        photos[ctx.from.id] = [];
        await ctx.reply(`Пришлите фотографии.\nНажмите на кнопку чтобы отправить`, Markup.keyboard([
            [Markup.button.callback('Отправить', 'send')],
            [Markup.button.callback("\u{2B05}Назад", 'back_btn')]
        ]).oneTime().resize());
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
        media: ctx.message.photo[lastPhoto].file_id
    });

    if (photos[ctx.from.id].length < 2 || photos[ctx.from.id].length > 10) {
        return ctx.wizard.next();
    }

});

const doneStep = new Composer();

doneStep.on('text', async (ctx) => {
    ctx.wizard.state.data.done = ctx.message.text;
    const wizardData = ctx.wizard.state.data;
    await ctx.replyWithHTML(`Ваше <b>объявление</b> успешно отправлена Администратору!`);
    // await ctx.replyWithMediaGroup(photos[ctx.from.id])

    await ctx.telegram.sendMessage(1954192936, `<b>СТУДИИ</b>\n\n<b>${wizardData.photo}</b>`, {
        parse_mode: "HTML"
    });
    await ctx.telegram.sendMediaGroup(1954192936, photos[ctx.from.id]);

    await ctx.telegram.sendMessage(974900206, `<b>СТУДИИ</b>\n\n<b>${wizardData.photo}</b>`, {
        parse_mode: "HTML"
    });
    await ctx.telegram.sendMediaGroup(974900206, photos[ctx.from.id]);

    await ctx.telegram.sendMessage(1722633425, `<b>СТУДИИ</b>\n\n<b>${wizardData.photo}</b>`, {
        parse_mode: "HTML"
    });
    await ctx.telegram.sendMediaGroup(1722633425, photos[ctx.from.id]);
    console.log(photos[ctx.from.id]);
    photos[ctx.from.id] = [];
    await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
        [Markup.button.callback('\u{1F4E2}Подать объявление\u{1F4E2}', 'btn1')],
        [Markup.button.callback('\u{1F4E2}Посмотреть все объявления\u{1F4E2}', 'btn2')],
        [Markup.button.callback('Написать админу', 'btn3')]
    ]).oneTime().resize());
    return ctx.scene.leave();
});

const studiosScene = new Scenes.WizardScene('studiosWizard', startStep, photoStep, botStep, doneStep);
module.exports = studiosScene;