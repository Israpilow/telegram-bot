const { Markup, Composer, Scenes } = require('telegraf')
// const sequelize = require('../db')
// const UserModel = require('../models')
const yesUndefined = name => typeof name === 'undefined' || 'Object' ? '' : name;
// const start = async () => {

//     try {
//         await sequelize.authenticate();
//         await sequelize.sync();
//     } catch (e) {
//         console.log(e)
//     }
// }





const photos = {}

const startStep = new Composer()
startStep.on('text', async ctx => {
    try {
        photos[ctx.from.id] = []
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.userName = ctx.message.from.username
        ctx.wizard.state.data.firstName = ctx.message.from.first_name
        ctx.wizard.state.data.userName = ctx.message.from.last_name
        ctx.wizard.state.data.condition = ctx.message.text;
        ctx.wizard.state.formData = {}
        await ctx.replyWithHTML('<b>ШАБЛОН ДЛЯ ЗАПОЛНЕНИЯ КВАРТИРЫ</b>\n\n<i>1. Название объявления\n2. Описание объявления\n3. Цена\n4. Адрес\n5. Контакты</i>');
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
});

const photoStep = new Composer()
photoStep.on('text', async ctx => {
    try {
        // await sequelize.authenticate();
        // await sequelize.sync();

        const text = ctx.message;
        const chatId = ctx.chat.id

        ctx.wizard.state.data.photo = ctx.message.text;
        const wizardData = ctx.wizard.state.data;
        ctx.wizard.state.formData.photoTool = ctx.message

        

        // console.log(chatId)

        await ctx.replyWithHTML(`Отправьте <b>фотографии</b> в одном сообщении\n<i>На данный момент не более 1</i>`);
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const conditionStep = new Composer()
conditionStep.on('photo', async ctx => {
    try {

        // ctx.wizard.state.data.condition = ctx.message
        // const wizardData = ctx.wizard.state.data;
        // // ctx.wizard.state.formData.photoTool = ctx.message.photo[ctx.message.photo.length - 1].file_id
        
        // // const formData = ctx.wizard.state.formData
        
        // // await UserModel.findAll( {
        // //     raw: true
        // // }).then(async (tools) => {
        // //     console.log(tools)
        // // })
        

        // // await UserModel.create({
        // //     chatId: formData.photoTool
        // // })
        // // console.log(chatId1)
        // // console.log(chatId2)
        // //
        // // await ctx.replyWithMediaGroup(1954192936, condition)
        // // await ctx.replyWithHTML(`Ваше <b>объявление</b> успешно отправлена Администратору!`);

        // await ctx.replyWithHTML(`Ваше <b>объявление</b> успешно отправлена Администратору!`);
        // await ctx.forwardMessage(1954192936, `<b>НЕДВИЖОМОСТИ</b>\n\n${wizardData.photo}`);
        // await ctx.telegram.sendMessage(1954192936, `<b>НЕДВИЖОМОСТИ</b>\n\n${wizardData.photo}`, {
        //     parse_mode: "HTML"
        // });
        // await ctx.copyMessage(1954192936, wizardData.condition)
        // // await ctx.copyMessage(1954192936, wizardData.condition)
        // // if (wizardData.condition.text == '/done') {

            
            
        // //     // let chatId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
        // //     // console.log(chatId)
        // //     // let result = chatId.map(city => {
        // //     //     return {
        // //     //         type: 'photo',
        // //     //         media: {
        // //     //             source: city
        // //     //         }
        // //     //     }
        // //     // })
        // //     // await ctx.telegram.sendMediaGroup(1954192936, result )
            
            
        // // }

        // await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
        //     [Markup.button.callback('\u{1F4E2}Подать объявление\u{1F4E2}', 'btn1')],
        //     [Markup.button.callback('\u{1F4E2}Канал с объявлениями\u{1F4E2}', 'btn2')],
        //     [Markup.button.callback('Поддержка', 'btn3')]
        // ]).oneTime().resize())

        // return ctx.scene.leave();

        // await ctx.copyMessage(974900206, wizardData.condition);

        ctx.wizard.state.data.condition = ctx.message;
        const wizardData = ctx.wizard.state.data;
        await ctx.replyWithHTML(`${wizardData.photo}`);
        await ctx.replyWithHTML(`Ваше <b>объявление</b> успешно отправлена Администратору!`);
        await ctx.telegram.sendMessage(1954192936, `<b>КВАРТИРЫ</b>\n\n${wizardData.photo}`, {
            parse_mode: "HTML"
        });
        await ctx.telegram.sendMessage(974900206, `<b>КВАРТИРЫ</b>\n\n${wizardData.photo}`, {
            parse_mode: "HTML"
        });
        await ctx.copyMessage(1954192936, wizardData.condition);

        await ctx.copyMessage(974900206, wizardData.condition);
        await ctx.reply('Выберите один из вариантов:', Markup.keyboard([
            [Markup.button.callback('\u{1F4E2}Подать объявление\u{1F4E2}', 'btn1')],
            [Markup.button.callback('\u{1F4E2}Канал с объявлениями\u{1F4E2}', 'btn2')],
            [Markup.button.callback('Поддержка', 'btn3')]
        ]).oneTime().resize())
        
    } catch (e) {
        console.log(e)
    }
})

conditionStep.on('document', async ctx => {
    try {
        ctx.wizard.state.data.condition = ctx.message;
        const wizardData = ctx.wizard.state.data;
        await ctx.replyWithHTML(`${wizardData.photo}`);
        await ctx.replyWithHTML(`Ваше <b>объявление</b> успешно отправлена Администратору!`);
        await ctx.telegram.sendMessage(1954192936, `<b>КВАРТИРЫ</b>\n\n${wizardData.photo}`, {
            parse_mode: "HTML"
        });
        // await ctx.telegram.sendMessage(974900206, `<b>КВАРТИРЫ</b>\n\n${wizardData.photo}`, {
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

const propertyScene = new Scenes.WizardScene('propertyWizard', startStep, photoStep, conditionStep)
module.exports = propertyScene