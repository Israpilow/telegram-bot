const { Markup, Composer, Scenes } = require('telegraf')
const yesUndefined = name => typeof name === 'undefined' ? '' : name;

const startStep = new Composer()
startStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data = {};
        ctx.wizard.state.data.userName = ctx.message.from.username
        ctx.wizard.state.data.firstName = ctx.message.from.first_name
        ctx.wizard.state.data.lastName = ctx.message.from.last_name
        ctx.wizard.state.data.condition = ctx.message.text;
        await ctx.replyWithHTML('Вид предостовляемых <b>услуг</b>\n<i>Например, Грузоперевозки по всем городам.</i>');
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const titleStep = new Composer()
titleStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data.title = ctx.message.text;
        await ctx.replyWithHTML('Город в котором Вы предостовляете <b>услугу</b>?<i>Например, Махачкала</i>', Markup.inlineKeyboard([
            [Markup.button.callback('Дистанционно', 'remote')]
        ]));
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const priceStep = new Composer()
priceStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data.price = ctx.message.text;
        await ctx.replyWithHTML('Напишите подробное описание Ваших <b>услуг</b>? Коротко расскажите о том, что Вы <b>предлогаете</b>? \n<i>Например, Предлогаю услуги няни у себя на дому</i>')
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

priceStep.action('remote', async ctx => {
    try {
        await ctx.answerCbQuery()
        ctx.wizard.state.data.price = 'Дистанционно'
        await ctx.replyWithHTML('Напишите подробное описание Ваших <b>услуг</b>? Коротко расскажите о том, что Вы <b>предлогаете</b>? \n<i>Например, Предлогаю услуги няни у себя на дому</i>')
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const classStep = new Composer()
classStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data.class = ctx.message.text;
        await ctx.replyWithHTML('Какой опыт у Вас в данной <b>сфере</b>? \n<i>Например, от 4 года</i>', Markup.inlineKeyboard([
            [Markup.button.callback('Нет опыта', 'no-experience')]
        ]))
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const experienceStep = new Composer()
experienceStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data.experience = ctx.message.text;
        await ctx.replyWithHTML('Укажите ссылку на <b>портфолио</b>:', Markup.inlineKeyboard([
            [Markup.button.callback('Нет портфолио', 'no-portfolio')]
        ]))
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

experienceStep.action('no-experience', async ctx => {
    try {
        await ctx.answerCbQuery()
        ctx.wizard.state.data.experience = 'Нет опыта'
        await ctx.replyWithHTML('Укажите ссылку на <b>портфолио</b>:')
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const portfolioStep = new Composer()
portfolioStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data.portfolio = ctx.message.text;
        const wizardData = ctx.wizard.state.data;
        await ctx.replyWithHTML(`<b>${wizardData.title}</b>\n${wizardData.price}\n${wizardData.city}\n\n<b>Требуемый опыт работы: ${wizardData.experience}</b>\n\n <b>Обязанности:</b>${wizardData.duty}\n\n<b>Требования:</b>\n ${wizardData.requirement}\n\n<b>Условия</b>\n${wizardData.condition}\n\n<b>Контакты:</b>\n${yesUndefined(wizardData.firstName)} ${yesUndefined(wizardData.lastName)} \nТелеграм: @${yesUndefined(wizardData.userName)}`);
    } catch (e) {
        console.log(e)
    }
})

portfolioStep.action('no-portfolio', async ctx => {
    try {
        await ctx.answerCbQuery()
        ctx.wizard.state.data.portfolio = 'Нет портфолио'
        const wizardData = ctx.wizard.state.data;
        await ctx.replyWithHTML(`<b>${wizardData.title}</b>\n${wizardData.city}\n${wizardData.price}\n\n<b>Опыт работы: ${wizardData.experience}</b>\n\n<b>Портфолио</b>\n${wizardData.portfolio}\n\n<b>Контакты:</b>\n${yesUndefined(wizardData.firstName)} ${yesUndefined(wizardData.lastName)} \nТелеграм: @${yesUndefined(wizardData.userName)}`);
        await ctx.replyWithHTML(`Ваше резюме успешно отправлено Администратору!`);
        await ctx.telegram.sendMessage(1954192936, `<b>Услуги</b>\n\n<b>${wizardData.title}</b>\n${wizardData.city}\n${wizardData.price}\n\n<b>Опыт работы: ${wizardData.experience}</b>\n\n<b>Портфолио</b>\n${wizardData.portfolio}\n\n<b>Контакты:</b>\n${yesUndefined(wizardData.firstName)} ${yesUndefined(wizardData.lastName)} \nТелеграм: @${yesUndefined(wizardData.userName)}`, {
            parse_mode: "HTML"
        });
        return ctx.scene.leave();
    } catch (e) {
        console.log(e)
    }
})

const servicesScene = new Scenes.WizardScene('servicesWizard', startStep, titleStep, priceStep, classStep, experienceStep, portfolioStep)
module.exports = servicesScene