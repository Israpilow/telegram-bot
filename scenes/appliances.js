const { Markup, Composer, Scenes } = require('telegraf')
const path = require('path')
const yesUndefined = name => typeof name === 'undefined' ? '' : name;

const startStep = new Composer()
startStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.userName = ctx.message.from.username
        ctx.wizard.state.data.firstName = ctx.message.from.first_name
        ctx.wizard.state.data.userName = ctx.message.from.last_name
        ctx.wizard.state.data.condition = ctx.message.text;
        await ctx.replyWithHTML('Какую <b>бытовую технику</b> вы хотите выставить? \n<i>Например, Микроволновая печь</i>');
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

const contactStep = new Composer()
contactStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data.contact = ctx.message.text;
        await ctx.replyWithHTML('Напишите описание <b>товара</b>\n<i>Например, Микроволновая печь в идеальном состоянии</i>');
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

contactStep.action('no-price', async ctx => {
    try {
        await ctx.answerCbQuery()
        ctx.wizard.state.data.contact = 'Договорная';
        await ctx.replyWithHTML('Напишите описание <b>товара</b>\n<i>Например, Микроволновая печь в идеальном состоянии</i>');
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
        await ctx.replyWithHTML(`Отправьте фото <b>товара</b> в одном сообщении\n<i>Если фото нет, то нажмите кнопку ниже </i>`, Markup.inlineKeyboard([
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
        // await ctx.copyMessage(1954192936, ctx.telegram.photo)
        await ctx.telegram.sendMessage(1954192936, `<b>Электроника</b>\n\n<b>${wizardData.price}</b>\n\n<b>Цена:</b>${wizardData.contact}\n\n<b>Описание товара:</b>${wizardData.photo}`, {
            parse_mode: "HTML"
        });
        const chatID = 1954192936;
        const captionPhoto = ctx.message.caption;
        const fileID = ctx.message.photo
        console.log(fileID)
        const captionEntitiesPhoto = ctx.message.caption_entities
        const fileIdPhoto = ctx.message.photo[ctx.message.photo.length-1].file_id;
        return ctx.telegram.sendPhoto(chatID, fileIdPhoto, {
            caption: captionPhoto,
            caption_entities: captionEntitiesPhoto
        });
        // await ctx.telegram.sendPhoto(1954192936, `${ctx.telegram.photo}`);

    } catch (e) {
        console.log(e)
    }

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

const appliancesScene = new Scenes.WizardScene('appliancesWizard', startStep, priceStep, contactStep, photoStep, conditionStep)
module.exports = appliancesScene