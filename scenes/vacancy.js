const { Markup, Composer, Scenes, Telegraf} = require('telegraf')
const yesUndefined = name => typeof name === 'undefined' ? '' : name;

const startStep = new Composer()
startStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.userName = ctx.message.from.username
        ctx.wizard.state.data.firstName = ctx.message.from.first_name
        ctx.wizard.state.data.lastName = ctx.message.from.last_name
        ctx.wizard.state.data.condition = ctx.message.text;
        await ctx.replyWithHTML('Какого <b>специалиста</b> Вы ищите?\n<i>Например, Менеджер по продаже автомобилей</i>');
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const titleStep = new Composer()
titleStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data.title = ctx.message.text;
        await ctx.replyWithHTML('Укажите форму занятости. В каком городе требуется <b>специалист</b>?<i>Например, Махачкала</i>', Markup.inlineKeyboard([
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
        await ctx.replyWithHTML('Укажите <b>заработную плату</b>?<i>Например, До 50,000 руб.</i>')
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})
cityStep.action('remote', async ctx => {
    try {
        ctx.wizard.state.data.city = 'Дистанционно'
        await ctx.answerCbQuery()
        await ctx.replyWithHTML('Укажите <b>заработную плату</b>?<i>Например, До 50,000 руб.</i>')
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const priceStep = new Composer()
priceStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data.price = ctx.message.text;
        await ctx.replyWithHTML('Требуется ли <b>опыт работы</b>? Укажите какой\n<i>Например, от 1 года</i>', Markup.inlineKeyboard([
            [Markup.button.callback('Не требуется', 'no-experience')]
        ]));
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const experienceStep = new Composer()
experienceStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data.experience = ctx.message.text;
        await ctx.replyWithHTML('Какие <b>обязанности</b>? несет должность\n<i>Например, Прием входящих звонков</i>')
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

experienceStep.action('no-experience', async ctx => {
    try {
        await ctx.answerCbQuery()
        ctx.wizard.state.data.experience = 'Не требуется'
        await ctx.replyWithHTML('Какие <b>обязанности</b>? несет должность\n<i>Например, Прием входящих звонков</i>')
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const dutyStep = new Composer()
dutyStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data.duty = ctx.message.text;
        await ctx.replyWithHTML('Укажите <b>требования</b> к соискателю:\n<i>Например, Грамотная речь</i>')
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const requirementStep = new Composer()
requirementStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data.requirement = ctx.message.text;
        await ctx.replyWithHTML('Укажите <b>условия</b> работы:\n<i>Например, График работы 5/2 с плавающими выходными</i>')
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})


const conditionStep = new Composer()
conditionStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data.condition = ctx.message.text;
        const wizardData = ctx.wizard.state.data;
        await ctx.replyWithHTML(`<b>${wizardData.title}</b>\n${wizardData.price}\n${wizardData.city}\n\n<b>Требуемый опыт работы: ${wizardData.experience}</b>\n\n <b>Обязанности:</b>${wizardData.duty}\n\n<b>Требования:</b>\n ${wizardData.requirement}\n\n<b>Условия</b>\n${wizardData.condition}\n\n<b>Контакты:</b>\n${yesUndefined(wizardData.firstName)} ${yesUndefined(wizardData.lastName)} \nТелеграм: @${yesUndefined(wizardData.userName)}`);
        await ctx.replyWithHTML(`Ваша вакансия успешно отправлена Администратору!`);
        await ctx.telegram.sendMessage(1954192936, `<b>Вакансия</b>\n\n<b>${wizardData.title}</b>\n${wizardData.price}\n${wizardData.city}\n\n<b>Требуемый опыт работы: ${wizardData.experience}</b>\n\n <b>Обязанности:</b>${wizardData.duty}\n\n<b>Требования:</b>\n ${wizardData.requirement}\n\n<b>Условия</b>\n${wizardData.condition}\n\n<b>Контакты:</b>\n${yesUndefined(wizardData.firstName)} ${yesUndefined(wizardData.lastName)} \nТелеграм: @${yesUndefined(wizardData.userName)}`, {
            parse_mode: "HTML"
        });
        return ctx.scene.leave();
    } catch (e) {
        console.log(e)
    }
})

const vacancyScene = new Scenes.WizardScene('vacancyWizard', startStep, titleStep, cityStep, priceStep, experienceStep, dutyStep, requirementStep, conditionStep)
module.exports = vacancyScene