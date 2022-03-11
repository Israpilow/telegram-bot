const { Markup, Composer, Scenes } = require('telegraf');
const fetch = require('node-fetch');
const yesUndefined = name => typeof name === 'undefined' || 'Object' ? '' : name;

const startStep = new Composer()
startStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.userName = ctx.message.from.username
        ctx.wizard.state.data.firstName = ctx.message.from.first_name
        ctx.wizard.state.data.userName = ctx.message.from.last_name
        ctx.wizard.state.data.condition = ctx.message.text;
        await ctx.replyWithHTML('Выберите <b>категорию:</b>', Markup.inlineKeyboard([
            [Markup.button.callback('Телефоны', 'appliances_btn'), Markup.button.callback('Аудио и видео', 'appliances_btn'), Markup.button.callback('Фототехника', 'appliances_btn')],
            [Markup.button.callback('Товары для компьютера', 'appliances_btn'), Markup.button.callback('Игры, приставки и программы', 'appliances_btn')],
            [Markup.button.callback('Ноутбуки', 'appliances_btn'), Markup.button.callback('Настольные компьютеры', 'appliances_btn')],
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
        await ctx.replyWithHTML('<b>ШАБЛОН ДЛЯ ЗАПОЛНЕНИЯ ЭЛЕКТРОНИКИ</b>\n\n<i>1. Название объявления\n2. Состояние(новое|б/у)\n3. Описание объявления\n4. Цена\n5. Адрес\n6. Контакты\n7. Стоимость объявления 200 руб.</i>');
        await ctx.replyWithHTML('Сбербанк 54545345345');
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const checkPhotoStep = new Composer()
checkPhotoStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data.checkPhoto = ctx.message.text;
        await ctx.replyWithHTML(`Отправьте скриншот <b>чека</b>`);
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const photoStep = new Composer()
photoStep.on('photo', async ctx => {
    try {
        const photoURLStart = ctx.message.photo[ctx.message.photo.length-1].file_id;
        const photoURLEnd = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getFile?file_id=${photoURLStart}`;
        await fetch(photoURLEnd)
            .then(async (res) => await res.text())
            .then(async (text) => {
                // const textObj = JSON.parse(text).result.file_path;
                const textMatch = text.match(/[a-zA-Z]*\/[a-zA-Z0-9_]*.[a-zA-Z]*/g);
                photoURL = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${textMatch}`;
            })
        await ctx.replyWithPhoto(
            {
                url: photoURL
            },
            {
                caption: "Это текст под кнопкой!",
                parse_mode: "HTML",
                reply_markup: JSON.stringify({"inline_keyboard": [[ Markup.button.callback("Кнопка", "button")]]})
            }
        );
        // console.log(photoURLStart)
        ctx.wizard.state.data.photo = ctx.message.text;
        await ctx.replyWithHTML(`Отправьте <b>фотографии</b> в одном сообщении\n<i>На данный момент не более 1</i>`);
        // return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

photoStep.on('document', async ctx => {
    try {
        ctx.wizard.state.data.photo = ctx.message.text;
        await ctx.replyWithHTML(`Отправьте <b>фотографии</b> в одном сообщении\n<i>На данный момент не более 1</i>`);
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const conditionStep = new Composer()
conditionStep.on('photo', async ctx => {
    try {
        ctx.wizard.state.data.condition = ctx.message;
        const wizardData = ctx.wizard.state.data;
        await ctx.replyWithHTML(`${wizardData.checkPhoto}`);
        await ctx.replyWithHTML(`Ваше <b>объявление</b> успешно отправлена Администратору!`);
        await ctx.telegram.sendMessage(1954192936, `<b>ЭЛЕКТРОНИКА</b>\n\n${wizardData.checkPhoto}`, {
            parse_mode: "HTML"
        });
        // await ctx.telegram.sendMessage(974900206, `<b>ЭЛЕКТРОНИКА</b>\n\n${wizardData.checkPhoto}`, {
        //     parse_mode: "HTML"
        // });
        await ctx.copyMessage(1954192936, wizardData.condition);
        // await ctx.copyMessage(974900206, wizardData.condition);
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
        await ctx.telegram.sendMessage(1954192936, `<b>ЭЛЕКТРОНИКА</b>\n\n${wizardData.checkPhoto}`, {
            parse_mode: "HTML"
        });
        await ctx.copyMessage(1954192936, wizardData.photo);
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



const electronicsScene = new Scenes.WizardScene('electronicsWizard', startStep, nameStep, checkPhotoStep, photoStep, conditionStep)
module.exports = electronicsScene