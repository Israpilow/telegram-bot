const { Markup, Composer, Scenes } = require('telegraf')
const yesUndefined = name => typeof name === 'undefined' || 'Object' ? '' : name;

const startStep = new Composer()
startStep.on('text', async ctx => {
    try {
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.userName = ctx.message.from.username
        ctx.wizard.state.data.firstName = ctx.message.from.first_name
        ctx.wizard.state.data.lastName = ctx.message.from.last_name
        ctx.wizard.state.data.start = ctx.message.text;
        await ctx.replyWithHTML('<b>ШАБЛОН ДЛЯ ЗАПОЛНЕНИЯ УСЛУГ</b>\n\n<i>1. Вид предостовляемых услуг\n2. Подробное описание\n3. Условия\n4. Опыт в данной сфере\n5. Город\n6. Контакты</i>');
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
        await ctx.replyWithHTML(`<b>${wizardData.condition}</b>`);
        await ctx.replyWithHTML(`Ваше <b>объявление</b> успешно отправлена Администратору!`);
        await ctx.telegram.sendMessage(1954192936, `<b>РЕЗЮМЕ</b>\n\n<b>${wizardData.condition}</b>`, {
            parse_mode: "HTML"
        });
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

const servicesScene = new Scenes.WizardScene('servicesWizard', startStep, conditionStep)
module.exports = servicesScene