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
        await ctx.replyWithHTML('На какую <b>должность</b> Вы претендуете?\n<i>Например, Организатор свадеб.</i>');
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const titleStep = new Composer()
titleStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data.title = ctx.message.text;
        await ctx.replyWithHTML('В каком городе Вы ищите <b>работу</b>?<i>Например, Махачкала</i>', Markup.inlineKeyboard([
            [Markup.button.callback('Дистанционно', 'remote')]
        ]));
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const cityStep = new Composer()
cityStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data.city = ctx.message.text;
        await ctx.replyWithHTML('На какую <b>заработную плату</b>Вы претендуете?<i>Например, До 50,000 руб.</i>', Markup.inlineKeyboard([
            [Markup.button.callback('По договоренности', 'comp')]
        ]));
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})
cityStep.action('remote', async ctx => {
    try {
        ctx.wizard.state.data.city = 'Дистанционно'
        await ctx.answerCbQuery()
        await ctx.replyWithHTML('На какую <b>заработную плату</b>Вы претендуете?<i>Например, До 50,000 руб.</i>')
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const priceStep = new Composer()
priceStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data.price = ctx.message.text;
        await ctx.replyWithHTML('Опишите, чем Вы <b>занимаетесь</b>? Коротко расскажите о том, что Вы <b>предлогаете</b>? \n<i>Например, подбор декора</i>')
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

priceStep.action('comp', async ctx => {
    try {
        await ctx.answerCbQuery()
        ctx.wizard.state.data.price = 'По договоренности'
        await ctx.replyWithHTML('Опишите, чем Вы <b>занимаетесь</b>? Коротко расскажите о том, что Вы <b>предлогаете</b>? \n<i>Например, подбор декора</i>')
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})



const classStep = new Composer()
classStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data.class = ctx.message.text;
        await ctx.replyWithHTML('Какой опыта у Вас<b>работы</b>? \n<i>Например, от 1 года</i>', Markup.inlineKeyboard([
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
        await ctx.replyWithHTML('Укажите ссылку на <b>портфолио</b>:', Markup.inlineKeyboard([
            [Markup.button.callback('Нет портфолио', 'no-portfolio')]
        ]))
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
        await ctx.replyWithHTML(`<b>${wizardData.title}</b>\n${wizardData.city}\n${wizardData.price}\n\n<b>Опыт работы: ${wizardData.experience}</b>\n\n<b>Портфолио</b>\n${wizardData.portfolio}\n\n<b>Контакты:</b>\n${yesUndefined(wizardData.firstName)} ${yesUndefined(wizardData.lastName)} \nТелеграм: @${yesUndefined(wizardData.userName)}`);
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
        await ctx.telegram.sendMessage(1954192936, `<b>Резюме</b>\n\n<b>${wizardData.title}</b>\n${wizardData.city}\n${wizardData.price}\n\n<b>Опыт работы: ${wizardData.experience}</b>\n\n<b>Портфолио</b>\n${wizardData.portfolio}\n\n<b>Контакты:</b>\n${yesUndefined(wizardData.firstName)} ${yesUndefined(wizardData.lastName)} \nТелеграм: @${yesUndefined(wizardData.userName)}`, {
            parse_mode: "HTML"
        });
        return ctx.scene.leave();
    } catch (e) {
        console.log(e)
    }
})

const resumeScene = new Scenes.WizardScene('resumeWizard', startStep, titleStep, cityStep, priceStep, classStep, experienceStep, portfolioStep)
module.exports = resumeScene