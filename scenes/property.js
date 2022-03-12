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
        await ctx.replyWithHTML('Выберите <b>категорию:</b>', Markup.inlineKeyboard([
            [Markup.button.callback('Квартиры', 'appliances_btn'), Markup.button.callback('Комнаты', 'appliances_btn')],
            [Markup.button.callback('Дома дачи и коттеджи', 'appliances_btn'), Markup.button.callback('Гаражи и машиностроения', 'appliances_btn')],
            [Markup.button.callback('Земельные участки', 'appliances_btn'), Markup.button.callback('Комменрческая недвижемость', 'appliances_btn')],
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
        await ctx.replyWithHTML('<b>ШАБЛОН ДЛЯ ЗАПОЛНЕНИЯ НЕДВИЖОМОСТИ</b>\n\n<i>1. Название объявления\n2. Описание объявления\n3. Цена\n4. Адрес\n5. Контакты</i>');
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
        
        ctx.wizard.state.data.photo = ctx.message;
        const wizardData = ctx.wizard.state.data;
        await ctx.replyWithHTML(`Отправьте <b>фотографии</b> в одном сообщении\n<i>На данный момент не более 1</i>`);
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

photoStep.on('document', async ctx => {
    try {
        ctx.wizard.state.data.photo = ctx.message;
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
        await ctx.replyWithHTML(`Ваше <b>объявление</b> успешно отправлена Администратору!`);
        await ctx.telegram.sendMessage(1954192936, `<b>НЕДВИЖОМОСТИ</b>\n\n${wizardData.checkPhoto}`, {
            parse_mode: "HTML"
        });
        await ctx.telegram.sendMessage(974900206, `<b>НЕДВИЖОМОСТИ</b>\n\n${wizardData.checkPhoto}`, {
            parse_mode: "HTML"
        });
        await ctx.copyMessage(1954192936, wizardData.photo)
        await ctx.copyMessage(1954192936, wizardData.condition)

        await ctx.copyMessage(974900206, wizardData.photo);
        await ctx.copyMessage(974900206, wizardData.condition);
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
        await ctx.telegram.sendMessage(1954192936, `<b>НЕДВИЖОМОСТИ</b>\n\n${wizardData.checkPhoto}`, {
            parse_mode: "HTML"
        });
        await ctx.telegram.sendMessage(974900206, `<b>НЕДВИЖОМОСТИ</b>\n\n${wizardData.checkPhoto}`, {
            parse_mode: "HTML"
        });
        await ctx.copyMessage(1954192936, wizardData.photo);
        await ctx.copyMessage(1954192936, wizardData.condition);

        await ctx.copyMessage(974900206, wizardData.photo);
        await ctx.copyMessage(974900206, wizardData.condition);
        return ctx.scene.leave();
    } catch (e) {
        console.log(e)
    }
})

const propertyScene = new Scenes.WizardScene('propertyWizard', startStep, nameStep, checkPhotoStep, photoStep, conditionStep)
module.exports = propertyScene