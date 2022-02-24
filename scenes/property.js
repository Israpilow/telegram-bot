const { Markup, Composer, Scenes } = require('telegraf')
const yesUndefined = name => typeof name === 'undefined' ? '' : name;

const startStep = new Composer()
startStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.userName = ctx.message.from.username
        ctx.wizard.state.data.firstName = ctx.message.from.first_name
        ctx.wizard.state.data.userName = ctx.message.from.last_name
        ctx.wizard.state.data.condition = ctx.message.text;
        // await ctx.replyWithHTML('<b>Шаблон для заполнения электроники</b> \n \n <b>Пример электроники:</b> \n <i>1. Описание \n (например: Apple ) </i> \n <i>2. Цена</i> \n <i>3. Контакты</i> \n <i>4. Фото</i>')
        await ctx.replyWithHTML('Какую <b>недвижемость</b> вы хотите выставить? \n <i>Например, Сдаётся 3-ком,квартира</i>');
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
});

const priceStep = new Composer()
priceStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data.price = ctx.message.text;
        await ctx.replyWithHTML('Укажите <b>цену</b>\n<i>Например, 20 000 руб.</i>', Markup.inlineKeyboard([
            [Markup.button.callback('Договорная', 'no-price')]
        ]));
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const descrStep = new Composer()
descrStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data.descr = ctx.message.text;
        await ctx.replyWithHTML('Напишите описание <b>недвижемости</b>\n<i>Например, Общая площадь 75 кВ метров</i>');
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

descrStep.action('no-price', async ctx => {
    try {
        await ctx.answerCbQuery()
        ctx.wizard.state.data.descr = 'Договорная';
        await ctx.replyWithHTML('Напишите описание <b>недвижемости</b>\n<i>Например, Общая площадь 75 кВ метров</i>');
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const contactsStep = new Composer()
contactsStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data.contacts = ctx.message.text;
        await ctx.replyWithHTML('Как с Вами можно <b>связаться</b>\n<i>Например, 89898989898</i>')
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const photoStep = new Composer()
photoStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data.photo = ctx.message.text;
        // await ctx.replyWithHTML(`Отправьте фото <b>товара</b> альбомом\n<i>Как это сделать, видео ниже </i>`);
        await ctx.replyWithHTML(`Отправьте фото <b>недвижемости</b> альбомом\n<i>Как это сделать, видео ниже </i>`);
        await ctx.replyWithVideo({ source: 'video.mp4' })

        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const conditionStep = new Composer()
conditionStep.on('photo', async ctx => {
    try {
        ctx.wizard.state.data.condition = ctx.message.text;
        const wizardData = ctx.wizard.state.data;
        await ctx.replyWithHTML(`<b>${wizardData.price}</b>\n\n<b>Цена:</b>${wizardData.descr}\n\n<b>Описание недвижемости:</b>${wizardData.contacts}\n\n<b>Контакты:</b>\n${yesUndefined(wizardData.firstName)} ${yesUndefined(wizardData.lastName)} \n${wizardData.photo}`);
        const media = ctx.message.message_id
        // await ctx.telegram.sendMediaGroup(1954192936, [ctx.message.message_id])

        await ctx.replyWithHTML(`Ваша недвижемость успешно отправлена Администратору!`);
        await ctx.telegram.sendMessage(1954192936, `<b>Недвижемость</b>\n\n<b>${wizardData.price}</b>\n\n<b>Цена:</b>${wizardData.descr}\n\n<b>Описание недвижемости:</b>${wizardData.contacts}\n\n<b>Контакты:</b>\n${yesUndefined(wizardData.firstName)} ${yesUndefined(wizardData.lastName)} \n${wizardData.photo}`, {
            parse_mode: "HTML"
        });
        // await ctx.telegram.sendMediaGroup(1954192936, [
        //     {type: 'photo', media: 'https://konachan.com/sample/1272a96e6c4cbeb3fcd0acc298875e3f/Konachan.com%20-%20259979%20sample.jpg'},
        //     {type: 'photo', media: 'https://konachan.com/sample/1272a96e6c4cbeb3fcd0acc298875e3f/Konachan.com%20-%20259979%20sample.jpg'}
        // ]);
        // await ctx.telegram.sendPhoto(1954192936, `${ctx.telegram.photo}`);
        return ctx.scene.leave();
    } catch (e) {
        console.log(e)
    }
})

const propertyScene = new Scenes.WizardScene('propertyWizard', startStep, priceStep, descrStep, contactsStep, photoStep, conditionStep)
module.exports = propertyScene