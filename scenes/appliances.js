const { Markup, Composer, Scenes } = require('telegraf')
const axios = require('axios');
const fs = require('fs')
const needle = require('needle');
const yesUndefined = name => typeof name === 'undefined' || 'Object' ? '' : name;

const startStep = new Composer()
startStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.userName = ctx.message.from.username
        ctx.wizard.state.data.firstName = ctx.message.from.first_name
        ctx.wizard.state.data.userName = ctx.message.from.last_name
        ctx.wizard.state.data.condition = ctx.message.text;
        // await ctx.replyWithHTML('Какую <b>бытовую технику</b> вы хотите выставить? \n<i>Например, Микроволновая печь</i>');
        await ctx.replyWithHTML('Выберите <b>категорию:</b>', Markup.inlineKeyboard([
            [Markup.button.callback('Бытовая техника', 'appliances_btn'), Markup.button.callback('Мебель и интерьер', 'appliances_btn')],
            [Markup.button.callback('Ремонт и строительство', 'appliances_btn'), Markup.button.callback('Продукты питания', 'appliances_btn'), ],
            [Markup.button.callback('Посуда и товары для кухни', 'appliances_btn'), Markup.button.callback('Растения', 'appliances_btn')]
        ]));
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
});

const nameStep = new Composer()
nameStep.action('appliances_btn', async ctx => {
    try {
        await ctx.answerCbQuery()
        ctx.wizard.state.data.name = ctx.message;
        await ctx.replyWithHTML('Название <b>объявления:</b>');
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})


const priceStep = new Composer()
priceStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data.price = ctx.message.text;
        await ctx.replyWithHTML('Укажите <b>цену:</b>', Markup.inlineKeyboard([
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
        await ctx.replyWithHTML('Напишите описание <b>товара</b>');
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

contactStep.action('no-price', async ctx => {
    try {
        await ctx.answerCbQuery()
        ctx.wizard.state.data.contact = 'Договорная';
        await ctx.replyWithHTML('Напишите описание <b>товара</b>');
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const photoStep = new Composer()
photoStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data.photo = ctx.message.text;
        await ctx.replyWithHTML(`Отправьте <b>фотографии</b> в одном сообщении\n<i>На данный момент не более 1</i>`);
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const locationStep = new Composer()
locationStep.on('photo', async ctx => {
    try {
        // console.log(ctx.message.photo[0].file_id)
        const files = ctx.update.message.photo;
        const fileId = files[1].file_id
        console.log(ctx.update.message.photo)
        ctx.wizard.state.data.location = ctx.message;
        await ctx.replyWithHTML(`<b>Адрес недвижемости</b>\nОтправьте геолокацию где находится<b> недвижемость</b>\n\n<i>Любо отправьте сообщением адрес \nНапример, г.Махачкала ул.Акушинского 90б</i>`,{
            reply_markup: JSON.stringify({
                keyboard: [
                    [{
                        text: 'Отправить геологацию',
                        request_location: true
                    }]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                })
        });



        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})



locationStep.on('document', async ctx => {
    try {
        // console.log(ctx.message.photo[0].file_id)
        ctx.wizard.state.data.location = ctx.message;
        await ctx.replyWithHTML(`<b>Адрес недвижемости</b>\nОтправьте геолокацию где находится<b>недвижемость</b>\n\n<i>Любо отправьте сообщением адрес \nНапример, г.Махачкала ул.Акушинского 90б</i>`,{
            reply_markup: JSON.stringify({
                keyboard: [
                    [{
                        text: 'Отправить геологацию',
                        request_location: true
                    }]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                })
        });
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const contactsStep = new Composer()
contactsStep.on('message', async ctx => {
    try {
        ctx.wizard.state.data.contacts = ctx.message;
        await ctx.replyWithHTML(`<b>Отправьте контакт</b>`,     {
            reply_markup: JSON.stringify({
                keyboard: [
                    [{
                        text: 'Отправить контакт',
                        request_contact: true
                    }]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                })
        });
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const conditionStep = new Composer()
conditionStep.on('message', async ctx => {
    try {
        ctx.wizard.state.data.condition = ctx.message;
        const wizardData = ctx.wizard.state.data;
        await ctx.replyWithHTML(`<b>Название объявления:</b> ${wizardData.price}\n\n<b>Цена: </b>${wizardData.contact}\n\n<b>Описание объявления: </b>${wizardData.photo}\n\n<b>Место сделки: </b>${yesUndefined(wizardData.contacts)}`);
        await ctx.replyWithHTML(`Ваша недвижемость успешно отправлена Администратору!`);
        await ctx.telegram.sendMessage(1954192936, `<b>Для дачи и для дома</b>\n\n<b>Название объявления:</b> ${wizardData.price}\n\n<b>Цена: </b>${wizardData.contact}\n\n<b>Описание объявления: </b>${wizardData.photo}`, {
            parse_mode: "HTML"
        });
        await ctx.copyMessage(1954192936, wizardData.location);
        await ctx.copyMessage(1954192936, wizardData.contacts);
        await ctx.copyMessage(1954192936, wizardData.condition);
        await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
            [Markup.button.callback('\u{1F4E2}Подать объявление\u{1F4E2}', 'btn1')],
            [Markup.button.callback('\u{1F4E2}Канал с объявлениями\u{1F4E2}', 'btn2')],
            [Markup.button.callback('Поддержка', 'btn3')]
        ]).oneTime().resize())
        return ctx.scene.leave();
        return ctx.scene.leave();
    } catch (e) {
        console.log(e)
    }
})

const appliancesScene = new Scenes.WizardScene('appliancesWizard', startStep, nameStep, priceStep, contactStep, photoStep, locationStep, contactsStep, conditionStep)
module.exports = appliancesScene