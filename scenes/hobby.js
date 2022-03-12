const { Markup, Composer, Scenes } = require('telegraf')
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
            [Markup.button.callback('Билеты и путешествия', 'appliances_btn'), Markup.button.callback('Велосипеды', 'appliances_btn'), Markup.button.callback('Охота и рыбалка', 'appliances_btn')],
            [Markup.button.callback('Книги и журналы', 'appliances_btn'), Markup.button.callback('Коллекционирование', 'appliances_btn')],
            [Markup.button.callback('Музыкальные инструменты', 'appliances_btn'), Markup.button.callback('Спорт и отдых', 'appliances_btn')],
            [Markup.button.callback('Другое', 'appliances_btn')]
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
        await ctx.replyWithHTML('<b>ШАБЛОН ДЛЯ ЗАПОЛНЕНИЯ ХОББИ И ОТДЫХ</b>\n\n<i>1. Название объявления\n2. Состояние(новое|б/у)\n3. Описание объявления\n4. Цена\n5. Адрес\n6. Контакты</i>');
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

// const checkPhotoStep = new Composer()
// checkPhotoStep.on('text', async ctx => {
//     try {
//         ctx.wizard.state.data.checkPhoto = ctx.message.text;
//         await ctx.replyWithHTML(`Отправьте скриншот <b>чека</b>`);
//         return ctx.wizard.next()
//     } catch (e) {
//         console.log(e)
//     }
// })

const photoStep = new Composer()
photoStep.on('text', async ctx => {
    try {
        
        ctx.wizard.state.data.photo = ctx.message.text;
        const wizardData = ctx.wizard.state.data;
        await ctx.replyWithHTML(`Отправьте <b>фотографии</b> в одном сообщении\n<i>На данный момент не более 1</i>`);
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

// photoStep.on('document', async ctx => {
//     try {
//         ctx.wizard.state.data.photo = ctx.message;
//         await ctx.replyWithHTML(`Отправьте <b>фотографии</b> в одном сообщении\n<i>На данный момент не более 1</i>`);
//         return ctx.wizard.next()
//     } catch (e) {
//         console.log(e)
//     }
// })

const conditionStep = new Composer()
conditionStep.on('photo', async ctx => {
    try {
        ctx.wizard.state.data.condition = ctx.message;
        const wizardData = ctx.wizard.state.data;
        await ctx.replyWithHTML(`Ваше <b>объявление</b> успешно отправлена Администратору!`);
        await ctx.telegram.sendMessage(1954192936, `<b>ХОББИ И ОТДЫХ</b>\n\n${wizardData.photo}`, {
            parse_mode: "HTML"
        });
        await ctx.telegram.sendMessage(974900206, `<b>ХОББИ И ОТДЫХ</b>\n\n${wizardData.photo}`, {
            parse_mode: "HTML"
        });
        await ctx.copyMessage(1954192936, wizardData.condition)

        await ctx.copyMessage(974900206, wizardData.condition);
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

conditionStep.on('document', async ctx => {
    try {
        ctx.wizard.state.data.condition = ctx.message;
        const wizardData = ctx.wizard.state.data;
        await ctx.replyWithHTML(`${wizardData.checkPhoto}`);
        await ctx.replyWithHTML(`Ваше <b>объявление</b> успешно отправлена Администратору!`);
        await ctx.telegram.sendMessage(1954192936, `<b>ХОББИ И ОТДЫХ</b>\n\n${wizardData.photo}`, {
            parse_mode: "HTML"
        });
        await ctx.telegram.sendMessage(974900206, `<b>ХОББИ И ОТДЫХ</b>\n\n${wizardData.photo}`, {
            parse_mode: "HTML"
        });
        await ctx.copyMessage(1954192936, wizardData.condition);

        await ctx.copyMessage(974900206, wizardData.condition);
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

const hobbyScene = new Scenes.WizardScene('hobbyWizard', startStep, nameStep, photoStep, conditionStep)
module.exports = hobbyScene