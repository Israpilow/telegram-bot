const { Markup, Composer, Scenes } = require('telegraf')

const startStep = new Composer()
startStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.userName = ctx.message.from.username
        ctx.wizard.state.data.firstName = ctx.message.from.first_name
        ctx.wizard.state.data.userName = ctx.message.from.last_name
        ctx.wizard.state.data.condition = ctx.message.text;
        // await ctx.replyWithHTML('<b>Шаблон для заполнения электроники</b> \n \n <b>Пример электроники:</b> \n <i>1. Описание \n (например: Apple ) </i> \n <i>2. Цена</i> \n <i>3. Контакты</i> \n <i>4. Фото</i>')
        await ctx.replyWithHTML('Какую <b>электронику</b> вы хотите выставить? \n<i>Например, Apple Iphone 11</i>');
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
});

const priceStep = new Composer()
priceStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data.price = ctx.message.text;
        await ctx.replyWithHTML('Укажите <b>цену</b>\n<i>Например, 40 000 руб.</i>', Markup.inlineKeyboard([
            [Markup.button.callback('Договорная', 'no-price')]
        ]));
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const contactStep = new Composer()
contactStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data.contact = ctx.message.text;
        await ctx.replyWithHTML('Напишите описание <b>товара</b>\n<i>Например, Iphone 11 в идеальном состоянии</i>');
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

contactStep.action('no-price', async ctx => {
    try {
        await ctx.answerCbQuery()
        ctx.wizard.state.data.contact = 'Договорная';
        await ctx.replyWithHTML('Напишите описание <b>товара</b>\n<i>Например, Iphone 11 в идеальном состоянии</i>');
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const photoStep = new Composer()
photoStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data.photo = ctx.message.text;
        await ctx.replyWithHTML(`Отправьте фото <b>товара</b> в одном сообщении\n Если фото нет, то нажмите кнопку ниже`, Markup.inlineKeyboard([
            [Markup.button.callback('Нет фото', 'no-photo')]
        ]));
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
        await ctx.replyWithHTML(`<b>${wizardData.price}</b>\n\n<b>Цена:</b>${wizardData.contact}\n\n<b>Описание товара:</b>${wizardData.photo}`);
        await ctx.replyWithHTML(`Ваш(а) <b>${wizardData.price}</b> успешно отправлена Администратору!`);
        await ctx.telegram.sendMessage(1954192936, `<b>Электроника</b>\n\n<b>${wizardData.price}</b>\n\n<b>Цена:</b>${wizardData.contact}\n\n<b>Описание товара:</b>${wizardData.photo}`, {
            parse_mode: "HTML"
        });
        // await ctx.telegram.sendPhoto(1954192936, `${ctx.telegram.photo}`);
        return ctx.scene.leave();
    } catch (e) {
        console.log(e)
    }
    console.log(ctx)
})

conditionStep.action('no-photo', async ctx => {
    try {
        await ctx.answerCbQuery()
        ctx.wizard.state.data.condition = 'Нет фото';
        const wizardData = ctx.wizard.state.data;
        await ctx.replyWithHTML(`<b>${wizardData.price}</b>\n\n<b>Цена:</b>${wizardData.contact}\n\n<b>Описание товара:</b>${wizardData.photo}`);
        await ctx.replyWithHTML(`Ваш(а) <b>${wizardData.price}</b> успешно отправлена Администратору!`);
        await ctx.telegram.sendMessage(1954192936, `<b>Электроника</b>\n\n<b>${wizardData.price}</b>\n\n<b>Цена:</b>${wizardData.contact}\n\n<b>Описание товара:</b>${wizardData.photo}`, {
            parse_mode: "HTML"
        });
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})



const electronicsScene = new Scenes.WizardScene('electronicsWizard', startStep, priceStep, contactStep, photoStep, conditionStep)
module.exports = electronicsScene