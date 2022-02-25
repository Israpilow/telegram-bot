const { Markup, Composer, Scenes } = require('telegraf')
const yesUndefined = name => typeof name === 'undefined' || 'Object' ? '' : name;

const startStep = new Composer()
startStep.on('message', async ctx => {
    try {
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.userName = ctx.message.from.username
        ctx.wizard.state.data.firstName = ctx.message.from.first_name
        ctx.wizard.state.data.userName = ctx.message.from.last_name
        ctx.wizard.state.data.condition = ctx.message.text;
        // await ctx.replyWithHTML('<b>Шаблон для заполнения электроники</b> \n \n <b>Пример электроники:</b> \n <i>1. Описание \n (например: Apple ) </i> \n <i>2. Цена</i> \n <i>3. Контакты</i> \n <i>4. Фото</i>')
        await ctx.replyWithHTML('Название <b>объявления</b>\n<i>Например, Apple IPhone 11</i>');
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
});

const stateStep = new Composer()
stateStep.on('message', async ctx => {
    try {
        ctx.wizard.state.data.state = ctx.message.text;
        await ctx.replyWithHTML('Состояние', Markup.inlineKeyboard([
            [Markup.button.callback('Новое', 'news'), Markup.button.callback('Б/у', 'used')]
        ]));
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const characteristicsStep = new Composer()
characteristicsStep.on('message', async ctx => {
    try {
        ctx.wizard.state.data.characteristics = ctx.message.text;
        await ctx.replyWithHTML('<b>Характеристики</b>\n\n<b>Производитель</b>\n<i>Например, Apple</i>');
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

characteristicsStep.action('news', async ctx => {
    try {
        await ctx.answerCbQuery()
        ctx.wizard.state.data.characteristics = 'Новое';
        await ctx.replyWithHTML('<b>Характеристики</b>\n\n<b>Производитель</b>\n<i>Например, Apple</i>');
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})
characteristicsStep.action('used', async ctx => {
    try {
        await ctx.answerCbQuery()
        ctx.wizard.state.data.characteristics = 'Б/у';
        await ctx.replyWithHTML('<b>Производитель</b>\n<i>Например, Apple</i>');
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const descrStep = new Composer()
descrStep.on('message', async ctx => {
    try {
        ctx.wizard.state.data.descr = ctx.message.text;
        await ctx.replyWithHTML('<b>Описание объявления</b>\n<i>Например, Apple IPhone 11 Pro в идеальном состоянии</i>');
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const priceStep = new Composer()
priceStep.on('message', async ctx => {
    try {
        ctx.wizard.state.data.price = ctx.message.text;
        await ctx.replyWithHTML('<b>Цена</b>\n<i>Например, 40 000 руб.</i>');
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const photoStep = new Composer()
photoStep.on('message', async ctx => {
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
        console.log(ctx.message.text)
        ctx.wizard.state.data.location = ctx.message;
        await ctx.replyWithHTML(`<b>Место сделки</b>\nОтправьте геолокацию где будет происходить сделка\n\n<i>Любо отправьте сообщением адресс сделки\nНапример, г.Махачкала ул.Акушинского 90б</i>`,{
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
conditionStep.on('contact', async ctx => {
    try {
        ctx.wizard.state.data.condition = ctx.message.text;
        const wizardData = ctx.wizard.state.data;
        await ctx.replyWithHTML(`<b>Название объявления:</b> ${wizardData.state}\n\n<b>Состояние: </b>${wizardData.characteristics}\n\n<b>Производитель: </b>${wizardData.descr}\n\n<b>Описание объявления: </b>${wizardData.price}\n\n<b>Цена: </b>${wizardData.photo}\n\n<b>Место сделки: </b>${yesUndefined(wizardData.contacts)}`);
        await ctx.replyWithHTML(`Ваше <b>объявление</b> успешно отправлена Администратору!`);
        await ctx.telegram.sendMessage(1954192936, `<b>ЭЛЕКТРОНИКА</b>\n\n<b>Название объявления:</b> ${wizardData.state}\n\n<b>Состояние: </b>${wizardData.characteristics}\n\n<b>Производитель: </b>${wizardData.descr}\n\n<b>Описание объявления: </b>${wizardData.price}\n\n<b>Цена: </b>${wizardData.photo}\n\n<b>Место сделки: </b>${yesUndefined(wizardData.contacts)}`, {
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
    } catch (e) {
        console.log(e)
    }
})



const phonesScene = new Scenes.WizardScene('phonesWizard', startStep, stateStep, characteristicsStep, descrStep, priceStep, photoStep, locationStep, contactsStep, conditionStep)
module.exports = phonesScene