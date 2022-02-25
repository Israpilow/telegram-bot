const { Markup, Composer, Scenes} = require('telegraf')
const yesUndefined = name => typeof name === 'undefined' ? '' : name;

const startStep = new Composer()
startStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.userName = ctx.message.from.username
        ctx.wizard.state.data.firstName = ctx.message.from.first_name
        ctx.wizard.state.data.lastName = ctx.message.from.last_name
        ctx.wizard.state.data.condition = ctx.message.text;
        await ctx.replyWithHTML('Какую <b>спецтехнику</b> Вы хотите выставить?\n<i>Например, КамАЗ(самосвал)</i>');
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const mileageStep = new Composer()
mileageStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data.mileage = ctx.message.text;
        await ctx.replyWithHTML('Какой <b>пробег</b>?<i>Например, 489 000км.</i>', Markup.inlineKeyboard([
            [Markup.button.callback('Неизвестно', 'no-mileage')]
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
        await ctx.replyWithHTML('Укажите <b>цену</b>?<i>Например, 350,000 руб.</i>')
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

cityStep.action('no-mileage', async ctx => {
    try {
        await ctx.answerCbQuery()
        ctx.wizard.state.data.experience = 'Неизвестно'
        await ctx.replyWithHTML('Укажите <b>цену</b>?<i>Например, 350,000 руб.</i>')
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const priceStep = new Composer()
priceStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data.price = ctx.message.text;
        await ctx.replyWithHTML('Сколько <b>лошадинных сил</b>?\n<i>Например, 130</i>', Markup.inlineKeyboard([
            [Markup.button.callback('Неизвестно', 'no-price')]
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
        await ctx.replyWithHTML('Какая <b>Коро́бка перемены переда́ч(КПП)</b>?\n<i>Например, Механика</i>', Markup.inlineKeyboard([
            [Markup.button.callback('Механика', 'no-box'), Markup.button.callback('Автомат', 'no-box2')]
        ]));
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

experienceStep.action('no-price', async ctx => {
    try {
        await ctx.answerCbQuery()
        ctx.wizard.state.data.experience = 'Неизвестно'
        await ctx.replyWithHTML('Какая <b>Коро́бка переда́ч</b>?\n<i>Например, Автомат</i>', Markup.inlineKeyboard([
            [Markup.button.callback('Механика', 'no-box'), Markup.button.callback('Автомат', 'no-box2')]
        ]));
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const dutyStep = new Composer()
dutyStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data.duty = ctx.message.text;
        await ctx.replyWithHTML('Какой <b>Тип двигателя</b>\n<i>Например, Бензин</i>')
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

dutyStep.action('no-box', async ctx => {
    try {
        await ctx.answerCbQuery()
        ctx.wizard.state.data.duty = 'Механика'
        await ctx.replyWithHTML('Какой <b>Тип двигателя</b>\n<i>Например, Бензин</i>')
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

dutyStep.action('no-box2', async ctx => {
    try {
        await ctx.answerCbQuery()
        ctx.wizard.state.data.duty = 'Автомат'
        await ctx.replyWithHTML('Какой <b>Тип двигателя</b>\n<i>Например, Бензин</i>')
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const requirementStep = new Composer()
requirementStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data.requirement = ctx.message.text;
        await ctx.replyWithHTML('Напишите <b>описание</b> спецтехники:\n<i>Например, Камаз-манипулятор, хорошо оборудован,грузоподъёмность 8 тонн, вылет стрелы 13 метров.</i>')
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const contactsStep = new Composer()
contactsStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data.contacts = ctx.message.text;
        await ctx.replyWithHTML('Как с Вами можно <b>связаться</b>\n<i>Например, 89898989898</i>')
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
        await ctx.replyWithHTML(`Отправьте фото <b>товара</b> альбомом\n<i>Как это сделать, видео ниже </i>`);

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
        await ctx.replyWithHTML(`<b>${wizardData.mileage}</b>\n${wizardData.price}\n${wizardData.city}\n\n<b>Лошадинных сил: ${wizardData.experience}</b>\n\n<b>Коробка передач:</b>${wizardData.duty}\n\n<b>Тип двигателя:</b>\n ${wizardData.requirement}\n\n<b>Описание</b>\n${wizardData.contacts}\n\n<b>Контакты:</b>\n${yesUndefined(wizardData.firstName)} ${yesUndefined(wizardData.lastName)} \n${yesUndefined(wizardData.photo)}`);
        await ctx.replyWithHTML(`Ваша вакансия успешно отправлена Администратору!`);
        await ctx.telegram.sendMessage(1954192936, `<b>Авто</b>\n\n<b>${wizardData.mileage}</b>\n${wizardData.price}\n${wizardData.city}\n\n<b>Лошадинных сил: ${wizardData.experience}</b>\n\n <b>Коробка передач:</b>${wizardData.duty}\n\n<b>Тип двигателя:</b>\n ${wizardData.requirement}\n\n<b>Описание</b>\n${wizardData.contacts}\n\n<b>Контакты:</b>\n${yesUndefined(wizardData.firstName)} ${yesUndefined(wizardData.lastName)} \n${yesUndefined(wizardData.condition)}`, {
            parse_mode: "HTML"
        });
        return ctx.scene.leave();
    } catch (e) {
        console.log(e)
    }
})

const specialScene = new Scenes.WizardScene('specialWizard', startStep, mileageStep, cityStep, priceStep, experienceStep, dutyStep, requirementStep, contactsStep, photoStep, conditionStep)
module.exports = specialScene